import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import contactsData from "@/content/state-contacts.json";

type Contact = { office: string; phone?: string; email?: string; url?: string; note?: string };
const contacts = contactsData as Record<string, Contact>;
import JsonLd, { faqSchema } from "@/components/JsonLd";
import { MONTHS, SOURCE, getState, listJoin, monthsBefore, stateFaqs, states } from "@/lib/states";

type Props = { params: Promise<{ state: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return states.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const s = getState(state);
  if (!s) return {};
  const title = `H-2A Agent for ${s.name} Farms`;
  const description = `H-2A help for ${s.name} growers: when crews start, what farms grow, wages offered and how Battenkill Ag files your job order, DOL application and USCIS petition.`;
  return {
    title,
    description,
    keywords: [`H-2A ${s.name}`, `H-2A agent ${s.name}`, `${s.name} H-2A AEWR`, `H-2A visa ${s.abbr}`, `${s.name} farm labor H-2A`],
    alternates: { canonical: `/h-2a/${s.slug}` },
    openGraph: { title, description, url: `/h-2a/${s.slug}`, images: ["/opengraph-image"] },
  };
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const s = getState(state);
  if (!s) notFound();
  const faqs = stateFaqs(s);
  const peak = s.topMonths[0];
  const maxMonth = Math.max(...s.months);
  const url = `${site.url}/h-2a/${s.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `H-2A filing for ${s.name} farms`,
          serviceType: "H-2A visa agent services for agricultural employers",
          provider: { "@id": `${site.url}/#org` },
          areaServed: { "@type": "State", name: s.name },
          url,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: "H-2A by state", item: `${site.url}/h-2a` },
            { "@type": "ListItem", position: 3, name: s.name, item: url },
          ],
        }}
      />
      <JsonLd data={faqSchema(faqs)} />

      <section className="section">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <p className="eyebrow"><Link href="/h-2a">H-2A by state</Link> / {s.name}</p>
            <h1>H-2A help for {s.name} farms</h1>
            <p className="muted" style={{ fontSize: "var(--step-1)" }}>
              Battenkill Ag files H-2A for family farms across {s.name}. Here is what the program looks like in the state, from the Department of Labor&apos;s latest filings.
            </p>
          </div>
          <dl className="state-stats">
            <div><dt>H-2A applications, FY2025</dt><dd>{s.filings.toLocaleString()}</dd></div>
            <div><dt>Workers requested</dt><dd>{s.workers.toLocaleString()}</dd></div>
            <div><dt>Employers filing</dt><dd>{s.employers.toLocaleString()}</dd></div>
            <div><dt>Typical crew size</dt><dd>{s.medianCrew}</dd></div>
          </dl>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap split">
          <div className="stack prose">
            <h2>When {s.name} crews start</h2>
            <p>
              The busiest start months are <strong>{listJoin(s.topMonths)}</strong>. For a {peak} start, begin planning in {monthsBefore(peak, 4)},
              file your job order about 75 days ahead, and expect the Department of Labor&apos;s decision about 30 days before your crew arrives.
            </p>
            <p className="muted">Share of FY2025 applications by start month.</p>
          </div>
          <div className="month-bars" role="img" aria-label={`Start months in ${s.name}: busiest are ${listJoin(s.topMonths)}`}>
            {s.months.map((m, i) => (
              <div key={MONTHS[i]} className="month-bar">
                <span className="mb-pct">{m >= 0.01 ? pct(m) : ""}</span>
                <span className="mb-fill" style={{ height: `${maxMonth ? Math.round((m / maxMonth) * 160) : 0}px` }} />
                <span className="mb-label">{MONTHS[i].slice(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2">
          <div className="stack prose">
            <h2>What {s.name} farms grow with H-2A</h2>
            {s.crops.length > 0 && <p>Farms filing their own H-2A in {s.name} most often grow <strong>{listJoin(s.crops)}</strong>.</p>}
            {s.counties.length > 0 && <p>The most worksites are in {listJoin(s.counties)} {s.counties.length > 1 ? "counties" : "County"}.</p>}
            {s.growerEmployers > 0 && (
              <p>
                {s.smallEmployers.toLocaleString()} of the {s.growerEmployers.toLocaleString()} farms that filed for themselves asked for fewer than 20 workers. Small, family-run crews are the norm, and that is who we work with.
              </p>
            )}
          </div>
          <div className="stack prose">
            <h2>Wages and the AEWR</h2>
            <p>
              H-2A workers must be paid at least the Adverse Effect Wage Rate (AEWR) the Department of Labor sets for {s.name}, or a higher prevailing, union or minimum wage if one applies.
              {s.wage ? <> On FY2026 filings for crop workers in {s.name}, the median wage offered was <strong>${s.wage.toFixed(2)} an hour</strong>.</> : null}
            </p>
            <p>Rates change each year. Check the current rate on the Department of Labor&apos;s <a href="https://flag.dol.gov/wage-data/adverse-effect-wage-rates" target="_blank" rel="noopener">AEWR page</a>, and read our <Link href="/resources/aewr-explained">AEWR guide</Link>.</p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap grid-2">
          <div className="stack prose">
            <h2>Your job order and housing inspection</h2>
            <p>
              Your job order goes to {s.name}&apos;s state workforce agency (SWA), which posts the job for U.S. workers. Your housing also has to pass inspection before the Department of Labor can certify your application. The inspecting office schedules directly with you, so reach out early.
            </p>
            {(() => {
              const c = contacts[s.abbr];
              return (
                <div className="card stack">
                  <h3>Schedule your housing inspection</h3>
                  {c ? (
                    <>
                      <p><strong>{c.office}</strong></p>
                      {c.phone && <p>Phone: <a href={`tel:${c.phone.replace(/[^0-9]/g, "")}`}>{c.phone}</a></p>}
                      {c.email && <p>Email: <a href={`mailto:${c.email}`}>{c.email}</a></p>}
                      {c.note && <p>{c.note}</p>}
                      {c.url && <p><a href={c.url} target="_blank" rel="noopener">Official {s.name} H-2A page</a></p>}
                    </>
                  ) : (
                    <>
                      <p>Contact the foreign labor certification unit at {s.name}&apos;s state workforce agency to request your pre-occupancy inspection. The state coordinates the inspection directly with you, and we help you prepare and keep the process on track.</p>
                      <p>Find {s.name}&apos;s H-2A contact on the Department of Labor&apos;s <a href="https://www.dol.gov/agencies/eta/foreign-labor/contact" target="_blank" rel="noopener">state contacts page</a>.</p>
                    </>
                  )}
                  <p className="muted">Contacts change. Confirm with the state before you schedule.</p>
                </div>
              );
            })()}
          </div>
          <div className="stack prose">
            <h2>How Battenkill Ag helps</h2>
            <ul className="check-list">
              <li>Job order drafted from your last season, filed with the SWA and tracked</li>
              <li>Department of Labor application and USCIS petition prepared and filed</li>
              <li>A text from us as each approval comes through</li>
              <li>Season compliance packet and a digital filing cabinet for your records</li>
              <li>Transparent, affordable pricing for family farms</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack-lg">
          <h2>{s.name} H-2A questions</h2>
          <div className="faq prose">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p className="muted">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="muted" style={{ fontSize: "var(--step--1)" }}>Source: {SOURCE}</p>
        </div>
      </section>

      <section className="section cta-band">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <h2>Planning a {peak} start in {s.name}?</h2>
            <p>Start about four months before you need your crew. Tell us your start date and how many workers you need, and we will send you a quote.</p>
          </div>
          <div className="btn-row">
            <Link href="/contact" className="btn btn-primary">Request a quote</Link>
            <Link href="/h-2a" className="btn btn-ghost">Other states</Link>
          </div>
        </div>
      </section>
    </>
  );
}
