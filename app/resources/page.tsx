import type { Metadata } from "next";
import Link from "next/link";
import { categories, site } from "@/lib/site";
import { getAllArticles } from "@/lib/articles";
import JsonLd from "@/components/JsonLd";

const description =
  "Free H-2A guides for farms: timeline, costs, AEWR, the three-fourths guarantee, housing, travel reimbursement, pay records, audits and more. Written in plain English.";

export const metadata: Metadata = {
  title: "H-2A Resources and Compliance Guides",
  description,
  alternates: { canonical: "/resources" },
  openGraph: { title: `H-2A Resources and Compliance Guides | ${site.name}`, description, url: "/resources", images: ["/opengraph-image"] },
};

export default async function Resources() {
  const articles = await getAllArticles();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "H-2A Resources and Compliance Guides",
          description,
          url: `${site.url}/resources`,
          hasPart: articles.map((a) => ({ "@type": "Article", headline: a.title, url: `${site.url}/resources/${a.slug}` })),
        }}
      />
      <section className="hero">
        <div className="wrap stack prose">
          <p className="eyebrow">Resources</p>
          <h1>H-2A guides for family farms</h1>
          <p className="lead">
            Plain-English answers to the questions farms ask us most: what H-2A costs, when to file, what you owe your
            crew, and what records keep you ready for an audit. Each guide links to the regulation it comes from.
          </p>
        </div>
      </section>

      {categories.map((c, i) => {
        const list = articles.filter((a) => a.category === c.id);
        if (!list.length) return null;
        return (
          <section className={`section ${i % 2 ? "" : "section-alt"}`} key={c.id} id={c.id}>
            <div className="wrap stack-lg">
              <h2>{c.label}</h2>
              <div className="grid-3">
                {list.map((a) => (
                  <Link href={`/resources/${a.slug}`} className="card article-card" key={a.slug}>
                    <h3>{a.title}</h3>
                    <p className="muted">{a.description}</p>
                    <span className="article-meta">{a.readingMinutes} min read</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="section cta-band">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <h2>Rather have someone handle it?</h2>
            <p>Battenkill Ag files your H-2A paperwork, tracks every deadline and keeps your season records organized. Tell us your start date and crew size for a quote.</p>
          </div>
          <div className="btn-row">
            <Link href="/contact" className="btn btn-primary">Request a quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
