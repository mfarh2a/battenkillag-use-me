import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { sendToCrm } from "@/lib/crm";

// Sends contact form requests to Max by email through Resend.
// Needs RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL set in Vercel.
// No files are ever accepted here.

const LIMITS: Record<string, number> = {
  name: 100, farm: 150, email: 150, phone: 30, state: 40,
  workers: 10, startMonth: 20, current: 60, message: 3000,
};

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "We couldn't read that request." }, { status: 400 });
  }

  // Spam trap: real people never fill in the hidden "website" field.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const f: Record<string, string> = {};
  for (const [key, max] of Object.entries(LIMITS)) f[key] = clean(body[key], max);

  if (!f.name || !f.farm || !f.state || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    return NextResponse.json({ error: "Please fill in your name, farm, state and a valid email." }, { status: 400 });
  }

  await sendToCrm({
    source: "contact", name: f.name, email: f.email, farm: f.farm, phone: f.phone, state: f.state,
    workers: f.workers, startMonth: f.startMonth, current: f.current, message: f.message,
  });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { error: `Our form isn't connected yet. Please call ${site.phone} or email ${site.email}.` },
      { status: 503 },
    );
  }

  const rows = [
    ["Name", f.name], ["Farm", f.farm], ["Email", f.email], ["Phone", f.phone],
    ["State", f.state], ["Workers needed", f.workers], ["Start month", f.startMonth],
    ["Uses H-2A today", f.current], ["Message", f.message],
  ];
  const html = `<h2>New quote request</h2><table>${rows
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v || "-").replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: f.email,
      subject: `Quote request: ${f.farm} (${f.state})`,
      html,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `We couldn't send that. Please call ${site.phone} or email ${site.email}.` },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
