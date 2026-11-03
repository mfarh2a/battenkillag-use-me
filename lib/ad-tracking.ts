// Records which ad brought a visitor here and reports key actions to Meta.
// Nothing here sends a visitor's name, email or other form details to Meta.

const KEY = "bk_ad_source";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Saves the first ad link a visitor arrived from, so it can go with their form later. */
export function captureAdSource() {
  try {
    const q = new URLSearchParams(window.location.search);
    const parts = ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
      .map((k) => q.get(k))
      .filter(Boolean);
    if (!parts.length && q.get("fbclid")) parts.push("facebook");
    if (parts.length && !window.localStorage.getItem(KEY)) {
      window.localStorage.setItem(KEY, parts.join(" / ").slice(0, 200));
    }
  } catch {
    // Storage can be blocked. The site still works without it.
  }
}

export function getAdSource(): string {
  try {
    return window.localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

/** Standard Meta events, such as Lead or Contact. */
export function trackEvent(name: string) {
  window.fbq?.("track", name);
}

/** Events we name ourselves, such as PlannerUsed. */
export function trackCustomEvent(name: string) {
  window.fbq?.("trackCustom", name);
}
