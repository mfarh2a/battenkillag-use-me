import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "Customer login", robots: { index: false, follow: false } };

export default function Login() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: "28rem" }}>
        <div className="stack-lg">
          <div className="stack">
            <p className="eyebrow">Customer portal</p>
            <h1>Customer login</h1>
            <p className="muted">Upload &amp; access documents, pay invoices, and track your petition.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
