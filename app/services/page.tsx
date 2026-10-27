import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "H-2A Services for Family Farms",
  description: "Battenkill Ag handles your H-2A job order, DOL labor certification, USCIS petition and season compliance support, with optional consulate and travel coordination, with one dedicated team member for your farm.",
  alternates: { canonical: "/services" },
};

const rows = [
  { step: "Job order and state workforce agency posting", who: "Battenkill", note: "Drafted from your last season, then filed and tracked" },
  { step: "Department of Labor application and any follow-up questions", who: "Battenkill", note: "Filed in the DOL's online system" },
  { step: "USCIS petition (Form I-129)", who: "Battenkill", note: "An immigration attorney steps in on complex cases" },
  { step: "Consulate appointments and visa forms", who: "Optional", note: "Optional; coordinated by us with several partner companies in Mexico, which assist your workers there" },
  { step: "Recruiting new workers", who: "You", note: "We don't recruit, but we can introduce you to several reputable companies that do" },
  { step: "Travel to your farm", who: "Optional", note: "Optional; coordinated by us with several partner companies; mostly flights for small groups" },
  { step: "Housing and its inspection", who: "You and your state", note: "We schedule the inspection early and help move a stalled one along" },
  { step: "Transportation at your farm", who: "You", note: "Daily rides to the field and the store; we explain what H-2A requires" },
  { step: "Payroll and wage records", who: "You", note: "We can point you to a payroll partner" },
  { step: "Season compliance packet", who: "Battenkill", note: "Digitally sent and accessible. Paper copies available upon request." },
  { step: "Department of Labor audits and site visits", who: "Battenkill", note: "Phone support and written responses" },
];

export default function Services() {
  return (
    <>
      <section className="section">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <p className="eyebrow">Services</p>
            <h1>Everything it takes to bring your crew in</h1>
            <p className="lead muted" style={{ fontSize: "var(--step-1)" }}>{site.positioning}</p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <h2>Who does what</h2>
            <p className="muted">You stay the employer. We handle the filings, the deadlines and the agencies. We can also coordinate your crew's consulate visits and travel with several partner companies in Mexico, if you choose.</p>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th style={{ width: "42%" }}>Step</th><th style={{ width: "18%" }}>Who does it</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.step}>
                    <td>{r.step}</td>
                    <td className={`who ${r.who === "Battenkill" ? "who-us" : ""}`}>{r.who}</td>
                    <td className="muted">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <h2>What we do, and what we don&apos;t</h2>
            <p className="muted">We&apos;re your H-2A agent: we handle the paperwork, the deadlines and the coordination. The farm stays the employer of its crew.</p>
          </div>
          <div className="grid-2">
            <div className="card">
              <h3>What we do</h3>
              <ul className="check-list">
                <li>Prepare and file your job order, Department of Labor application and USCIS petition</li>
                <li>Track every deadline and answer agency questions for you</li>
                <li>Optional: we coordinate consulate appointments and travel for your crew with several partner companies in Mexico, which assist your workers there. You get one invoice from us, with every charge listed</li>
                <li>Keep your season records organized and help if the Department of Labor audits you</li>
              </ul>
            </div>
            <div className="card">
              <h3>What we don&apos;t do</h3>
              <ul className="stack" style={{ paddingLeft: "1.2rem", margin: 0 }}>
                <li>We don&apos;t recruit, hire, supply or employ workers. You stay the employer, and most farms bring back the crew they already know. If you need new workers, we&apos;ve built relationships with many reputable companies that can help, and we&apos;re happy to introduce you.</li>
                <li>We don&apos;t provide housing or drive workers in the U.S. Housing and transportation at your farm stay with you, and we help you meet the requirements.</li>
                <li>We don&apos;t run payroll.</li>
                <li>We never charge workers anything. Every fee is paid by the farm.</li>
                <li>We&apos;re not a law firm. An immigration attorney steps in when a case needs one.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="card stack prose">
            <h2 style={{ fontSize: "var(--step-2)" }}>Pricing</h2>
            <p>We provide reliable, exceptional service for the farming families we work with, with clear pricing and every charge itemized. Tell us your start date and crew size, and we will send a quote for your farm.</p>
            <p><Link href="/contact" className="btn btn-primary">Request a quote</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
