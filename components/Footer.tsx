import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="stack">
            <h3>{site.name}</h3>
            <p>{site.headline} {site.subline}</p>
          </div>
          <div>
            <h3>Pages</h3>
            <ul className="footer-links">
              {nav.map((item) => (
                <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
              ))}
              <li><Link href="/login">Customer login</Link></li>
            </ul>
          </div>
          <div>
            <h3>Popular guides</h3>
            <ul className="footer-links">
              <li><Link href="/resources/h-2a-cost">What H-2A costs</Link></li>
              <li><Link href="/resources/h-2a-timeline">H-2A timeline</Link></li>
              <li><Link href="/resources/aewr-explained">AEWR explained</Link></li>
              <li><Link href="/resources/h-2a-audit-prep">Free audit checklist</Link></li>
            </ul>
          </div>
          <div>
            <h3>Contact us</h3>
            <ul className="footer-links">
              <li>{site.phone}</li>
              <li>{site.email}</li>
            </ul>
          </div>
        </div>
        <p className="footer-small">
          © {year} {site.name}. <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
        </p>
      </div>
    </footer>
  );
}
