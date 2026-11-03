import data from "@/content/states.json";
import aewrData from "@/content/aewr.json";

export type AewrRates = { us1: number; us2: number; h1: number; h2: number; adj: number; effective: string };
export function aewrFor(name: string): AewrRates | null {
  return (aewrData as Record<string, AewrRates>)[name] ?? null;
}

export type StateInfo = {
  slug: string;
  abbr: string;
  name: string;
  filings: number;
  workers: number;
  employers: number;
  flcShare: number;
  smallEmployers: number;
  growerEmployers: number;
  medianCrew: number;
  topMonths: string[];
  months: number[];
  crops: string[];
  counties: string[];
  wage: number | null;
  filings26: number;
};

export const states = data as StateInfo[];
export const getState = (slug: string) => states.find((s) => s.slug === slug);

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const SOURCE =
  "U.S. Department of Labor, Office of Foreign Labor Certification H-2A disclosure data: fiscal year 2025 (October 2024 to September 2025) and fiscal year 2026 through June 2026.";

export function monthsBefore(month: string, n: number) {
  const i = MONTHS.indexOf(month);
  return MONTHS[(i - n + 12) % 12];
}

export function listJoin(items: string[]) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function stateFaqs(s: StateInfo) {
  const peak = s.topMonths[0];
  const faqs = [
    {
      q: `When do H-2A workers usually start in ${s.name}?`,
      a: `The busiest start months in ${s.name} are ${listJoin(s.topMonths)}. For a ${peak} start, begin planning in ${monthsBefore(peak, 4)} and have your job order filed about 75 days before your start date.`,
    },
    {
      q: `What is the H-2A wage in ${s.name}?`,
      a: (() => {
        const r = aewrFor(s.name);
        const base = r
          ? `For field and livestock jobs in ${s.name}, the current AEWR for H-2A workers provided free housing is $${r.h1.toFixed(2)} an hour at Skill Level I and $${r.h2.toFixed(2)} at Skill Level II, after a $${r.adj.toFixed(2)} housing adjustment. U.S. workers in corresponding employment get $${r.us1.toFixed(2)} and $${r.us2.toFixed(2)}. You pay a higher prevailing, union or minimum wage if one applies.`
          : `H-2A workers must be paid at least the Adverse Effect Wage Rate (AEWR) that the Department of Labor sets for ${s.name}, or a higher prevailing, union or minimum wage if one applies.`;
        const offered = s.wage ? ` On fiscal year 2026 filings for crop workers in ${s.name}, the median wage offered was $${s.wage.toFixed(2)} an hour.` : "";
        return `${base}${offered} A court ordered the Department of Labor to issue a new method by December 30, 2026, so check its FLAG site before you file.`;
      })(),
    },
    {
      q: `Who inspects H-2A housing in ${s.name}?`,
      a: `${s.name}'s state workforce agency (SWA) receives your job order. Your housing must also pass inspection before the Department of Labor can certify your application, and the inspecting office schedules directly with you. Reach out early so it doesn't hold up your crew's arrival.`,
    },
    {
      q: `Can Battenkill Ag file H-2A for my ${s.name} farm?`,
      a: `Yes. Battenkill Ag prepares and files H-2A paperwork for small to mid-sized agricultural employers in ${s.name}: the job order, the Department of Labor application, the USCIS petition and your season compliance records, with transparent pricing quoted up front.`,
    },
  ];
  return faqs;
}
