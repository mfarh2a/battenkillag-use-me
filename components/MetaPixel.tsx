"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { captureAdSource } from "@/lib/ad-tracking";

const PIXEL_ID = "1651333296730291";

// Customer login pages stay out of ad tracking.
const isPrivate = (path: string) => path.startsWith("/login");

export default function MetaPixel() {
  const pathname = usePathname();
  const off = isPrivate(pathname);

  // The script below counts the first page. This counts each page after that.
  const lastPath = useRef(pathname);

  useEffect(() => {
    captureAdSource();
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (!off) window.fbq?.("track", "PageView");
  }, [pathname, off]);

  if (off) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
