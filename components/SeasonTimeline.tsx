"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode, type TouchEvent } from "react";

type Stage = {
  id: string;
  label: string;
  when: string;
  title: string;
  points: string[];
  optional?: boolean;
  icon: ReactNode;
};

// Simple line icons that grow like a crop across the season.
const icons = {
  seed: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4 24h24" />
      <ellipse cx="16" cy="19" rx="3.2" ry="4.2" transform="rotate(-20 16 19)" />
    </svg>
  ),
  sprout: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4 26h24M16 26V15" />
      <path d="M16 17c-5 0-7-3-7-7 4 0 7 2 7 7zM16 15c0-5 3-7 7-7 0 4-2 7-7 7z" />
    </svg>
  ),
  stalk: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4 27h24M16 27V6" />
      <path d="M16 22c-4.5 0-6.5-2.5-6.5-6 3.5 0 6.5 2 6.5 6zM16 16c0-4.5 2.5-6.5 6-6.5 0 3.5-2 6.5-6 6.5zM16 11c-3 0-4.5-2-4.5-4.5 2.5 0 4.5 1.5 4.5 4.5z" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M3 21V10h15v11M18 14h6l4 4v3h-3M3 21h2M10 21h10" />
      <circle cx="7.5" cy="22" r="2.5" />
      <circle cx="22.5" cy="22" r="2.5" />
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 10c-2-2-8-2-9 4s3 13 6 13c1.5 0 2-1 3-1s1.5 1 3 1c3 0 7-7 6-13s-7-6-9-4z" />
      <path d="M16 10c0-3 1-5 3-6M17 7c2-2 5-2 6 0-2 1.5-4 1.5-6 0z" />
    </svg>
  ),
  barn: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4 14l12-8 12 8M6 13v14h20V13" />
      <path d="M12 27v-8h8v8M12 19l8 8M20 19l-8 8" />
    </svg>
  ),
};

const stages: Stage[] = [
  {
    id: "plan",
    label: "Plan",
    when: "About 4 months out",
    title: "Season planning",
    points: [
      "Set your dates, crew size, jobs and housing with you",
      "Start from last season if you have one",
      "Job order drafted and ready to file",
    ],
    icon: icons.seed,
  },
  {
    id: "file",
    label: "File",
    when: "About 75 days out",
    title: "Job order and DOL application",
    points: [
      "Job order filed with your state and tracked through housing inspection",
      "Department of Labor application filed, with U.S. recruitment documented",
      "A text from us as each approval comes through",
    ],
    icon: icons.sprout,
  },
  {
    id: "petition",
    label: "Petition",
    when: "Once DOL certifies",
    title: "USCIS petition",
    points: [
      "Form I-129 filed for your named or unnamed workers",
      "Returning workers named, so the crew you trained comes back",
    ],
    icon: icons.stalk,
  },
  {
    id: "travel",
    label: "Travel",
    when: "2 to 4 weeks out",
    title: "Consulate and travel",
    optional: true,
    points: [
      "Visa appointments and travel coordinated by us with several partner companies in Mexico",
      "Updates as visas clear and your crew heads your way",
    ],
    icon: icons.truck,
  },
  {
    id: "season",
    label: "Season",
    when: "Arrival through harvest",
    title: "Season compliance",
    points: [
      "A clear compliance packet, sent digitally and always accessible",
      "Organized records and deadline reminders",
      "2-day notice tracking if a worker leaves",
    ],
    icon: icons.apple,
  },
  {
    id: "audit",
    label: "Audit",
    when: "If DOL calls",
    title: "Audit support",
    points: ["Your season file pulled together fast", "Phone support and written responses"],
    icon: icons.barn,
  },
];

export default function SeasonTimeline() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchX = useRef<number | null>(null);
  const stage = stages[active];
  const last = stages.length - 1;

  function go(i: number, focus = false) {
    const next = Math.max(0, Math.min(last, i));
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1, true); }
    if (e.key === "Home") { e.preventDefault(); go(0, true); }
    if (e.key === "End") { e.preventDefault(); go(last, true); }
  }

  function onTouchStart(e: TouchEvent) { touchX.current = e.touches[0].clientX; }
  function onTouchEnd(e: TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
    touchX.current = null;
  }

  return (
    <div className="tl">
      <div className="tl-track" role="tablist" aria-label="Your H-2A season, step by step" onKeyDown={onKey}>
        <div className="tl-furrow" aria-hidden="true">
          <span className="tl-furrow-fill" style={{ width: `${(active / last) * 100}%` }} />
        </div>
        {stages.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => { tabs.current[i] = el; }}
            role="tab"
            id={`tl-tab-${s.id}`}
            aria-selected={i === active}
            aria-controls="tl-panel"
            tabIndex={i === active ? 0 : -1}
            className={`tl-step${i === active ? " is-active" : ""}${i < active ? " is-done" : ""}`}
            onClick={() => go(i)}
          >
            <span className="tl-icon">{s.icon}</span>
            <span className="tl-label">{s.label}</span>
          </button>
        ))}
      </div>

      <div
        className="tl-panel"
        id="tl-panel"
        role="tabpanel"
        aria-labelledby={`tl-tab-${stage.id}`}
        aria-live="polite"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div key={stage.id} className="tl-panel-inner">
          <p className="tl-when">
            <span className="tl-count">Step {active + 1} of {stages.length}</span>
            <span>{stage.when}</span>
            {stage.optional && <span className="tl-tag">Optional</span>}
          </p>
          <h3>{stage.title}</h3>
          <ul className="check-list">
            {stage.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
        <div className="tl-nav">
          <button type="button" className="btn btn-ghost btn-small" onClick={() => go(active - 1)} disabled={active === 0}>
            ← Back
          </button>
          <button type="button" className="btn btn-primary btn-small" onClick={() => go(active === last ? 0 : active + 1)}>
            {active === last ? "Start over" : "Next step →"}
          </button>
        </div>
      </div>

      <p className="tl-note">
        <strong>If anything stalls:</strong> same-day notice, a clear explanation and the next steps.
      </p>
    </div>
  );
}
