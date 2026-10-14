import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Customer login", robots: { index: false, follow: false } };

export default function Login() {
  return (
    <section className="section">
      <div className="wrap stack prose">
        <p className="eyebrow">Customer portal</p>
        <h1>Customer login</h1>
        <p className="notice">Our secure customer portal is on its way.</p>
        <p className="muted">
          Soon you will be able to log in here to upload documents, see everything you have sent us, and pay invoices. Until then, call {site.phone} or email {site.email} and we will set up a secure way to share your files.
        </p>
      </div>
    </section>
  );
}
