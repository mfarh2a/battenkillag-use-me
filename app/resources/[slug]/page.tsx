import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, site } from "@/lib/site";
import { getAllArticles, getArticle } from "@/lib/articles";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import ChecklistForm from "@/components/ChecklistForm";

const FORM_MARKER = /<p>\s*\[\[checklist-form\]\]\s*<\/p>/;

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  const url = `/resources/${a.slug}`;
  return {
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.description,
      url,
      publishedTime: a.date,
      modifiedTime: a.updated,
      images: ["/opengraph-image"],
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.description },
  };
}

function formatDate(d: string) {
  return new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  const all = await getAllArticles();
  const related = [...all.filter((x) => x.category === a.category && x.slug !== a.slug), ...all.filter((x) => x.category !== a.category)].slice(0, 3);
  const cat = categories.find((c) => c.id === a.category);
  const url = `${site.url}/resources/${a.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.description,
          datePublished: a.date,
          dateModified: a.updated,
          mainEntityOfPage: url,
          keywords: a.keywords.join(", "),
          author: { "@type": "Organization", name: site.name, url: site.url },
          publisher: { "@type": "Organization", name: site.name, url: site.url },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: "Resources", item: `${site.url}/resources` },
            { "@type": "ListItem", position: 3, name: a.title, item: url },
          ],
        }}
      />
      {a.faqs.length > 0 && <JsonLd data={faqSchema(a.faqs)} />}

      <section className="section">
        <div className="wrap article-layout">
          <article className="stack-lg">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link> <span aria-hidden="true">/</span> <Link href="/resources">Resources</Link>{" "}
              <span aria-hidden="true">/</span> <Link href={`/resources#${a.category}`}>{cat?.label}</Link>
            </nav>
            <header className="stack prose">
              <h1>{a.title}</h1>
              <p className="lead muted">{a.description}</p>
              <p className="article-meta">
                Last reviewed {formatDate(a.updated)} · {a.readingMinutes} min read
              </p>
            </header>
            {FORM_MARKER.test(a.html) ? (
              (() => {
                const [before, after] = a.html.split(FORM_MARKER);
                return (
                  <>
                    <div className="markdown article-body prose" dangerouslySetInnerHTML={{ __html: before }} />
                    <div className="lead-box prose" id="checklist">
                      <div className="stack">
                        <h2 className="lead-title">Get the checklist by email</h2>
                        <p className="muted">Enter your name and email and we will send you the Excel template.</p>
                      </div>
                      <ChecklistForm />
                    </div>
                    <div className="markdown article-body prose" dangerouslySetInnerHTML={{ __html: after }} />
                  </>
                );
              })()
            ) : (
              <div className="markdown article-body prose" dangerouslySetInnerHTML={{ __html: a.html }} />
            )}

            {a.faqs.length > 0 && (
              <section className="stack prose">
                <h2>Quick answers</h2>
                <div className="faq">
                  {a.faqs.map((f) => (
                    <details key={f.q}>
                      <summary>{f.q}</summary>
                      <p className="muted">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <p className="notice prose">
              Battenkill Ag is an H-2A agent, not a law firm. This guide is general information, not legal advice. Rules change, so
              check the linked regulations or talk to an immigration attorney about your situation. Last reviewed{" "}
              {formatDate(a.updated)}.
            </p>
          </article>

          <aside className="article-aside stack">
            <div className="card stack">
              <h2 className="aside-title">Want this handled for you?</h2>
              <p className="muted">Reliable, low-cost service with one person on your side all season.</p>
              <Link href="/contact" className="btn btn-primary">Request a quote</Link>
            </div>
            <div className="card stack">
              <h2 className="aside-title">Related guides</h2>
              <ul className="related">
                {related.map((r) => (
                  <li key={r.slug}><Link href={`/resources/${r.slug}`}>{r.title}</Link></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
