import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: "Why Battenkill Ag: H-2A Built Around Farming Families",
  description:
    "Battenkill Ag exists so family farms get dependable, exceptional H-2A service and one team member who knows their farm, season after season.",
  alternates: { canonical: "/why-battenkill" },
};

const beliefs = [
  {
    title: "Family farms deserve the same service",
    body: "A farm bringing in a small crew needs its workers on time just as much as a large operation. Every farm we work with gets quick answers and the same attention, whatever the crew size.",
  },
  {
    title: "Transparent, affordable pricing",
    body: "You know what you'll pay before the season starts, at a rate that works for family farms. Good service and a fair price go together here.",
  },
  {
    title: "You always know who to call",
    body: "One team member handles your farm from planning to the end of the season. They know your farm, your crew and your history, so you never have to explain things twice.",
  },
  {
    title: "No surprises",
    body: "We tell you what is coming before it arrives: deadlines, approvals, delays and what each one means for your season.",
  },
];

export default function WhyBattenkill() {
  return (
    <>
      <section className="hero">
        <div className="wrap stack prose">
          <p className="eyebrow">Why Battenkill</p>
          <h1>Why we exist</h1>
          <p className="lead">
            Family farms run on people: the crew that comes back each season and knows the work. H-2A makes that crew
            possible. Battenkill Ag exists to give farming families reliable, exceptional H-2A service at a fair price, with a
            dedicated team by their side all season.
          </p>
        </div>
      </section>

      <Photo name="valleySunrise" className="photo-band" priority sizes="100vw" />

      <section className="section section-alt">
        <div className="wrap split">
          <div className="stack prose">
            <p className="eyebrow">About us</p>
            <h2>Who we are</h2>
            <p className="muted">
              Both sides of my family have worked in agriculture for generations. My mom&apos;s family ran a vegetable stand in
              Eagle Bridge, New York. My uncle owned a corn farm in Greenwich, right along the Battenkill River.
            </p>
            <p className="muted">
              I got my own start later, working on a pig and chicken farm in Texas while I was in school. After that, I worked
              with employers across the U.S. to grow one of the largest H-2A agencies in the country. I was also a member of
              the U.S. Apple NextGen program.
            </p>
            <p className="muted">
              I started Battenkill Ag to give family farms reliable, personal H-2A service. I look forward to continuing to
              serve the ag community.
            </p>
            <p><strong>Max Farrell</strong>, Owner</p>
          </div>
          <Photo name="battenkillRiver" className="photo-card" />
        </div>
      </section>

      <section className="section">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <p className="eyebrow">What we believe</p>
            <h2>How we work with every farm</h2>
          </div>
          <div className="grid-2">
            {beliefs.map((b) => (
              <div className="card promise" key={b.title}>
                <h3>{b.title}</h3>
                <p className="muted">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap stack prose">
          <p className="eyebrow">Who we work with</p>
          <h2>Farming families with a seasonal crew</h2>
          <p className="muted">
            We work with family-owned farms growing fruit, vegetables and nursery plants, orchards and vineyards, row crops,
            and livestock operations with seasonal work. Whether you bring in a few workers or a few dozen, you get the same
            team member and the same care.
          </p>
        </div>
      </section>

      <section className="section cta-band">
        <div className="wrap stack-lg">
          <div className="stack prose">
            <h2>Let&apos;s plan your next season</h2>
            <p>Tell us your start date and how many workers you need, and we will send a quote.</p>
          </div>
          <div className="btn-row">
            <Link href="/contact" className="btn btn-primary">Request a quote</Link>
            <Link href="/services" className="btn btn-ghost">See our services</Link>
          </div>
        </div>
      </section>
    </>
  );
}
