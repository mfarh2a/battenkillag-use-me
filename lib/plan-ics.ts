import { add, iso, type Plan } from "@/lib/season-plan";
import { site } from "@/lib/site";

// The grower's season plan as a calendar file (.ics) that opens in Outlook, Google Calendar and Apple Calendar.
// Every dated step becomes an all-day event with reminders at 9 am, 14 days and 2 days before.
// Steps with no fixed date (like earnings statements every pay period) are left out.

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// Calendar lines may not run past 75 bytes; longer ones continue on the next line after a space.
function fold(line: string): string {
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const b = Buffer.byteLength(ch);
    if (bytes + b > 75) { out.push(cur); cur = " "; bytes = 1; }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.join("\r\n");
}

const ymd = (d: Date) => iso(d).replace(/-/g, "");

export function planToIcs(plan: Plan, stateName?: string): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const startKey = ymd(plan.s);
  const items = [...plan.before, ...plan.during, ...plan.after].filter((i) => !i.ongoing);
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${site.legalName}//H-2A Season Plan//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(`H-2A season plan${stateName ? ` (${stateName})` : ""}`)}`,
  ];
  items.forEach((it, n) => {
    const description = [
      it.detail + (it.rule ? ` (20 CFR 655.${it.rule})` : ""),
      it.records?.length ? `Records to save:\n${it.records.map((r) => `- ${r}`).join("\n")}` : "",
      `Battenkill Ag | ${site.phone} | ${site.email}\nA planning guide, not legal advice.`,
    ].filter(Boolean).join("\n\n");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${startKey}-${n}@${new URL(site.url).hostname}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(it.date)}`,
      `DTEND;VALUE=DATE:${ymd(add(it.date, 1))}`,
      `SUMMARY:${esc(it.title)}`,
      `DESCRIPTION:${esc(description)}`,
      "TRANSP:TRANSPARENT",
      "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(`In 14 days: ${it.title}`)}`, "TRIGGER:-P13DT15H", "END:VALARM",
      "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(`In 2 days: ${it.title}`)}`, "TRIGGER:-P1DT15H", "END:VALARM",
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
