// The H-2A season plan: every date comes from the grower's start and end dates.
// Used by the planner on the page and by the email and workbook on the server, so they always agree.

export type PlanItem = {
  date: Date;
  title: string;
  detail: string;
  records?: string[];
  rule?: string;
  ongoing?: boolean;
  /** A legal filing deadline. Missing one triggers the warning at the top of the plan. */
  hard?: boolean;
  /** The opening of a window, so a past date is not a missed date. */
  opens?: boolean;
};

export type Plan = {
  before: PlanItem[];
  during: PlanItem[];
  after: PlanItem[];
  s: Date;
  end: Date;
  half: Date;
  cert: Date;
  keepUntil: Date;
  jobOrderOpens: Date;
  jobOrderLast: Date;
  dolLast: Date;
};

export const DAY = 86400000;
export const add = (d: Date, n: number) => new Date(d.getTime() + n * DAY);
export const parseDate = (iso: string) => new Date(`${iso}T12:00:00`);
export const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
export const fmtShort = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export const ecfr = (s: string) => `https://www.ecfr.gov/current/title-20/chapter-V/part-655/subpart-B/section-655.${s}`;
const pad = (n: number) => String(n).padStart(2, "0");
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function plusMonths(isoDate: string, m: number) {
  const d = parseDate(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  d.setMonth(d.getMonth() + m);
  return iso(d);
}

export function buildPlan(start: string, endDate: string): Plan | null {
  const s = parseDate(start);
  if (isNaN(s.getTime())) return null;
  let end = parseDate(endDate);
  if (isNaN(end.getTime()) || end <= s) { end = new Date(s); end.setMonth(end.getMonth() + 6); }
  const half = new Date((s.getTime() + end.getTime()) / 2);
  const cert = add(s, -30);
  const keepUntil = new Date(cert); keepUntil.setFullYear(keepUntil.getFullYear() + 3);
  const before: PlanItem[] = [
    { date: add(s, -120), title: "Start planning your season", detail: "Confirm your start date, crew size, jobs and housing. Pull last season's job order and records so the new one starts from them.", records: ["Pull last season's job order and pay rates", "Confirm returning workers' names and contact details"] },
    { date: add(s, -100), title: "Get housing ready", detail: "Finish repairs and line up your housing inspection with your state workforce agency. Inspections can take weeks to schedule.", records: ["Gather housing addresses, capacity and photos", "Save any repair receipts"] },
    { date: add(s, -75), title: "Job order window opens", detail: "The job order can be submitted no more than 75 days before your start date.", rule: "121", opens: true },
    { date: add(s, -60), title: "Last day to submit your job order", detail: "The job order must be in no fewer than 60 days before your start date.", records: ["Save a copy of the job order (Form ETA-790/790A) as filed", "Save all correspondence with your state workforce agency"], rule: "121", hard: true },
    { date: add(s, -45), title: "Last day to file your DOL application", detail: "File the H-2A application (Form ETA-9142A) at least 45 days before your start date.", records: ["Save the filed application and appendices", "Save the ads you placed and your contacts with last season's U.S. workers"], rule: "130", hard: true },
    { date: add(s, -37), title: "Initial recruitment report", detail: "Once DOL accepts your application, its acceptance notice sets the date your first recruitment report is due. Keep updating the report through the halfway point of your contract.", records: ["Save the initial recruitment report as submitted"], rule: "156", ongoing: true },
    { date: add(s, -35), title: "Housing inspected and workers' comp in place", detail: "Both must be done before the Department of Labor can certify you.", records: ["Save the housing inspection report", "Save the workers' compensation policy covering your crew"] },
    { date: cert, title: "Expected DOL decision", detail: "The Department of Labor is required to decide at least 30 days before your start date if your application is complete.", records: ["Save the certification letter; your 3-year record clock starts here"], rule: "160" },
    { date: add(s, -28), title: "File the USCIS petition", detail: "The I-129 petition goes in as soon as you're certified, for named or unnamed workers.", records: ["Save the I-129 petition and receipt notice", "Save the approval notice when it arrives"] },
    { date: add(s, -21), title: "Consulate appointments and travel", detail: "Workers attend visa appointments and travel is booked. We can coordinate this through our partner companies.", records: ["Save travel and visa fee receipts"] },
  ];
  const during: PlanItem[] = [
    { date: s, title: "Crew arrives: contract period begins", detail: "Give each worker a copy of the job order in a language they understand, no later than the first day of work.", records: ["Give each worker a copy of the work contract or job order and keep a signed copy", "Complete an I-9 form for every worker", "Record hours offered and worked every day"] },
    { date: add(s, 7), title: "First paycheck: reimburse travel and visa costs", detail: "Most farms reimburse inbound travel, meals on the road and visa costs on the first paycheck. Under federal minimum wage law (FLSA), any of these costs that pull a worker's first-week pay below the federal minimum wage must be paid back in the first workweek. The H-2A rule sets the halfway point as the latest date for the rest.", records: ["Record travel, meal and visa reimbursements for each worker", "Save the first-week pay calculation showing minimum wage was met"] },
    { date: add(s, 7), title: "Earnings statements every pay period", detail: "Every pay period, give each worker an earnings statement and keep a copy.", records: ["Keep copies of earnings statements for every pay period", "Keep payroll records of hours, rates and deductions"], rule: "122", ongoing: true },
    { date: s, title: "If a worker leaves or doesn't show up", detail: "After 5 days in a row of missed work without permission, notify DOL and DHS within 2 working days.", records: ["Save any abandonment or termination notices you send", "Record each worker's last day worked"], rule: "122", ongoing: true },
    { date: half, title: "Halfway point: recruitment period ends", detail: "Your duty to hire qualified U.S. workers who apply ends today. Finish the final update to your recruitment report and keep it on file; DOL can ask for it in an audit. Any inbound travel and meal costs not already reimbursed are due by today at the latest.", records: ["Save the final recruitment report, listing every U.S. applicant and the outcome", "Save proof that all inbound travel and meals were reimbursed"], rule: "156" },
  ];
  const after: PlanItem[] = [
    { date: end, title: "Contract ends", detail: "Check the three-fourths guarantee, pay final wages and provide or pay for return travel for workers who complete the contract.", records: ["Complete and save the three-fourths guarantee calculation", "Save final pay records", "Save outbound travel records"], rule: "122" },
    { date: keepUntil, title: "Keep records until at least this date", detail: "Keep every H-2A record for 3 years from your certification date. DOL can audit any time in that window.", rule: "167" },
  ];
  return { before, during, after, s, end, half, cert, keepUntil, jobOrderOpens: add(s, -75), jobOrderLast: add(s, -60), dolLast: add(s, -45) };
}
