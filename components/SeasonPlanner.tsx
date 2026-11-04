"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { trackCustomEvent } from "@/lib/ad-tracking";
import ChecklistForm from "@/components/ChecklistForm";
import { site } from "@/lib/site";
import { DAY, add, buildPlan, fmtShort, iso, parseDate, plusMonths } from "@/lib/season-plan";

// The plan itself is never shown on the page. The visitor picks a state and dates, gives an email,
// and the plan, calendar file and checklist are sent to that inbox.

export type PlannerState = { slug: string; name: string };

function nextSpring() {
  const now = new Date();
  const y = now.getMonth() >= 2 ? now.getFullYear() + 1 : now.getFullYear();
  return `${y}-03-15`;
}

const dayCount = (n: number) => `${n} day${n === 1 ? "" : "s"}`;

export default function SeasonPlanner({ states }: { states: PlannerState[] }) {
  const [start, setStart] = useState(nextSpring());
  const [endDate, setEndDate] = useState(plusMonths(nextSpring(), 6));
  const [endTouched, setEndTouched] = useState(false);
  const [stateSlug, setStateSlug] = useState("");
  // Set after the page loads, so "days ago" is always counted from the visitor's own today.
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const fromUrl = q.get("state");
    if (fromUrl && states.some((s) => s.slug === fromUrl)) setStateSlug(fromUrl);
    const qs = q.get("start");
    const qe = q.get("end");
    if (qs && !isNaN(parseDate(qs).getTime())) {
      setStart(qs);
      if (qe && qe > qs) { setEndDate(qe); setEndTouched(true); } else setEndDate(plusMonths(qs, 6));
    }
    setToday(parseDate(iso(new Date())));
  }, [states]);

  // Counts once per visit, the first time someone actually uses the planner.
  const used = useRef(false);
  const markUsed = () => { if (!used.current) { used.current = true; trackCustomEvent("PlannerUsed"); } };

  const onStart = (v: string) => { markUsed(); setStart(v); if (!endTouched || endDate <= v) setEndDate(plusMonths(v, 6)); };
  const plan = useMemo(() => buildPlan(start, endDate), [start, endDate]);
  const state = states.find((s) => s.slug === stateSlug);

  const dated = plan ? [...plan.before, ...plan.during, ...plan.after].filter((i) => !i.ongoing) : [];
  const filings = plan ? plan.before.filter((i) => i.hard).length : 0;
  const missed = today && plan ? plan.before.filter((i) => i.hard && i.date < today) : [];
  const earliest = today ? add(today, 60) : null;

  return (
    <div className="gate-card card" id="get-plan">
      <div className="stack">
        <h2 className="lead-title">Get your season plan</h2>
        <p className="muted">Free. Tell us about your season and we&apos;ll email your plan to you.</p>
      </div>

      <form className="gate-inputs" onSubmit={(e) => e.preventDefault()}>
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="plan-state">Your state</label>
          <select id="plan-state" value={stateSlug} onChange={(e) => { markUsed(); setStateSlug(e.target.value); }}>
            <option value="">Select a state</option>
            {states.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="plan-start">When does your crew start?</label>
          <input id="plan-start" type="date" value={start} onChange={(e) => onStart(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="plan-end">When does your season end?</label>
          <input id="plan-end" type="date" value={endDate} min={start} onChange={(e) => { markUsed(); setEndDate(e.target.value); setEndTouched(true); }} />
        </div>
      </form>

      {plan && missed.length > 0 && earliest && (
        <div className="plan-alert" role="status">
          <h3>{missed.length > 1 ? "Two filing deadlines have passed for this start date" : "A filing deadline has passed for this start date"}</h3>
          <ul>
            {missed.map((m) => {
              const ago = today ? Math.round((today.getTime() - m.date.getTime()) / DAY) : 0;
              return <li key={m.title}><strong>{m.title}:</strong> {fmtShort(m.date)}, {dayCount(ago)} ago</li>;
            })}
          </ul>
          <p>A start date of {fmtShort(earliest)} or later would still meet the job order deadline. If your crew can&apos;t start that late, call us at <a href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}>{site.phone}</a> and we will tell you what is still possible.</p>
        </div>
      )}

      {plan && (
        <p className="gate-tease" aria-live="polite">
          Your plan has <strong>{dated.length} dated steps</strong>, {filings} of them legal filing deadlines. Add your email and it&apos;s on its way.
        </p>
      )}

      <ChecklistForm
        plan={{ start, end: endDate, state: stateSlug || undefined, stateName: state?.name }}
        button="Email me my plan"
      />
    </div>
  );
}
