import { NextResponse } from "next/server";
import { site } from "@/lib/site";

// Partner program sign-ups. Emailed to the team through Resend (same settings as the contact form).
// Not sent to the grower CRM, since partners are not farms.

const LIMITS: Record<string, number> = { name: 100, company: 150, email: 150, phone: 30, role: 60, state: 80, message: 3000 };

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
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const f: Record<string, string> = {};
  for (const [key, max] of Object.entries(LIMITS)) f[key] = clean(body[key], max);
  if (!f.name || !f.company || !f.state || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    return NextResponse.json({ error: "Please fill in your name, company, state and a valid email." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return NextResponse.json({ error: `Our form isn't connected yet. Please call ${site.phone} or email ${site.email}.` }, { status: 503 });
  }

  const rows = [["Name", f.name], ["Company", f.company], ["Email", f.email], ["Phone", f.phone], ["Role", f.role], ["State(s)", f.state], ["Message", f.message]];
  const html = `<h2>New partner inquiry</h2><table>${rows
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v || "-").replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: f.email, subject: `Partner inquiry: ${f.company} (${f.state})`, html }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: `We couldn't send that. Please call ${site.phone} or email ${site.email}.` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
