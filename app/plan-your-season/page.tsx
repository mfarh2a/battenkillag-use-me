import type { Metadata } from "next";
import Link from "next/link";
import SeasonPlanner, { type PlannerState } from "@/components/SeasonPlanner";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import { aewrFor, states } from "@/lib/states";
import contactsData from "@/content/state-contacts.json";

export const metadata: Metadata = {
  title: "Plan Your H-2A Season: Free Deadline Calculator",
  description: "Enter your crew's start date and state to see your key H-2A deadlines. Add your email to unlock the full plan, with every date, the records to save, and calendar reminders.",
  alternates: { canonical: "/plan-your-season" },
};

const faqs = [
  { q: "How far ahead should I start planning an H-2A season?", a: "About four months before your start date. The job order can only be submitted 60 to 75 days before your start date, and housing and paperwork need to be ready before then." },
  { q: "What is the deadline to file the H-2A application?", a: "The Department of Labor application must be filed at least 45 days before your start date, and the job order 60 to 75 days before." },
  { q: "How long do I need to keep H-2A records?", a: "At least 3 years from the date your application was certified." },
];

type Contact = { office: string; phone?: string; email?: string; url?: string; note?: string };
const contacts = contactsData as Record<string, Contact>;

const plannerStates: PlannerState[] = states
  .map((s) => {
    const rates = aewrFor(s.name);
    return {
      slug: s.slug,
      name: s.name,
      topMonths: s.topMonths,
      contact: contacts[s.abbr] ?? null,
      aewr: rates ? { h1: rates.h1, h2: rates.h2, effective: rates.effective } : null,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export default function PlanYourSeason() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <section className="section">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <p className="eyebrow">Free tool</p>
            <h1>Plan your season</h1>
            <p className="muted" style={{ fontSize: "var(--step-1)" }}>
              Enter your state and your crew&apos;s start date to see your key H-2A deadlines right away. Add your email to unlock the full plan: every date, the records to keep at each step, and calendar reminders before each deadline.
            </p>
          </div>
          <SeasonPlanner states={plannerStates} />
        </div>
      </section>
      <section className="section cta-band">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <h2>Want us to handle these dates?</h2>
            <p>We file the job order, the DOL application and the USCIS petition, and remind you before every deadline on this list.</p>
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
