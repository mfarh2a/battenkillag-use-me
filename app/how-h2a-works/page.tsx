import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { faqSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How the H-2A Process Works, Step by Step",
  description: "The H-2A process for farms in 7 steps: season planning, the state job order, DOL labor certification, the USCIS petition, consulate visits, travel and the season itself.",
  alternates: { canonical: "/how-h2a-works" },
};

const steps = [
  {
    title: "Plan your season",
    when: "About 4 months before your start date",
    body: "We sit down with you to set your start and end dates, how many workers you need, the jobs they will do, and where they will live. If you used H-2A last year, we start from that file.",
  },
  {
    title: "File the job order with your state",
    when: "60 to 75 days before your start date",
    body: "The job order describes the work, the pay and the housing. We file it with your state workforce agency, which posts the job so U.S. workers can apply first. Your state also inspects the housing, and we help keep that moving.",
  },
  {
    title: "Apply to the Department of Labor",
    when: "At least 45 days before your start date",
    body: "We file your application in the Department of Labor's online system and keep a record of the effort to hire U.S. workers. If the Department sends questions back, we answer them. A decision is due about 30 days before your start date.",
  },
  {
    title: "Petition USCIS",
    when: "After the Department of Labor approves",
    body: "With the approval in hand, we file a petition with U.S. Citizenship and Immigration Services (Form I-129). This is the request to bring in your named or unnamed workers.",
  },
  {
    title: "Consulate visits in Mexico",
    when: "After USCIS approves",
    body: "If you choose, we coordinate your crew's consulate appointments with several partner companies in Mexico, which assist your workers with their visa forms there. Timing depends on the consulate, so we watch it closely and keep you posted.",
  },
  {
    title: "Travel and arrival",
    when: "Right before your start date",
    body: "If you choose, we coordinate your crew's travel to your farm with several partner companies, usually flights for small groups. You see every travel charge on your invoice, so there are no surprises. Once your crew arrives, housing and daily transportation at the farm are yours to provide.",
  },
  {
    title: "During the season",
    when: "Start date to end date",
    body: "You pay at least the wage in your job order, keep good pay records, and provide the housing and transportation you promised. We send you a compliance packet that spells this out, and we help if the Department of Labor visits or audits your farm.",
  },
];

const faqs = [
  {
    q: "How early should I start?",
    a: "About four months before you need your crew. The state and federal deadlines run back from your start date, so starting early is the best way to get workers on time.",
  },
  {
    q: "Do I have to provide housing?",
    a: "Yes. H-2A workers get housing at no cost to them, and it has to pass a state inspection before the season. We help you understand what is required.",
  },
  {
    q: "Can you help me find workers?",
    a: "Most of our farms bring back workers they already know. We don't recruit workers ourselves, but we've built relationships with reputable companies that do, and we'll introduce you.",
  },
  {
    q: "What if I already use another agency?",
    a: "Switching is simple. We can usually start from your last season's paperwork. The best time to switch is a few months before your next start date.",
  },
];

export default function HowH2AWorks() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <section className="section">
        <div className="wrap stack prose">
          <p className="eyebrow">How H-2A works</p>
          <h1>From first call to crew on the farm</h1>
          <p className="muted" style={{ fontSize: "var(--step-1)" }}>
            H-2A lets farms hire workers from other countries for seasonal jobs when there are not enough U.S. workers. Here is how a season comes together, step by step.
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <ol className="steps">
            {steps.map((s, i) => (
              <li className="step" key={s.title}>
                <span className="step-num" aria-hidden="true">{i + 1}</span>
                <div className="stack">
                  <h2 style={{ fontSize: "var(--step-2)" }}>{s.title}</h2>
                  <span className="step-when">{s.when}</span>
                  <p className="prose">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack-lg">
          <h2>Common questions</h2>
          <div className="faq prose">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p className="muted">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="btn-row">
            <Link href="/contact" className="btn btn-primary">Request a quote</Link>
            <Link href="/resources/h-2a-timeline" className="btn btn-ghost">Read the full H-2A timeline</Link>
          </div>
        </div>
      </section>
    </>
  );
}
