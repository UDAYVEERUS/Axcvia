// Makes the white background of public/logo.png transparent (pure Node, no deps).
// Usage: node scripts/strip-logo-bg.mjs [input] [output]
import fs from "node:fs";
import zlib from "node:zlib";

const input = process.argv[2] ?? "public/logo.png";
const output = process.argv[3] ?? input;
const buf = fs.readFileSync(input);

// --- decode ---
let pos = 8, w, h, colorType, idat = [];
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos), type = buf.toString("ascii", pos + 4, pos + 8);
  if (type === "IHDR") { w = buf.readUInt32BE(pos + 8); h = buf.readUInt32BE(pos + 12); colorType = buf[pos + 17]; if (buf[pos + 16] !== 8) throw new Error("only 8-bit PNG supported"); }
  if (type === "IDAT") idat.push(buf.subarray(pos + 8, pos + 8 + len));
  pos += 12 + len;
}
if (colorType !== 6 && colorType !== 2) throw new Error("only RGB/RGBA PNG supported");
const bpp = colorType === 6 ? 4 : 3;
const raw = zlib.inflateSync(Buffer.concat(idat));
const stride = w * bpp;
const px = Buffer.alloc(w * h * 4);
let prev = Buffer.alloc(stride);
for (let y = 0; y < h; y++) {
  const filter = raw[y * (stride + 1)];
  const line = Buffer.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
  for (let i = 0; i < stride; i++) {
    const a = i >= bpp ? line[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
    let v = line[i];
    if (filter === 1) v += a; else if (filter === 2) v += b; else if (filter === 3) v += (a + b) >> 1;
    else if (filter === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
    line[i] = v & 255;
  }
  for (let x = 0; x < w; x++) {
    const s = x * bpp, d = (y * w + x) * 4;
    px[d] = line[s]; px[d + 1] = line[s + 1]; px[d + 2] = line[s + 2]; px[d + 3] = bpp === 4 ? line[s + 3] : 255;
  }
  prev = line;
}

// --- key out white: alpha = how far the pixel is from pure white (soft edges) ---
for (let i = 0; i < px.length; i += 4) {
  const dist = 255 - Math.min(px[i], px[i + 1], px[i + 2]);
  const alpha = Math.min(255, Math.round(dist * 1.15)); // slight boost so anti-aliased edges stay solid
  if (alpha < px[i + 3]) {
    // un-premultiply against white so edge pixels keep their true color
    if (alpha > 0) for (let k = 0; k < 3; k++) px[i + k] = Math.max(0, Math.min(255, Math.round((px[i + k] - 255 * (1 - alpha / 255)) / (alpha / 255))));
    px[i + 3] = alpha;
  }
}

// --- encode (RGBA, filter 0) ---
const out = Buffer.alloc(h * (w * 4 + 1));
for (let y = 0; y < h; y++) { out[y * (w * 4 + 1)] = 0; px.copy(out, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4); }
const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (b) => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td)); return Buffer.concat([l, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
fs.writeFileSync(output, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(out, { level: 9 })), chunk("IEND", Buffer.alloc(0))]));
console.log(`wrote ${output} (${w}x${h}, transparent background)`);
