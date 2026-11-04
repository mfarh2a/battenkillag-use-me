import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/lib/site";
import { sendToCrm } from "@/lib/crm";
import { fillChecklist, isValidDate } from "@/lib/checklist-workbook";
import { buildPlan, fmt, parseDate } from "@/lib/season-plan";
import { planToPdf } from "@/lib/plan-pdf";
import { planToIcs } from "@/lib/plan-ics";
import { aewrFor, states } from "@/lib/states";
import contactsData from "@/content/state-contacts.json";

// Free audit checklist download.
// 1. Checks the visitor's name and email.
// 2. Emails the visitor the Excel checklist (needs a verified sending domain in Resend).
// 3. Emails Max the new lead (CONTACT_TO_EMAIL).
// 4. If the visitor gave season dates, fills them into the workbook and adds their plan as a PDF to the email.
// 5. Sends the file back so the download starts right away, even if email isn't set up yet.
// Uses the same RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL as the contact form.

const FILE_NAME = "Battenkill-Ag-H2A-Audit-Checklist.xlsx";
const ICS_NAME = "H2A-Season-Deadlines.ics";
type Contact = { office: string; phone?: string; email?: string; url?: string; note?: string };
const contacts = contactsData as Record<string, Contact>;
// Replies to the customer email go to the sales inbox.
const REPLY_TO = "sales@battenkillag.com";

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
  const adSource = clean(body.adSource, 200);
  const phone = clean(body.phone, 30);
  const stateRaw = clean(body.state, 40);
  if (!name || !farm || !phone || !stateRaw || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please fill in your name, farm, phone, state and a valid email." }, { status: 400 });
  }

  const startRaw = clean(body.start, 10);
  const endRaw = clean(body.end, 10);
  const start = isValidDate(startRaw) ? startRaw : "";
  const end = start && isValidDate(endRaw) && endRaw > start ? endRaw : "";
  const stateKey = stateRaw.toLowerCase();
  const state = states.find((s) => s.slug === stateKey || s.name.toLowerCase() === stateKey || s.abbr.toLowerCase() === stateKey);
  const plan = start && end ? buildPlan(start, end) : null;

  await sendToCrm({
    source: "newsletter",
    name,
    email,
    farm,
    phone,
    state: state?.name || stateRaw,
    startMonth: start ? parseDate(start).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : undefined,
    message: [plan ? "Requested season plan and audit checklist" : "", adSource ? `[Ad source: ${adSource}]` : ""].filter(Boolean).join(" ") || undefined,
    adSource,
  });

  const template = await readFile(path.join(process.cwd(), "content", "downloads", FILE_NAME));
  let file: Buffer = template;
  if (start) {
    try {
      file = await fillChecklist(template, { start, end: end || undefined, farm: farm || undefined, stateName: state?.name });
    } catch (err) {
      // Never lose the lead over this: fall back to the blank workbook.
      console.error("Could not fill checklist dates", err);
    }
  }
  const base64 = file.toString("base64");
  let planPdf = "";
  if (plan) {
    try {
      const aewr = state ? aewrFor(state.name) : null;
      planPdf = (await planToPdf(plan, state?.name, state ? { contact: contacts[state.abbr] ?? null, aewr: aewr ? { h1: aewr.h1, h2: aewr.h2, effective: aewr.effective } : null } : undefined)).toString("base64");
    } catch (err) {
      // Never lose the lead over this: the email still has the key dates.
      console.error("Could not build plan PDF", err);
    }
  }
  let ics = "";
  if (plan) {
    try {
      ics = Buffer.from(planToIcs(plan, state?.name)).toString("base64");
    } catch (err) {
      // Never lose the lead over this: the plan PDF and checklist still go out.
      console.error("Could not build calendar file", err);
    }
  }
  const planRows = plan
    ? [
        ["Submit job order", `${fmt(plan.jobOrderOpens)} to ${fmt(plan.jobOrderLast)}`],
        ["File DOL application by", fmt(plan.dolLast)],
        ["Expected DOL decision", fmt(plan.cert)],
        ["Crew arrives", fmt(plan.s)],
        ["Halfway point", fmt(plan.half)],
        ["Contract ends", fmt(plan.end)],
        ["Keep records until at least", fmt(plan.keepUntil)],
      ]
        .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#555">${k}</td><td style="padding:4px 0"><strong>${v}</strong></td></tr>`)
        .join("")
    : "";

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  let emailed = false;

  if (apiKey && from) {
    const first = escapeHtml(name.split(/\s+/)[0]);
    emailed = await sendEmail(apiKey, {
      from,
      to: [email],
      reply_to: REPLY_TO,
      subject: plan ? "Your H-2A season plan and audit checklist from Battenkill Ag" : "Your H-2A audit-ready checklist from Battenkill Ag",
      html: `<p>Hi ${first},</p>
${plan ? `<p>Here are your key H-2A dates${state ? ` for ${escapeHtml(state.name)}` : ""}. ${planPdf ? "Your full plan, with every deadline and the records to save along the way, is attached as a PDF you can print." : ""}</p>
<table style="border-collapse:collapse">${planRows}</table>
${ics ? "<p>The attached calendar file (.ics) adds every deadline to Outlook, Google Calendar or Apple Calendar, with a reminder 2 weeks and 2 days before each one.</p>" : ""}` : ""}
<p>${start ? "Your dates are already filled in on the Season Info tab. " : ""}Your H-2A audit-ready checklist is attached. It lists the records DOL can ask for, tracks what you have, and includes a recruitment tracker for logging every U.S. applicant and keeping your recruitment report current.</p>
<p>When we work with customers, we help them stay on top of documents, deadlines, billing and more. The workbook links each record to an easy-to-follow guide and the official rule, and the Resources tab points you to more help on housing, wages and travel. If you would like to talk about next season, just reply to this email.</p>
<p>The Battenkill Ag team<br>${escapeHtml(site.phone)} | ${escapeHtml(site.email)}</p>
<p style="color:#777;font-size:12px">General information, not legal advice.</p>`,
      attachments: [
        { filename: FILE_NAME, content: base64 },
        ...(planPdf ? [{ filename: "H2A-Season-Plan.pdf", content: planPdf }] : []),
        ...(ics ? [{ filename: ICS_NAME, content: ics }] : []),
      ],
    });

    if (to) {
      await sendEmail(apiKey, {
        from,
        to: [to],
        reply_to: email,
        subject: `Checklist download: ${name}${farm ? ` (${farm})` : ""}`,
        html: `<h2>New checklist download</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Farm:</strong> ${escapeHtml(farm || "-")}<br><strong>Phone:</strong> ${escapeHtml(phone)}<br><strong>State:</strong> ${escapeHtml(state?.name || stateRaw)}<br><strong>Start date:</strong> ${escapeHtml(start || "-")}<br><strong>Ad source:</strong> ${escapeHtml(adSource || "-")}</p>
<p>Copy of the checklist emailed to them: ${emailed ? "yes" : "no (check the Resend sending domain)"}</p>`,
      });
    }
  }

  return NextResponse.json({ ok: true, emailed, fileName: FILE_NAME, file: base64, ...(ics ? { ics, icsName: ICS_NAME } : {}) });
}
