import type { Metadata } from "next";
import { renderContent } from "@/lib/markdown";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default async function Terms() {
  const html = await renderContent("terms.md");
  return (
    <section className="section">
      <div className="wrap">
        <article className="markdown prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </section>
  );
}
