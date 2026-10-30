import data from "@/content/states.json";

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
      q: `How many farms use the H-2A program in ${s.name}?`,
      a: `In fiscal year 2025, ${s.employers.toLocaleString()} employers filed ${s.filings.toLocaleString()} H-2A applications for work in ${s.name}, requesting ${s.workers.toLocaleString()} workers. The typical application asked for ${s.medianCrew} worker${s.medianCrew === 1 ? "" : "s"}.`,
    },
    {
      q: `When do H-2A workers usually start in ${s.name}?`,
      a: `The busiest start months in ${s.name} are ${listJoin(s.topMonths)}. For a ${peak} start, begin planning in ${monthsBefore(peak, 4)} and have your job order filed about 75 days before your start date.`,
    },
    {
      q: `What is the H-2A wage in ${s.name}?`,
      a: s.wage
        ? `H-2A workers must be paid at least the Adverse Effect Wage Rate (AEWR) that the Department of Labor sets for ${s.name}, or a higher prevailing, union or minimum wage if one applies. On fiscal year 2026 filings for crop workers in ${s.name}, the median wage offered was $${s.wage.toFixed(2)} an hour. Check the current AEWR on the Department of Labor's FLAG site before you file.`
        : `H-2A workers must be paid at least the Adverse Effect Wage Rate (AEWR) that the Department of Labor sets for ${s.name}, or a higher prevailing, union or minimum wage if one applies. Check the current AEWR on the Department of Labor's FLAG site before you file.`,
    },
    {
      q: `Who inspects H-2A housing in ${s.name}?`,
      a: `${s.name}'s state workforce agency (SWA) receives your job order and arranges the housing inspection, which must be done before the Department of Labor can certify your application. Schedule it early so it doesn't hold up your crew's arrival.`,
    },
    {
      q: `Can Battenkill Ag file H-2A for my ${s.name} farm?`,
      a: `Yes. Battenkill Ag prepares and files H-2A paperwork for family farms in ${s.name}: the job order, the Department of Labor application, the USCIS petition and your season compliance records, with transparent, affordable pricing.`,
    },
  ];
  return faqs;
}
