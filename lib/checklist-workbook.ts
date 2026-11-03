import JSZip from "jszip";
import { add, iso, parseDate } from "@/lib/season-plan";

// Fills the Season Info tab of the checklist workbook with a grower's own dates.
// Edits the file directly so every format, link and formula in the template stays as it is.

const xml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c] as string));
const serial = (d: Date) => Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(1899, 11, 30)) / 86400000);
const text = (ref: string, style: number, value: string) => `<c r="${ref}" s="${style}" t="inlineStr"><is><t>${xml(value)}</t></is></c>`;

export async function fillChecklist(template: Buffer, opts: { start: string; end?: string; farm?: string; stateName?: string }): Promise<Buffer> {
  const zip = await JSZip.loadAsync(template);
  const path = "xl/worksheets/sheet2.xml";
  let sheet = await zip.file(path)!.async("string");
  const s = parseDate(opts.start);
  const cert = add(s, -30);
  const keep = new Date(cert); keep.setFullYear(keep.getFullYear() + 3);

  const replaceCell = (ref: string, cell: string) => {
    const re = new RegExp(`<c r="${ref}"[^>]*?(?:/>|>.*?</c>)`);
    if (!re.test(sheet)) throw new Error(`Cell ${ref} not found`);
    sheet = sheet.replace(re, cell);
  };
  if (opts.farm) replaceCell("B3", text("B3", 53, opts.farm));
  replaceCell("B4", text("B4", 55, String(s.getFullYear())));
  replaceCell("B6", `<c r="B6" s="56"><v>${serial(cert)}</v></c>`);
  replaceCell("C6", text("C6", 54, "Expected date from your plan. Replace it with the date on your certification."));
  replaceCell("B7", `<c r="B7" s="57"><f>IF(B6="","",EDATE(B6,36))</f><v>${serial(keep)}</v></c>`);

  const rows: [string, Date, string][] = [
    ["Job order window opens", add(s, -75), "No more than 75 days before start (20 CFR 655.121)"],
    ["Last day to submit job order", add(s, -60), "No fewer than 60 days before start (20 CFR 655.121)"],
    ["Last day to file DOL application", add(s, -45), "At least 45 days before start (20 CFR 655.130)"],
    ["Crew start date", s, "From your season plan"],
  ];
  if (opts.end) {
    const e = parseDate(opts.end);
    rows.push(["Halfway point", new Date((s.getTime() + e.getTime()) / 2), "Final recruitment report; inbound travel paid by now (20 CFR 655.156)"]);
    rows.push(["Contract ends", e, "Three-fourths guarantee and return travel (20 CFR 655.122)"]);
  }
  let r = 12;
  let added = `<row r="${r}" ht="15" customHeight="1" s="41">${text(`A${r}`, 52, opts.stateName ? `Your ${opts.stateName} season dates` : "Your season dates")}</row>`;
  for (const [label, date, note] of rows) {
    r++;
    added += `<row r="${r}" ht="15" customHeight="1" s="41">${text(`A${r}`, 52, label)}<c r="B${r}" s="56"><v>${serial(date)}</v></c>${text(`C${r}`, 54, note)}</row>`;
  }
  sheet = sheet.replace("</sheetData>", `${added}</sheetData>`).replace('<dimension ref="A1:C10"/>', `<dimension ref="A1:C${r}"/>`);
  zip.file(path, sheet);

  // Ask Excel to recalculate the formulas when the file opens.
  let wb = await zip.file("xl/workbook.xml")!.async("string");
  wb = /<calcPr[^>]*\/>/.test(wb) ? wb.replace(/<calcPr[^>]*\/>/, '<calcPr calcId="124519" fullCalcOnLoad="1"/>') : wb.replace("</workbook>", '<calcPr calcId="124519" fullCalcOnLoad="1"/></workbook>');
  zip.file("xl/workbook.xml", wb);
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

export const isValidDate = (v: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = parseDate(v);
  if (isNaN(d.getTime()) || iso(d) !== v) return false;
  const years = (d.getTime() - Date.now()) / (365.25 * 86400000);
  return years > -1 && years < 5;
};
