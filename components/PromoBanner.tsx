"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Banner across the top of every page promoting the Plan your season tool.
// Hidden on that page itself. To change the wording, edit the text below.
const TARGET = "/plan-your-season";

export default function PromoBanner() {
  const pathname = usePathname();
  if (pathname === TARGET) return null;
  return (
    <div className="promo-banner">
      <div className="wrap promo-row">
        <p>
          <strong>Free tool:</strong> plan your H-2A season.
          <span className="promo-extra"> Enter your start date and see every deadline, with an audit checklist for your dates.</span>
        </p>
        <Link href={TARGET} className="promo-link">Plan your season</Link>
      </div>
    </div>
  );
}
