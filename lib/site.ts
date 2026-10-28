// The details used across the whole site. Change them here once and every page updates.
// Anything in [square brackets] is a placeholder waiting for Max's real information.

// The site's public address. Set NEXT_PUBLIC_SITE_URL in Vercel to override (for example on a preview site).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.battenkillag.com";

export const site = {
  name: "Battenkill Ag",
  legalName: "Battenkill Ag Services, LLC",
  url: siteUrl.replace(/\/$/, ""),
  phone: "512-540-4533",
  email: "max@battenkillag.com",
  mailingAddress: "[Mailing address for checks]",
  headline: "Reliable H-2A service for farming families",
  subline: "A dedicated team by your side all season helping employers navigate the complexities of H-2A.",
  positioning:
    "Family farms run on a crew that comes back season after season. Battenkill Ag helps employers file for H-2A contracts, with exceptional customer service and transparent, affordable pricing.",
  description:
    "Battenkill Ag provides reliable, exceptional H-2A service for farming families. One dedicated team member guides you through the job order, DOL and USCIS filings and season compliance, with optional consulate and travel coordination through several partner companies.",
  lastReviewed: "2026-10-13",
};

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/how-h2a-works", label: "How H-2A works" },
  { href: "/resources", label: "Resources" },
  { href: "/why-battenkill", label: "Why Battenkill" },
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
