import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { getAllArticles } from "@/lib/articles";
import { homeFaqs } from "@/lib/home-faqs";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: { absolute: `${site.name} | Reliable, Low-Cost H-2A for Farming Families` },
  description: site.description,
  alternates: { canonical: "/" },
};

const outcomes = [
  { title: "Your crew on your date", body: "We start early and watch every step, so workers arrive when your season starts." },
  { title: "A dedicated team member who knows your farm", body: "The same team member from your first call to the end of your season." },
  { title: "Paperwork off your plate", body: "Filings, deadlines and agency questions handled, so you can run the farm." },
];

const yourPerson = [
  { when: "About 4 months out", what: "Calls you to plan dates, crew size, jobs and housing, starting from last season if you have one." },
  { when: "During filing", what: "Files your job order and applications, and texts you as each approval comes through." },
  { when: "If something stalls", what: "Tells you the same day, explains it in straightforward terms, and tells you what happens next." },
  { when: "Before arrival", what: "Lets you know when visas clear and when your crew is on the way." },
  { when: "During the season", what: "Answers your questions, keeps your records organized, and starts the 2-day notice clock if a worker leaves." },
  { when: "If DOL calls", what: "Pulls your season file together and helps you respond." },
];

const crew = [
  {
    title: "Paid right from day one",
    body: "We confirm your wage rate, pay schedule and pay stub requirements before the season, so your first payday goes smoothly.",
  },
  {
    title: "The contract in hand before they travel",
    body: "Workers get a copy of their job terms before they leave home, so everyone starts the season on the same page.",
  },
  {
    title: "Housing ready on time",
    body: "We get your housing inspection on the calendar early, so it never holds up arrival.",
  },
  {
    title: "The same faces each season",
    body: "We can name your returning workers on your petition, so the people you trained are the ones who come back.",
  },
];

const services = [
  { title: "Season planning", body: "Dates, crew size, jobs and housing, set with you." },
  { title: "Job order and state posting", body: "Written, filed with your state and tracked through inspection." },
  { title: "Department of Labor application", body: "Filed, with U.S. recruitment documented and any questions answered on time." },
  { title: "USCIS petition", body: "Your Form I-129 for named or unnamed workers." },
  { title: "Consulate and travel", body: "Optional: consulate appointments and travel to your farm, coordinated by us with several partner companies in Mexico." },
  { title: "Season compliance", body: "A clear compliance packet, deadline reminders and help if DOL calls." },
];

const industries = [
  { title: "Fruit and vegetables", body: "Planting, harvest and packing for specialty crops." },
  { title: "Orchards and vineyards", body: "Apples, stone fruit, berries and grapes, from pruning to picking." },
  { title: "Nurseries and greenhouses", body: "Seasonal propagation, potting, shipping and field work." },
  { title: "Row crops", body: "Seasonal field work for tobacco, sweet potatoes and other row crops." },
  { title: "Seasonal livestock work", body: "Shearing, lambing and other livestock jobs with a clear season." },
];

const featured = ["h-2a-timeline", "h-2a-cost", "h-2a-audit-prep"];

