import type { Metadata } from "next";
import PartnerForm from "@/components/PartnerForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Become a Partner | Battenkill Ag",
  description:
    "Battenkill Ag works with professionals across agriculture. Refer growers who need H-2A help and earn a recurring payment for as long as they stay a customer.",
  alternates: { canonical: "/partners" },
};

const who = [
  "Ag lenders and farm credit officers",
  "Crop consultants and agronomists",
  "Accountants and farm bookkeepers",
  "Insurance agents",
  "Equipment and input dealers",
  "Associations, co-ops and extension staff",
];

const steps = [
  { title: "Introduce a grower", body: "Tell us about a farm that could use help with H-2A, or send them our way with your name." },
  { title: "We take it from there", body: "We reach out, answer their questions and handle their H-2A filing from start to finish." },
  { title: "You get paid every year", body: "You earn a recurring payment each year, for as long as the grower stays a Battenkill Ag customer." },
];

export default function Partners() {
  return (
    <>
      <section className="section">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <p className="eyebrow">Partner program</p>
            <h1>Become a partner</h1>
            <p className="muted" style={{ fontSize: "var(--step-1)" }}>
              Farming runs on relationships. Growers lean on the people they already trust, which is why we work with
              professionals across the ag industry. When you introduce a grower who needs H-2A help, we take good care
              of them, and we thank you with a payment every year they stay with us.
            </p>
          </div>
          <div className="grid-3">
            {steps.map((s, i) => (
              <div className="card" key={s.title}>
                <p className="eyebrow">Step {i + 1}</p>
                <h3>{s.title}</h3>
                <p className="muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap grid-2" style={{ alignItems: "start", gap: "3rem" }}>
          <div className="stack-lg">
            <div className="stack">
              <h2>Who we partner with</h2>
              <ul className="check-list">
                {who.map((w) => <li key={w}>{w}</li>)}
              </ul>
            </div>
            <div className="stack">
              <h2>Why partners work with us</h2>
              <ul className="check-list">
                <li>A recurring payment for as long as the grower stays a customer</li>
                <li>Your growers get reliable service and quick answers all season</li>
                <li>Transparent, affordable pricing you can feel good recommending</li>
                <li>No paperwork for you. We handle the grower from first call to final audit</li>
              </ul>
            </div>
            <div className="card">
              <h2 style={{ fontSize: "var(--step-1)" }}>Questions first?</h2>
              <p>Call or text: <strong>{site.phone}</strong></p>
              <p>Email: <strong>{site.email}</strong></p>
            </div>
          </div>
          <PartnerForm />
        </div>
      </section>
    </>
  );
}
