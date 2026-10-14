"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Banner across the top of every page promoting the free audit checklist.
// Hidden on the checklist page itself. To change the wording, edit the text below.
const TARGET = "/resources/h-2a-audit-prep";

export default function PromoBanner() {
  const pathname = usePathname();
  if (pathname === TARGET) return null;
  return (
    <div className="promo-banner">
      <div className="wrap promo-row">
        <p>
          <strong>Free download:</strong> the H-2A audit-ready checklist.
          <span className="promo-extra"> See every record DOL can ask for.</span>
        </p>
        <Link href={`${TARGET}#checklist`} className="promo-link">Get the checklist</Link>
      </div>
    </div>
  );
}
