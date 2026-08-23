import Link from "next/link";
import type { ReactNode } from "react";

// Dependency-free renderer for the subset of Markdown used by blog posts:
// headings (#, ##, ###), paragraphs, bullet and numbered lists, blockquotes,
// fenced code blocks, simple pipe tables, and inline **bold**, *italic*,
// `code`, [links](url) and ![images](url). Raw HTML is never rendered.

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re =
    /(!\[([^\]]*)\]\(([^)\s]+)\))|(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${i++}`;
    if (match[1]) {
      // eslint-disable-next-line @next/next/no-img-element
      out.push(<img key={key} src={match[3]} alt={match[2]} className="my-6 rounded-xl" loading="lazy" />);
    } else if (match[4]) {
      const href = match[6];
      const cls = "font-medium text-teal underline-offset-2 hover:underline";
      out.push(
        href.startsWith("/") ? (
          <Link key={key} href={href} className={cls}>{match[5]}</Link>
        ) : (
          <a key={key} href={href} className={cls} target="_blank" rel="noopener noreferrer">{match[5]}</a>
        )
      );
    } else if (match[7]) {
      out.push(<strong key={key} className="font-semibold text-navy">{match[8]}</strong>);
    } else if (match[9]) {
      out.push(<em key={key}>{match[10]}</em>);
    } else if (match[11]) {
      out.push(<code key={key} className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.875em] text-navy">{match[12]}</code>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  const flushParagraph = (buf: string[]) => {
    if (buf.length === 0) return;
    blocks.push(
      <p key={key++} className="leading-relaxed text-foreground/85">
        {inline(buf.join(" "), `p${key}`)}
      </p>
    );
    buf.length = 0;
  };

  const para: string[] = [];
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      flushParagraph(para);
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      flushParagraph(para);
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push(
        <pre key={key++} className="overflow-x-auto rounded-xl bg-navy-deep p-4 font-mono text-sm text-white/90">
          <code>{code.join("\n")}</code>
        </pre>
      );
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph(para);
      const level = heading[1].length;
      const text = inline(heading[2], `h${key}`);
      if (level === 1) blocks.push(<h2 key={key++} className="mt-10 text-2xl font-bold text-navy sm:text-3xl">{text}</h2>);
      else if (level === 2) blocks.push(<h2 key={key++} className="mt-10 text-2xl font-bold text-navy">{text}</h2>);
      else blocks.push(<h3 key={key++} className="mt-8 text-xl font-semibold text-navy">{text}</h3>);
      i++;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      flushParagraph(para);
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s+/, ""));
      blocks.push(
        <ul key={key++} className="list-disc space-y-2 pl-6 text-foreground/85">
          {items.map((item, n) => <li key={n}>{inline(item, `li${key}-${n}`)}</li>)}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      flushParagraph(para);
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+\.\s+/, ""));
      blocks.push(
        <ol key={key++} className="list-decimal space-y-2 pl-6 text-foreground/85">
          {items.map((item, n) => <li key={n}>{inline(item, `ol${key}-${n}`)}</li>)}
        </ol>
      );
      continue;
    }

    if (line.startsWith(">")) {
      flushParagraph(para);
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) quote.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(
        <blockquote key={key++} className="border-l-4 border-teal bg-teal/5 px-5 py-4 text-lg italic leading-relaxed text-navy">
          {inline(quote.join(" "), `q${key}`)}
        </blockquote>
      );
      continue;
    }

    if (line.trim().startsWith("|")) {
      flushParagraph(para);
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().slice(1, -1).split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={key++} className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-navy">
              <tr>{head.map((c, n) => <th key={n} className="px-4 py-2.5 font-semibold">{inline(c, `th${key}-${n}`)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((row, r) => (
                <tr key={r} className="border-t">
                  {row.map((c, n) => <td key={n} className="px-4 py-2.5 text-foreground/85">{inline(c, `td${key}-${r}-${n}`)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    para.push(line.trim());
    i++;
  }
  flushParagraph(para);

  return <div className="space-y-5">{blocks}</div>;
}
