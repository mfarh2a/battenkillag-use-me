import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/lib/site";
import { sendToCrm } from "@/lib/crm";

// Free audit checklist download.
// 1. Checks the visitor's name and email.
// 2. Emails the visitor the Excel checklist (needs a verified sending domain in Resend).
// 3. Emails Max the new lead (CONTACT_TO_EMAIL).
// 4. Sends the file back so the download starts right away, even if email isn't set up yet.
// Uses the same RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL as the contact form.

const FILE_NAME = "Battenkill-Ag-H2A-Audit-Checklist.xlsx";

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "We couldn't read that request." }, { status: 400 });
  }

  // Spam trap: real people never fill in the hidden "website" field.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true, emailed: false });

  const name = clean(body.name, 100);
  const email = clean(body.email, 150);
  const farm = clean(body.farm, 150);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter your name and a valid email." }, { status: 400 });
  }

  await sendToCrm({ source: "newsletter", name, email, farm });

  const file = await readFile(path.join(process.cwd(), "content", "downloads", FILE_NAME));
  const base64 = file.toString("base64");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  let emailed = false;

  if (apiKey && from) {
    const first = escapeHtml(name.split(/\s+/)[0]);
    emailed = await sendEmail(apiKey, {
      from,
      to: [email],
      reply_to: to || undefined,
      subject: "Your H-2A audit-ready checklist from Battenkill Ag",
      html: `<p>Hi ${first},</p>
<p>Your H-2A audit-ready checklist is attached. It lists the records DOL can ask for, tracks what you have, and works out the 2-working-day notice deadline if a worker leaves.</p>
<p>Battenkill Ag customers can add a digital filing cabinet that tracks these records automatically, organized by requirement. The workbook links each record to a plain-English guide and the official rule, and the Resources tab points you to more help on housing, wages and travel. If you would like a quote for next season, just reply to this email.</p>
<p>The Battenkill Ag team<br>${escapeHtml(site.phone)} | ${escapeHtml(site.email)}</p>
<p style="color:#777;font-size:12px">General information, not legal advice.</p>`,
      attachments: [{ filename: FILE_NAME, content: base64 }],
    });

    if (to) {
      await sendEmail(apiKey, {
        from,
        to: [to],
        reply_to: email,
        subject: `Checklist download: ${name}${farm ? ` (${farm})` : ""}`,
        html: `<h2>New checklist download</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Farm:</strong> ${escapeHtml(farm || "-")}</p>
<p>Copy of the checklist emailed to them: ${emailed ? "yes" : "no (check the Resend sending domain)"}</p>`,
      });
    }
  }

  return NextResponse.json({ ok: true, emailed, fileName: FILE_NAME, file: base64 });
}
