"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ChecklistForm from "@/components/ChecklistForm";
import { site } from "@/lib/site";
import { DAY, add, buildPlan, ecfr, fmt, fmtShort, iso, parseDate, plusMonths, type PlanItem } from "@/lib/season-plan";

export type PlannerState = {
  slug: string;
  name: string;
  topMonths: string[];
  contact: { office: string; phone?: string; email?: string; url?: string; note?: string } | null;
  aewr: { h1: number; h2: number; effective: string } | null;
};

function nextSpring() {
  const now = new Date();
  const y = now.getMonth() >= 2 ? now.getFullYear() + 1 : now.getFullYear();
  return `${y}-03-15`;
}

const dayCount = (n: number) => `${n} day${n === 1 ? "" : "s"}`;

function Section({ title, items, today }: { title: string; items: PlanItem[]; today: Date | null }) {
  return (
    <section className="plan-group">
      <h2>{title}</h2>
      <ol className="plan-list">
        {items.map((it) => {
          const ago = today && !it.ongoing ? Math.round((today.getTime() - it.date.getTime()) / DAY) : 0;
          const late = ago > 0;
          return (
            <li key={it.title} className={late ? "late" : ""}>
              <div className="plan-date">
                <strong>{it.ongoing ? `From ${it.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : fmt(it.date)}</strong>
                {late && <span className="plan-passed">{it.opens ? `Opened ${dayCount(ago)} ago` : `Passed ${dayCount(ago)} ago`}</span>}
              </div>
              <div className="plan-body">
                <h3>{it.title}</h3>
                <p>{it.detail}{it.rule && <> <a href={ecfr(it.rule)} target="_blank" rel="noopener">20 CFR 655.{it.rule}</a></>}</p>
                {it.records && (
                  <ul className="plan-records">
                    {it.records.map((r) => (
                      <li key={r}>{r}</li>
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
}

export default function SeasonPlanner({ states }: { states: PlannerState[] }) {
  const [start, setStart] = useState(nextSpring());
  const [endDate, setEndDate] = useState(plusMonths(nextSpring(), 6));
  const [endTouched, setEndTouched] = useState(false);
  const [stateSlug, setStateSlug] = useState("");
  // Set after the page loads, so "days left" is always counted from the visitor's own today.
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

  const onStart = (v: string) => { setStart(v); if (!endTouched || endDate <= v) setEndDate(plusMonths(v, 6)); };
  const plan = useMemo(() => buildPlan(start, endDate), [start, endDate]);
  const state = states.find((s) => s.slug === stateSlug);

  const allDated = plan ? [...plan.before, ...plan.during, ...plan.after].filter((i) => !i.ongoing) : [];
  const next = today ? allDated.filter((i) => i.date >= today).sort((a, b) => a.date.getTime() - b.date.getTime())[0] : undefined;
  const daysToNext = next && today ? Math.round((next.date.getTime() - today.getTime()) / DAY) : 0;
  const missed = today && plan ? plan.before.filter((i) => i.hard && i.date < today) : [];
  const earliest = today ? add(today, 60) : null;

  return (
    <div className="planner">
      <form className="planner-top planner-inputs card" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="plan-state">Your state</label>
          <select id="plan-state" value={stateSlug} onChange={(e) => setStateSlug(e.target.value)}>
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
          <input id="plan-end" type="date" value={endDate} min={start} onChange={(e) => { setEndDate(e.target.value); setEndTouched(true); }} />
        </div>
      </form>

      {plan ? (
        <>
          {missed.length > 0 && earliest && (
            <div className="plan-alert" role="status">
              <h2>{missed.length > 1 ? "Two filing deadlines have passed for this start date" : "A filing deadline has passed for this start date"}</h2>
              <ul>
                {missed.map((m) => {
                  const ago = today ? Math.round((today.getTime() - m.date.getTime()) / DAY) : 0;
                  return <li key={m.title}><strong>{m.title}:</strong> {fmtShort(m.date)}, {dayCount(ago)} ago</li>;
                })}
              </ul>
              <p>A start date of {fmtShort(earliest)} or later would still meet the job order deadline. If your crew can&apos;t start that late, call us at <a href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}>{site.phone}</a> and we will tell you what is still possible.</p>
            </div>
          )}

          <dl className="plan-summary" aria-live="polite">
            <div className="ps-next">
              <dt>Your next date</dt>
              <dd>
                {next ? next.title : "See your plan below"}
                {next && <span className="ps-sub">{fmtShort(next.date)} · {daysToNext === 0 ? "today" : `${dayCount(daysToNext)} left`}</span>}
              </dd>
            </div>
            <div><dt>Job order window</dt><dd>{fmtShort(plan.jobOrderOpens)}<span className="ps-sub">to {fmtShort(plan.jobOrderLast)}</span></dd></div>
            <div><dt>File DOL application by</dt><dd>{fmtShort(plan.dolLast)}</dd></div>
            <div><dt>Keep records until at least</dt><dd>{fmtShort(plan.keepUntil)}<span className="ps-sub">Based on your expected certification</span></dd></div>
          </dl>

          <div className="plan-actions">
            <a href="#checklist" className="btn btn-primary">Email my plan and checklist</a>
          </div>

          {state && (
            <section className="plan-state card" style={{ padding: "1.5rem" }}>
              <h2>H-2A in {state.name}</h2>
              <div>
                <h3>Housing inspection</h3>
                {state.contact ? (
                  <>
                    <p>{state.contact.office}</p>
                    {state.contact.phone && <p><a href={`tel:${state.contact.phone.replace(/[^0-9]/g, "")}`}>{state.contact.phone}</a></p>}
                    {state.contact.email && <p><a href={`mailto:${state.contact.email}`}>{state.contact.email}</a></p>}
                    {state.contact.note && <p>{state.contact.note}</p>}
                    {state.contact.url && <p><a href={state.contact.url} target="_blank" rel="noopener">Official {state.name} page</a></p>}
                  </>
                ) : (
                  <p>Contact the foreign labor certification unit at {state.name}&apos;s state workforce agency. Find it on DOL&apos;s <a href="https://www.dol.gov/agencies/eta/foreign-labor/contact" target="_blank" rel="noopener">state contacts page</a>.</p>
                )}
                <p className="muted">Contacts change. Confirm with the state before you schedule.</p>
              </div>
              <div>
                <h3>Wages and timing</h3>
                {state.aewr && <p>AEWR for field and livestock jobs with free housing: <strong>${state.aewr.h1.toFixed(2)}</strong> an hour at Skill Level I, <strong>${state.aewr.h2.toFixed(2)}</strong> at Skill Level II, effective {state.aewr.effective}. Rates may change, so check before you file.</p>}
                {state.topMonths.length > 0 && <p>Busiest start months: {state.topMonths.join(", ")}.</p>}
                <p><Link href={`/h-2a/${state.slug}`}>More on H-2A in {state.name}</Link></p>
              </div>
            </section>
          )}

          <Section title="Before your crew arrives" items={plan.before} today={today} />
          <Section title="During the season" items={plan.during} today={today} />
          <Section title="After the season" items={plan.after} today={today} />

          <div className="lead-box prose" id="checklist">
            <div className="stack">
              <h2 className="lead-title">Email my plan and audit checklist</h2>
              <p className="muted">We&apos;ll email your full season plan as a PDF, plus the Excel audit checklist with your dates filled in. An audit letter gives you no more than 30 days to respond, so it pays to keep these records ready.</p>
            </div>
            <ChecklistForm plan={{ start, end: endDate, state: stateSlug || undefined }} button="Email my plan and checklist" />
          </div>

          <p className="muted plan-note">
            A planning guide based on the H-2A rules at 20 CFR Part 655, not legal advice. <Link href="/h-2a-audit-checklist">See all the records on the audit checklist.</Link>
          </p>
        </>
      ) : (
        <p className="muted">Pick a start date to see your plan.</p>
      )}
    </div>
  );
}
