import Link from "next/link";
import { nav, site } from "@/lib/site";
import MobileNav from "@/components/MobileNav";

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link href="/" className="brand" aria-label={`${site.legalName} home`}>
          <img src="/brand/battenkill-ag-logo.svg" alt={site.legalName} width={193} height={45} />
        </Link>
        <nav className="nav" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
          <Link href="/login" className="btn btn-primary btn-small">Customer login</Link>
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
