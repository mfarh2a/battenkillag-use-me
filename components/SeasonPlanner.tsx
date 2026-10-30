"use client";

import { useMemo, useState } from "react";
import Photo from "@/components/Photo";

type Item = { date: Date; title: string; detail: string; records?: string[]; rule?: string; ongoing?: boolean };

const DAY = 86400000;
const add = (d: Date, n: number) => new Date(d.getTime() + n * DAY);
const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
const iso = (d: Date) => d.toISOString().slice(0, 10);
const ecfr = (s: string) => `https://www.ecfr.gov/current/title-20/chapter-V/part-655/subpart-B/section-655.${s}`;

function nextSpring() {
  const now = new Date();
  const y = now.getMonth() >= 2 ? now.getFullYear() + 1 : now.getFullYear();
  return `${y}-03-15`;
}
function plusMonths(isoDate: string, m: number) {
  const d = new Date(`${isoDate}T12:00:00`);
  if (isNaN(d.getTime())) return isoDate;
  d.setMonth(d.getMonth() + m);
  return d.toISOString().slice(0, 10);
}

export default function SeasonPlanner() {
  const [start, setStart] = useState(nextSpring());
  const [endDate, setEndDate] = useState(plusMonths(nextSpring(), 6));
  const [endTouched, setEndTouched] = useState(false);
  const onStart = (v: string) => { setStart(v); if (!endTouched || endDate <= v) setEndDate(plusMonths(v, 6)); };

  const plan = useMemo(() => {
    const s = new Date(`${start}T12:00:00`);
    if (isNaN(s.getTime())) return null;
    let end = new Date(`${endDate}T12:00:00`);
    if (isNaN(end.getTime()) || end <= s) { end = new Date(s); end.setMonth(end.getMonth() + 6); }
    const half = new Date((s.getTime() + end.getTime()) / 2);
    const cert = add(s, -30);
    const keepUntil = new Date(cert); keepUntil.setFullYear(keepUntil.getFullYear() + 3);
    const before: Item[] = [
      { date: add(s, -120), title: "Start planning your season", detail: "Confirm your start date, crew size, jobs and housing. Pull last season's job order and records so the new one starts from them.", records: ["Last season's job order and pay rates", "Returning workers' names and contact details"] },
      { date: add(s, -100), title: "Get housing ready", detail: "Finish repairs and line up your housing inspection with your state workforce agency. Inspections can take weeks to schedule.", records: ["Housing addresses, capacity and photos", "Any repair receipts"] },
      { date: add(s, -75), title: "Job order window opens", detail: "The job order can be submitted no more than 75 days before your start date.", rule: "121" },
      { date: add(s, -60), title: "Last day to submit your job order", detail: "The job order must be in no fewer than 60 days before your start date.", records: ["Job order (Form ETA-790/790A) as filed", "Copy of any SWA correspondence"], rule: "121" },
      { date: add(s, -45), title: "Last day to file your DOL application", detail: "File the H-2A application (Form ETA-9142A) at least 45 days before your start date.", records: ["Filed application and appendices", "Ads you placed and contacts with last season's U.S. workers"], rule: "130" },
      { date: add(s, -37), title: "Initial recruitment report", detail: "Once DOL accepts your application, its acceptance notice sets the date your first recruitment report is due. Keep updating the report through the halfway point of your contract.", records: ["Initial recruitment report as submitted"], rule: "156", ongoing: true },
      { date: add(s, -35), title: "Housing inspected and workers' comp in place", detail: "Both must be done before the Department of Labor can certify you.", records: ["Housing inspection report", "Workers' compensation policy covering your crew"] },
      { date: cert, title: "Expected DOL decision", detail: "The Department of Labor is required to decide at least 30 days before your start date if your application is complete.", records: ["Certification letter (start of your 3-year record clock)"], rule: "160" },
      { date: add(s, -28), title: "File the USCIS petition", detail: "The I-129 petition goes in as soon as you're certified, for named or unnamed workers.", records: ["I-129 petition and receipt notice", "Approval notice"] },
      { date: add(s, -21), title: "Consulate appointments and travel (optional)", detail: "Workers attend visa appointments and travel is booked. We can coordinate this through our partner companies.", records: ["Travel and visa fee receipts"] },
    ];
    const during: Item[] = [
      { date: s, title: "Crew arrives: contract period begins", detail: "Give each worker a copy of the job order in a language they understand, no later than the first day of work.", records: ["Signed work contract or job order copy for each worker", "I-9 forms for every worker", "Hours offered and worked, every day"] },
      { date: add(s, 7), title: "First paycheck: reimburse travel and visa costs", detail: "Most farms reimburse inbound travel, meals on the road and visa costs on the first paycheck. Under federal minimum wage law (FLSA), any of these costs that pull a worker's first-week pay below the federal minimum wage must be paid back in the first workweek. The H-2A rule sets the halfway point as the latest date for the rest.", records: ["Travel, meal and visa reimbursement for each worker", "First-week pay calculation showing minimum wage was met"] },
      { date: add(s, 7), title: "Earnings statements every pay period", detail: "Every pay period, give each worker an earnings statement and keep a copy.", records: ["Earnings statements for every pay period", "Payroll records: hours, rate, deductions"], rule: "122", ongoing: true },
      { date: s, title: "If a worker leaves or doesn't show up", detail: "After 5 days in a row of missed work without permission, notify DOL and DHS within 2 working days.", records: ["Abandonment or termination notices sent", "Date of last day worked"], rule: "122", ongoing: true },
      { date: half, title: "Halfway point: recruitment period ends", detail: "Your duty to hire qualified U.S. workers who apply ends today. Finish the final update to your recruitment report and keep it on file; DOL can ask for it in an audit. Any inbound travel and meal costs not already reimbursed are due by today at the latest.", records: ["Final recruitment report: every U.S. applicant and the outcome", "Proof all inbound travel and meals have been reimbursed"], rule: "156" },
    ];
    const after: Item[] = [
      { date: end, title: "Contract ends", detail: "Check the three-fourths guarantee, pay final wages and provide or pay for return travel for workers who complete the contract.", records: ["Three-fourths guarantee calculation", "Final pay records", "Outbound travel records"], rule: "122" },
      { date: keepUntil, title: "Keep records until at least this date", detail: "Keep every H-2A record for 3 years from your certification date. DOL can audit any time in that window.", rule: "167" },
    ];
    return { before, during, after, end, s, half, cert, keepUntil };
  }, [start, endDate]);

  const today = new Date();
  const until = (d: Date) => {
    const n = Math.round((d.getTime() - today.getTime()) / DAY);
    if (n === 0) return "today";
    return n > 0 ? `in ${n} days` : `${-n} days ago`;
  };

  const Section = ({ title, items }: { title: string; items: Item[] }) => (
    <section className="plan-group">
      <h2>{title}</h2>
      <ol className="plan-list">
        {items.map((it) => {
          const late = !it.ongoing && it.date.getTime() < today.getTime() - DAY;
          return (
            <li key={it.title} className={late ? "late" : ""}>
              <div className="plan-date">
                <strong>{it.ongoing ? `From ${it.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : fmt(it.date)}</strong>
                {!it.ongoing && <span>{until(it.date)}</span>}
              </div>
              <div className="plan-body">
                <h3>{it.title}</h3>
                <p>{it.detail}{it.rule && <> <a href={ecfr(it.rule)} target="_blank" rel="noopener">20 CFR 655.{it.rule}</a></>}</p>
                {it.records && (
                  <ul className="plan-records">
                    {it.records.map((r) => (
                      <li key={r}><label><input type="checkbox" /> {r}</label></li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );

  return (
    <div className="planner">
      <div className="planner-top card">
        <figure className="planner-photo">
          <Photo name="fieldCrew" className="planner-photo-img" sizes="(max-width: 820px) 100vw, 40vw" />
          <figcaption>USDA photo by Lance Cheung, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener">CC BY 2.0</a></figcaption>
        </figure>
        <form className="planner-form" onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label htmlFor="plan-start">When does your crew start?</label>
            <input id="plan-start" type="date" value={start} onChange={(e) => onStart(e.target.value)} min={iso(new Date())} />
          </div>
          <div className="field">
            <label htmlFor="plan-end">When does your season end?</label>
            <input id="plan-end" type="date" value={endDate} min={start} onChange={(e) => { setEndDate(e.target.value); setEndTouched(true); }} />
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => window.print()}>Print this plan</button>
        </form>
      </div>
      {plan ? (
        <>
          <div className="print-only plan-print-head">
            <p className="pp-brand">Battenkill Ag Services · H-2A season plan</p>
            <h2>Season: {fmt(plan.s)} to {fmt(plan.end)}</h2>
            <dl className="pp-keys">
              <div><dt>Submit job order</dt><dd>{fmt(add(plan.s, -75))} to {fmt(add(plan.s, -60))}</dd></div>
              <div><dt>File DOL application by</dt><dd>{fmt(add(plan.s, -45))}</dd></div>
              <div><dt>Expected DOL decision</dt><dd>{fmt(plan.cert)}</dd></div>
              <div><dt>Crew arrives</dt><dd>{fmt(plan.s)}</dd></div>
              <div><dt>Halfway point: final recruitment report</dt><dd>{fmt(plan.half)}</dd></div>
              <div><dt>Keep records until</dt><dd>{fmt(plan.keepUntil)}</dd></div>
            </dl>
            <p className="pp-contact">Questions? Battenkill Ag · 512-540-4533 · sales@battenkillag.com · battenkillag.com</p>
          </div>
          <Section title="Before your crew arrives" items={plan.before} />
          <Section title="During the season" items={plan.during} />
          <Section title="After the season" items={plan.after} />
          <p className="muted plan-note">
            A planning guide based on the H-2A rules at 20 CFR Part 655, not legal advice. Dates that have already passed are marked. If your plan is already late, call us and we will tell you what is still possible.
          </p>
        </>
      ) : (
        <p className="muted">Pick a start date to see your plan.</p>
      )}
    </div>
  );
}
