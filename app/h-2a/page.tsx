import type { Metadata } from "next";
import Link from "next/link";
import { states } from "@/lib/states";

export const metadata: Metadata = {
  title: "H-2A by State",
  description: "H-2A help for farms in every state Battenkill Ag serves: start months, crops, wages offered and how the filing works in your state.",
  alternates: { canonical: "/h-2a" },
};

export default function StatesIndex() {
  return (
    <section className="section">
      <div className="wrap stack-lg">
        <div className="stack prose">
          <p className="eyebrow">H-2A by state</p>
          <h1>H-2A help in your state</h1>
          <p className="muted" style={{ fontSize: "var(--step-1)" }}>
            Pick your state to see when crews usually start, what farms grow with H-2A and what wages were offered, from the Department of Labor&apos;s latest filings.
          </p>
        </div>
        <ul className="state-index">
          {states.map((s) => (
            <li key={s.slug}>
              <Link href={`/h-2a/${s.slug}`}>{s.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
