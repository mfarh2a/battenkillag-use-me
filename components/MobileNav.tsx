"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { nav } from "@/lib/site";

// Phone menu. Closes when a link is tapped, when the page changes,
// when the visitor taps outside it, or when they press Escape.
export default function MobileNav() {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const close = () => ref.current?.removeAttribute("open");

  useEffect(close, [pathname]);

  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <details className="mobile-nav" ref={ref}>
      <summary aria-label="Open menu">Menu</summary>
      <div className="mobile-menu">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} onClick={close}>{item.label}</Link>
        ))}
        <Link href="/login" onClick={close}>Customer login</Link>
      </div>
    </details>
  );
}
