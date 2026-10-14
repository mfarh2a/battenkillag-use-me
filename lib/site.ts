// The details used across the whole site. Change them here once and every page updates.
// Anything in [square brackets] is a placeholder waiting for Max's real information.

// The site's public address. Vercel fills VERCEL_PROJECT_PRODUCTION_URL in automatically.
// When orra.ag is bought, set NEXT_PUBLIC_SITE_URL=https://orra.ag in Vercel and everything updates.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const site = {
  name: "Orra",
  url: siteUrl.replace(/\/$/, ""),
  phone: "123-456-7890",
  email: "H2a@orra.com",
  mailingAddress: "[Mailing address for checks]",
  headline: "Reliable, low-cost H-2A for farming families.",
  subline: "One person on your side all season, so your crew is here when your season starts.",
  positioning:
    "Family farms run on a crew that comes back season after season. Orra handles the H-2A work behind that crew, at a price that works for a family farm, with one team member who knows your farm by name.",
  description:
    "Orra provides reliable, low-cost H-2A service for farming families. One dedicated team member guides you through the job order, DOL and USCIS filings, consulate and travel, and season compliance.",
  lastReviewed: "2026-10-13",
};

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/how-h2a-works", label: "How H-2A works" },
  { href: "/resources", label: "Resources" },
  { href: "/why-orra", label: "Why Orra" },
  { href: "/contact", label: "Contact" },
];

export const categories = [
  { id: "getting-started", label: "Getting started" },
  { id: "wages-pay", label: "Wages and pay" },
  { id: "housing-transport", label: "Housing and transportation" },
  { id: "compliance", label: "Compliance and audits" },
  { id: "workers", label: "Workers" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
