import type { Metadata } from "next";
import { renderContent } from "@/lib/markdown";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default async function Privacy() {
  const html = await renderContent("privacy.md");
  return (
    <section className="section">
      <div className="wrap">
        <article className="markdown prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </section>
  );
}
