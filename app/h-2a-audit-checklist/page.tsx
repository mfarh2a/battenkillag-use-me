import type { Metadata } from "next";
import Link from "next/link";
import ChecklistForm from "@/components/ChecklistForm";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import { auditGroups, auditRecordCount } from "@/lib/audit-records";

export const metadata: Metadata = {
  title: "Free H-2A Audit Checklist (Excel Template)",
  description: `The ${auditRecordCount} records to keep ready for a DOL audit, each tied to the rule behind it. See the list here and get the free Excel workbook with a progress tracker and departures log.`,
  keywords: ["H-2A audit checklist", "H-2A audit checklist template", "H-2A records checklist", "DOL H-2A audit"],
  alternates: { canonical: "/h-2a-audit-checklist" },
};

const faqs = [
  { q: "How long do I have to respond to an H-2A audit letter?", a: "The audit letter sets a due date no more than 30 calendar days after it is issued. Failing to fully respond can lead to revocation of your certification or being barred from the program." },
  { q: "How long do I have to keep H-2A records?", a: "At least 3 years from the date your application was certified." },
  { q: "What is in the Excel workbook?", a: "Every record on this page with a link to its rule, a tracker that shows how ready you are, a worker departures log that works out the 2-working-day notice deadline, and a date calculator for how long to keep your records." },
];

function cfrUrl(rule: string) {
  const m = rule.match(/(\d+) CFR (\d+)\.(\d+)(\(([a-z])\))?/);
  if (!m) return "https://www.ecfr.gov";
  const sec = `${m[2]}.${m[3]}`;
  return `https://www.ecfr.gov/current/title-${m[1]}/section-${sec}` + (m[5] ? `#p-${sec}(${m[5]})` : "");
}

export default function AuditChecklist() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <section className="section">
        <div className="wrap tool-head">
          <div className="stack prose">
            <p className="eyebrow">Free tool</p>
            <h1>H-2A audit checklist</h1>
            <p className="muted" style={{ fontSize: "var(--step-1)" }}>
              The {auditRecordCount} records to have ready before anyone asks, each tied to the rule behind it.
            </p>
            <p className="audit-stakes">
              <strong>An audit letter gives you no more than 30 days to respond.</strong> Failing to comply can mean losing your certification or being barred from the program.
            </p>
          </div>
          <div className="lead-box prose" id="checklist">
            <div className="stack">
              <h2 className="lead-title">Get the Excel workbook</h2>
              <p className="muted">Includes a progress tracker, a worker departures log and links to every rule. Add your start date and your season dates come filled in.</p>
            </div>
            <ChecklistForm />
          </div>
        </div>
      </section>
      <section className="section section-alt">
        <div className="wrap stack-lg">
          <h2>What to keep on file</h2>
          <div className="audit-groups">
            {auditGroups.map((g) => (
              <div key={g.name}>
                <h3>{g.name}</h3>
                <ul>
                  {g.records.map((r) => (
                    <li key={r.text}><a className="rule-link" href={cfrUrl(r.rule)} target="_blank" rel="noopener" title={r.rule} data-cite={r.rule}>{r.text}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: "var(--step--1)" }}>General information, not legal advice. Your case may require records not listed here.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap stack-lg">
          <h2>Audit questions</h2>
          <div className="faq prose">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p className="muted">{f.a}</p>
              </details>
            ))}
          </div>
          <p>Read more in <Link href="/resources/h-2a-audit-prep">Preparing for an H-2A audit</Link>, or see when each record comes due in the <Link href="/plan-your-season">season planner</Link>.</p>
        </div>
      </section>
      <section className="section cta-band">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <h2>Want these records kept for you?</h2>
            <p>Every customer gets a digital filing cabinet to keep track of important documents, deadlines and billing.</p>
          </div>
          <div className="btn-row">
            <Link href="/contact" className="btn btn-primary">Request a quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
