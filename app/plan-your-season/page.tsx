import type { Metadata } from "next";
import Link from "next/link";
import SeasonPlanner, { type PlannerState } from "@/components/SeasonPlanner";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import { states } from "@/lib/states";
import { ecfr } from "@/lib/season-plan";

export const metadata: Metadata = {
  title: "Free H-2A Season Plan for Your Farm",
  description: "Get a season plan built around your state and crew start date, with every deadline, what to keep on file, and calendar reminders. Free, sent to your inbox.",
  alternates: { canonical: "/plan-your-season" },
};

const faqs = [
  { q: "How far ahead should I start planning an H-2A season?", a: "About four months before your start date. The job order can only be submitted 60 to 75 days before your start date, and housing and paperwork need to be ready before then." },
  { q: "What is the deadline to file the H-2A application?", a: "The Department of Labor application must be filed at least 45 days before your start date, and the job order 60 to 75 days before." },
  { q: "How long do I need to keep H-2A records?", a: "At least 3 years from the date your application was certified." },
];

const plannerStates: PlannerState[] = states
  .map((s) => ({ slug: s.slug, name: s.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

const stats = [
  { n: "84%", t: "of Wage and Hour investigations of H-2A employers found at least one violation", s: "GAO, fiscal years 2018 to 2023" },
  { n: "45%", t: "of the employers with violations had more than five", s: "GAO, same investigations" },
  { n: "$21,649", t: "maximum penalty for improperly rejecting a U.S. worker who applies", s: "DOL penalty table, 29 CFR 501.19" },
  { n: "30 days", t: "the most time DOL gives you to answer an audit letter", s: "20 CFR 655.180" },
];

export default function PlanYourSeason() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <section className="section">
        <div className="wrap gate-hero">
          <div className="stack-lg">
            <div className="stack prose">
              <p className="eyebrow">Free for H-2A employers</p>
              <h1>Know every H-2A deadline before it costs you your crew</h1>
              <p className="muted" style={{ fontSize: "var(--step-1)" }}>
                Tell us your state and your crew&apos;s start date. We&apos;ll email you a season plan built around your dates, with a calendar file that keeps you ahead of every filing.
              </p>
            </div>
            <ul className="teaser-list">
              <li>Every date that matters, worked out from your start date</li>
              <li>What to have on file at each step, so you&apos;re ready if an audit letter arrives</li>
              <li>Reminders on your calendar before each deadline</li>
              <li>Our audit-ready checklist, with your dates filled in</li>
            </ul>
          </div>
          <SeasonPlanner states={plannerStates} />
        </div>
      </section>

      <section className="section stats-band">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <p className="eyebrow">Why it pays to plan ahead</p>
            <h2>Most H-2A trouble starts with the paperwork</h2>
            <p className="muted">
              From 2018 to 2023, the Department of Labor&apos;s Wage and Hour Division assessed H-2A employers more than $20 million in back wages and more than $25 million in civil penalties.
            </p>
          </div>
          <dl className="stat-grid">
            {stats.map((x) => (
              <div className="stat" key={x.n}>
                <dt>{x.t}<small>{x.s}</small></dt>
                <dd><strong>{x.n}</strong></dd>
              </div>
            ))}
          </dl>
          <p className="muted stat-sources">
            Sources: <a href="https://gao.gov/assets/gao-25-106389.pdf" target="_blank" rel="noopener">GAO, November 2024</a>;{" "}
            <a href="https://www.dol.gov/agencies/whd/resources/penalties" target="_blank" rel="noopener">DOL penalty table</a>;{" "}
            <a href={ecfr("180")} target="_blank" rel="noopener">20 CFR 655.180</a>.
          </p>
          <div className="btn-row">
            <a href="#get-plan" className="btn btn-primary">Get my season plan</a>
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <h2>Want us to handle these dates?</h2>
            <p>We file the job order, the DOL application and the USCIS petition, and remind you before every deadline.</p>
          </div>
          <div className="btn-row">
            <Link href="/contact" className="btn btn-primary">Request a quote</Link>
            <Link href="/how-h2a-works" className="btn btn-ghost">How H-2A works</Link>
          </div>
        </div>
      </section>
    </>
  );
}
