"use client";

import { useMemo, useState } from "react";

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

export default function SeasonPlanner() {
  const [start, setStart] = useState(nextSpring());
  const [months, setMonths] = useState(6);

  const plan = useMemo(() => {
    const s = new Date(`${start}T12:00:00`);
    if (isNaN(s.getTime())) return null;
    const end = new Date(s); end.setMonth(end.getMonth() + months);
    const half = new Date((s.getTime() + end.getTime()) / 2);
    const cert = add(s, -30);
    const keepUntil = new Date(cert); keepUntil.setFullYear(keepUntil.getFullYear() + 3);
    const before: Item[] = [
      { date: add(s, -120), title: "Start planning your season", detail: "Confirm your start date, crew size, jobs and housing. Pull last season's job order and records so the new one starts from them.", records: ["Last season's job order and pay rates", "Returning workers' names and contact details"] },
      { date: add(s, -100), title: "Get housing ready", detail: "Finish repairs and line up your housing inspection with your state workforce agency. Inspections can take weeks to schedule.", records: ["Housing addresses, capacity and photos", "Any repair receipts"] },
      { date: add(s, -75), title: "Job order window opens", detail: "The job order can be submitted no more than 75 days before your start date.", rule: "121" },
      { date: add(s, -60), title: "Last day to submit your job order", detail: "The job order must be in no fewer than 60 days before your start date.", records: ["Job order (Form ETA-790/790A) as filed", "Copy of any SWA correspondence"], rule: "121" },
      { date: add(s, -45), title: "Last day to file your DOL application", detail: "File the H-2A application (Form ETA-9142A) at least 45 days before your start date.", records: ["Filed application and appendices", "Recruitment report and ads you placed", "Contacts with last season's U.S. workers"], rule: "130" },
      { date: add(s, -35), title: "Housing inspected and workers' comp in place", detail: "Both must be done before the Department of Labor can certify you.", records: ["Housing inspection report", "Workers' compensation policy covering your crew"] },
      { date: cert, title: "Expected DOL decision", detail: "The Department of Labor is required to decide at least 30 days before your start date if your application is complete.", records: ["Certification letter (start of your 3-year record clock)"], rule: "160" },
      { date: add(s, -28), title: "File the USCIS petition", detail: "The I-129 petition goes in as soon as you're certified, for named or unnamed workers.", records: ["I-129 petition and receipt notice", "Approval notice"] },
      { date: add(s, -21), title: "Consulate appointments and travel (optional)", detail: "Workers attend visa appointments and travel is booked. We can coordinate this through our partner companies.", records: ["Travel and visa fee receipts"] },
    ];
    const during: Item[] = [
      { date: s, title: "Crew arrives: contract period begins", detail: "Give each worker a copy of the job order in a language they understand, no later than the first day of work.", records: ["Signed work contract or job order copy for each worker", "I-9 forms for every worker", "Hours offered and worked, every day"] },
      { date: add(s, 7), title: "First pay day and earnings statements", detail: "Every pay period, give each worker an earnings statement and keep a copy.", records: ["Earnings statements for every pay period", "Payroll records: hours, rate, deductions"], rule: "122", ongoing: true },
      { date: s, title: "If a worker leaves or doesn't show up", detail: "After 5 days in a row of missed work without permission, notify DOL and DHS within 2 working days.", records: ["Abandonment or termination notices sent", "Date of last day worked"], rule: "122", ongoing: true },
      { date: half, title: "Halfway point of your contract", detail: "Reimburse inbound travel and meals for workers still with you, if not already paid. Your duty to hire qualified U.S. workers who apply ends today.", records: ["Inbound travel and meal reimbursement records", "U.S. applicants and hiring decisions up to this date"], rule: "135" },
    ];
    const after: Item[] = [
      { date: end, title: "Contract ends", detail: "Check the three-fourths guarantee, pay final wages and provide or pay for return travel for workers who complete the contract.", records: ["Three-fourths guarantee calculation", "Final pay records", "Outbound travel records"], rule: "122" },
      { date: keepUntil, title: "Keep records until at least this date", detail: "Keep every H-2A record for 3 years from your certification date. DOL can audit any time in that window.", rule: "167" },
    ];
    return { before, during, after, end };
  }, [start, months]);

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
      <form className="planner-form card" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="plan-start">When does your crew start?</label>
          <input id="plan-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} min={iso(new Date())} />
        </div>
        <div className="field">
          <label htmlFor="plan-months">How long is your season?</label>
          <select id="plan-months" value={months} onChange={(e) => setMonths(Number(e.target.value))}>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => <option key={m} value={m}>{m} months</option>)}
          </select>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => window.print()}>Print this plan</button>
      </form>
      {plan ? (
        <>
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
