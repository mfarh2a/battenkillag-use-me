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
            <p className="muted">Upload documents, see everything you have sent us, and pay invoices.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
