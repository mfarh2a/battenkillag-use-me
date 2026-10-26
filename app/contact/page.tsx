import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Battenkill Ag for an H-2A Quote",
  description: "Tell us your start date and how many workers you need. Battenkill Ag will send an H-2A quote for your farm.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <section className="section">
      <div className="wrap grid-2" style={{ alignItems: "start", gap: "3rem" }}>
        <div className="stack-lg">
          <div className="stack">
            <p className="eyebrow">Contact</p>
            <h1>Request a quote</h1>
            <p className="muted" style={{ fontSize: "var(--step-1)" }}>
              Tell us about your farm and when you need your crew. We will get back to you within one business day.
            </p>
          </div>
          <div className="card">
            <h2 style={{ fontSize: "var(--step-1)" }}>Rather talk now?</h2>
            <p>Call or text: <strong>{site.phone}</strong></p>
            <p>Email: <strong>{site.email}</strong></p>
          </div>
          <p className="muted" style={{ fontSize: "var(--step--1)" }}>
            Please don&apos;t send passports, tax IDs or other private documents through this form. Customers upload those through the secure portal.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
