import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { fmt, type Plan, type PlanItem } from "@/lib/season-plan";
import { site } from "@/lib/site";

// The grower's full season plan as a printable PDF, attached to the plan email.
const NAVY = rgb(0.106, 0.188, 0.255);
const GRAY = rgb(0.33, 0.33, 0.33);
const LINE = rgb(0.8, 0.8, 0.8);

export async function planToPdf(plan: Plan, stateName?: string): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.setTitle("H-2A Season Plan");
  doc.setAuthor(site.legalName);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 612, H = 792, M = 48, DATE_W = 125;
  let page = doc.addPage([W, H]);
  let y = H - M;

  const wrap = (text: string, font: typeof reg, size: number, width: number) => {
    const lines: string[] = [];
    let cur = "";
    for (const w of text.split(/\s+/)) {
      const t = cur ? `${cur} ${w}` : w;
      if (font.widthOfTextAtSize(t, size) > width && cur) { lines.push(cur); cur = w; } else cur = t;
    }
    if (cur) lines.push(cur);
    return lines;
  };
  const ensure = (h: number) => { if (y - h < M) { page = doc.addPage([W, H]); y = H - M; } };
  const draw = (t: string, x: number, size: number, font = reg, color = rgb(0.07, 0.07, 0.07)) => page.drawText(t, { x, y, size, font, color });
  const para = (t: string, x: number, size: number, font = reg, color = rgb(0.07, 0.07, 0.07)) => {
    for (const l of wrap(t, font, size, W - M - x)) { ensure(size + 3); draw(l, x, size, font, color); y -= size + 3; }
  };

  draw(`${site.legalName.toUpperCase()}  |  H-2A SEASON PLAN${stateName ? `  |  ${stateName.toUpperCase()}` : ""}`, M, 8.5, bold, GRAY);
  y -= 22;
  para(`Season: ${fmt(plan.s)} to ${fmt(plan.end)}`, M, 15, bold, NAVY);
  y -= 6;
  const keys: [string, string][] = [
    ["Submit job order", `${fmt(plan.jobOrderOpens)} to ${fmt(plan.jobOrderLast)}`],
    ["File DOL application by", fmt(plan.dolLast)],
    ["Expected DOL decision", fmt(plan.cert)],
    ["Crew arrives", fmt(plan.s)],
    ["Halfway point", fmt(plan.half)],
    ["Keep records until at least", fmt(plan.keepUntil)],
  ];
  for (const [k, v] of keys) { draw(k, M, 9.5, reg, GRAY); draw(v, M + 150, 9.5, bold); y -= 14; }
  y -= 6;

  const section = (title: string, items: PlanItem[]) => {
    ensure(50);
    y -= 6;
    draw(title, M, 12, bold, NAVY);
    y -= 6;
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1.5, color: NAVY });
    y -= 14;
    for (const it of items) {
      const x = M + DATE_W;
      const dateText = it.ongoing ? `From ${it.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : it.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      ensure(40);
      draw(dateText, M, 9.5, bold);
      draw(it.title, x, 10, bold);
      y -= 13;
      para(it.detail + (it.rule ? ` (20 CFR 655.${it.rule})` : ""), x, 9, reg, GRAY);
      for (const r of it.records ?? []) {
        const lines = wrap(r, reg, 8.5, W - M - x - 10);
        lines.forEach((l, i) => {
          ensure(12);
          if (i === 0) page.drawRectangle({ x, y: y + 0.5, width: 6, height: 6, borderColor: GRAY, borderWidth: 0.7 });
          draw(l, x + 10, 8.5);
          y -= 11;
        });
      }
      y -= 5;
      page.drawLine({ start: { x: M, y: y + 3 }, end: { x: W - M, y: y + 3 }, thickness: 0.5, color: LINE });
      y -= 8;
    }
  };
  section("Before your crew arrives", plan.before);
  section("During the season", plan.during);
  section("After the season", plan.after);
  para("A planning guide based on the H-2A rules at 20 CFR Part 655, not legal advice.", M, 8, reg, GRAY);
  para(`Questions? Battenkill Ag | ${site.phone} | ${site.email} | battenkillag.com`, M, 8, reg, GRAY);
  return Buffer.from(await doc.save());
}
