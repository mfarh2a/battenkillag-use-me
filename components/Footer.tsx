import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="stack">
            <img src="/brand/battenkill-ag-logo-white.svg" alt={site.legalName} width={204} height={48} className="footer-logo" />
            <p>{site.headline}. {site.subline}</p>
          </div>
          <div>
            <h3>Pages</h3>
            <ul className="footer-links">
              {nav.filter((item) => item.href !== "/plan-your-season").map((item) => (
                <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
              ))}
              <li><Link href="/partners">Become a partner</Link></li>
              <li><Link href="/login">Customer login</Link></li>
            </ul>
          </div>
          <div>
            <h3>Popular guides</h3>
            <ul className="footer-links">
              <li><Link href="/plan-your-season">Plan your season</Link></li>
              <li><Link href="/resources/h-2a-cost">What H-2A costs</Link></li>
              <li><Link href="/resources/h-2a-timeline">H-2A timeline</Link></li>
              <li><Link href="/resources/aewr-explained">AEWR explained</Link></li>
              <li><Link href="/resources/h-2a-audit-prep">Free audit checklist</Link></li>
              <li><Link href="/h-2a">H-2A by state</Link></li>
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
          © {site.legalName}. <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
        </p>
      </div>
    </footer>
  );
}