export default async function Home() {
  const articles = (await getAllArticles()).filter((a) => featured.includes(a.slug));
  articles.sort((a, b) => featured.indexOf(a.slug) - featured.indexOf(b.slug));

  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="stack-lg">
            <p className="eyebrow">H-2A for farming families</p>
            <h1>
              {site.headline.split("H-2A").map((part, i, arr) => (
                <span key={i}>{part}{i < arr.length - 1 && <span className="nowrap">H-2A</span>}</span>
              ))}
            </h1>
            <p className="subline">{site.subline}</p>
            <p className="lead">{site.positioning}</p>
            <div className="btn-row">
              <Link href="/contact" className="btn btn-primary">Request a quote</Link>
              <Link href="/how-h2a-works" className="btn btn-ghost">How H-2A works</Link>
            </div>
          </div>
          <aside className="season-card" aria-labelledby="person-title">
            <h2 id="person-title">Your team, all season</h2>
            <ul className="season-list">
              {yourPerson.map((s) => (
                <li key={s.when}>
                  <span className="when">{s.when}</span>
                  <span>{s.what}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <Photo name="orchardSunrise" className="photo-band" priority sizes="100vw" />

      <section className="trust-strip" aria-label="What you get">
        <div className="wrap trust-grid">
          {outcomes.map((o) => (
            <div key={o.title}><strong>{o.title}</strong><span>{o.body}</span></div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap stack-lg">
          <div className="split">
          <div className="stack prose">
            <p className="eyebrow">Keep your crew coming back</p>
            <h2>A good season makes the next one easier</h2>
            <p className="muted">
              Workers return to farms where they are paid fairly and on time, treated with respect and housed well. We take
              care of the parts the paperwork touches, so your crew starts every season on solid ground.
            </p>
          </div>
          <Photo name="orchardAerial" className="photo-card" />
          </div>
          <div className="grid-2">
            {crew.map((c) => (
              <div className="card promise" key={c.title}>
                <h3>{c.title}</h3>
                <p className="muted">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <p className="eyebrow">What we handle</p>
            <h2>H-2A, start to finish</h2>
            <p className="muted">You run the farm and stay the employer. We handle the filings, the deadlines and the back and forth with the agencies.</p>
          </div>
          <div className="grid-3">
            {services.map((h, i) => (
              <div className="card service-card" key={h.title}>
                <span className="service-num" aria-hidden="true">{i + 1}</span>
                <h3>{h.title}</h3>
                <p className="muted">{h.body}</p>
              </div>
            ))}
          </div>
          <p><Link href="/services">See everything we do, and what stays with you</Link></p>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2" style={{ alignItems: "center", gap: "3rem" }}>
          <div className="stack prose">
            <p className="eyebrow">Less paperwork, less worry</p>
            <h2>Records that are ready before anyone asks</h2>
            <p className="muted">
              H-2A comes with a lot of rules and a lot of records. Every Battenkill Ag customer gets a digital filing cabinet that
              tracks them automatically, organized by requirement. We remind you before deadlines and help you respond
              quickly and completely if the Department of Labor asks.
            </p>
            <p><Link href="/resources/h-2a-audit-prep#checklist">Get the free audit checklist</Link></p>
          </div>
          <div className="stack">
          <Photo name="cranberryHarvest" className="photo-card" />
          <ul className="check-list card">
            <li>Job order, applications and approvals in one place</li>
            <li>Housing, vehicle and workers&apos; comp records tracked</li>
            <li>Pay and hours records checked against what H-2A requires</li>
            <li>Notices sent on time if a worker leaves</li>
            <li>A complete season file kept for at least 3 years</li>
          </ul>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <p className="eyebrow">Who we work with</p>
            <h2>Seasonal farms of every kind</h2>
            <p className="muted">H-2A covers temporary or seasonal farm work. If your season has a clear start and end, we can likely help.</p>
          </div>
          <div className="industry-grid">
            {industries.map((x) => (
              <div className="industry" key={x.title}>
                <h3>{x.title}</h3>
                <p className="muted">{x.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <p className="eyebrow">Free guides</p>
            <h2>Know the rules before your season starts</h2>
            <p className="muted">Straightforward guides on timing, cost, wages, housing and audits, each linked to the regulation behind it.</p>
          </div>
          <div className="grid-3">
            {articles.map((a) => (
              <Link href={`/resources/${a.slug}`} className="card article-card" key={a.slug}>
                <h3>{a.title}</h3>
                <p className="muted">{a.description}</p>
                <span className="article-meta">{a.readingMinutes} min read</span>
              </Link>
            ))}
          </div>
          <p><Link href="/resources">Browse all H-2A guides</Link></p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap stack-lg">
          <h2>Common questions</h2>
          <div className="faq prose">
            {homeFaqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p className="muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <h2>Planning next season?</h2>
            <p>Start about four months before you need your crew. Tell us your start date and how many workers you need, and we will send you a quote.</p>
          </div>
          <div className="btn-row">
            <Link href="/contact" className="btn btn-primary">Request a quote</Link>
            <Link href="/why-battenkill" className="btn btn-ghost">Why Battenkill</Link>
          </div>
        </div>
      </section>
    </>
  );
}
