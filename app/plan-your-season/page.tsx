import type { Metadata } from "next";
import Link from "next/link";
import SeasonPlanner from "@/components/SeasonPlanner";
import ChecklistForm from "@/components/ChecklistForm";
import JsonLd, { faqSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Plan Your H-2A Season",
  description: "Enter your crew's start date and get every H-2A deadline, from planning and the job order to the DOL application, arrival and record keeping, with an audit checklist built around your dates.",
  alternates: { canonical: "/plan-your-season" },
};

const faqs = [
  { q: "How far ahead should I start planning an H-2A season?", a: "About four months before your start date. The job order can only be submitted 60 to 75 days before your start date, and housing and paperwork need to be ready before then." },
  { q: "What is the deadline to file the H-2A application?", a: "The Department of Labor application must be filed at least 45 days before your start date, and the job order 60 to 75 days before." },
  { q: "How long do I need to keep H-2A records?", a: "At least 3 years from the date your application was certified." },
];

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
              Enter your crew&apos;s start date to see every H-2A deadline for your season, with the records to keep at each step, so you are audit-ready from day one.
            </p>
          </div>
          <SeasonPlanner />
        </div>
      </section>
      <section className="section section-alt" id="checklist">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <h2>Get the full audit checklist</h2>
            <p className="muted">Every record DOL can ask for, in one Excel workbook, with links to the rule behind each one.</p>
          </div>
          <ChecklistForm />
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
