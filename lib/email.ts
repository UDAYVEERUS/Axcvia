import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/data/site";

/**
 * Transactional email through Resend (https://resend.com).
 *
 *   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
 *   EMAIL_FROM=Axcvia <noreply@axcvia.com>    # domain must be verified in Resend
 *
 * Until the domain is verified, Resend only accepts its sandbox sender
 * (onboarding@resend.dev) and only delivers to your own account address.
 */

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

let client: Resend | null = null;

function getClient(): Resend {
  client ??= new Resend(process.env.RESEND_API_KEY!);
  return client;
}

export async function sendMail({ to, subject, html, text }: { to: string; subject: string; html: string; text: string }) {
  if (!isEmailConfigured()) throw new Error("Email is not configured (set RESEND_API_KEY and EMAIL_FROM)");
  const { data, error } = await getClient().emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
    text,
    replyTo: site.email,
  });
  if (error) throw new Error(error.message ?? "Resend rejected the email");
  return data;
}

/** Shared shell so every transactional email looks like the site. */
export function emailLayout({ heading, body, buttonLabel, buttonUrl, footNote }: {
  heading: string;
  body: string;
  buttonLabel?: string;
  buttonUrl?: string;
  footNote?: string;
}) {
  return `<!doctype html>
<html><body style="margin:0;background:#f4f6fa;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f2c5c">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden">
      <tr><td style="background:#0f2c5c;padding:20px 28px">
        <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.3px">AXCVIA</span>
        <span style="color:#22c3e0;font-size:12px;font-weight:600;margin-left:8px">LEARN. BUILD. SUCCEED.</span>
      </td></tr>
      <tr><td style="padding:28px">
        <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3">${heading}</h1>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#41506b">${body}</p>
        ${buttonUrl && buttonLabel ? `<a href="${buttonUrl}" style="display:inline-block;background:#0a7ea4;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:10px">${buttonLabel}</a>
        <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#6b7a94">If the button doesn't work, copy this link into your browser:<br><span style="color:#0a7ea4;word-break:break-all">${buttonUrl}</span></p>` : ""}
        ${footNote ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#6b7a94">${footNote}</p>` : ""}
      </td></tr>
      <tr><td style="background:#f4f6fa;padding:16px 28px;font-size:12px;color:#6b7a94">
        ${site.name} · ${site.phone} · <a href="mailto:${site.email}" style="color:#0a7ea4">${site.email}</a>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}
