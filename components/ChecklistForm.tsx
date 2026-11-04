"use client";

import { useState } from "react";
import { getAdSource, trackEvent } from "@/lib/ad-tracking";
import { site } from "@/lib/site";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok"; emailed: boolean; email: string }
  | { kind: "err"; message: string };

type Props = {
  /** Season dates from the planner. Without these, the form offers an optional start date. */
  plan?: { start: string; end: string; state?: string; stateName?: string };
  button?: string;
};

// Nothing downloads from the page. Everything is sent to the inbox, so a working email address is required.
export default function ChecklistForm({ plan, button = "Email me the checklist" }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (plan && !plan.stateName) {
      setStatus({ kind: "err", message: "Please choose your state first." });
      return;
    }
    const form = e.currentTarget;
    setStatus({ kind: "sending" });
    const data = {
      ...Object.fromEntries(new FormData(form).entries()),
      ...(plan ? { start: plan.start, end: plan.end } : {}),
      adSource: getAdSource(),
    };
    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ kind: "err", message: body.error || "Something went wrong. Please try again." });
        return;
      }
      trackEvent("Lead");
      setStatus({ kind: "ok", emailed: Boolean(body.emailed), email: String(new FormData(form).get("email") ?? "") });
    } catch {
      setStatus({ kind: "err", message: "We couldn't send that. Please try again." });
    }
  }

  if (status.kind === "ok") {
    return (
      <div className="form-status ok stack" role="status">
        {status.emailed ? (
          <>
            <p>Check your inbox{status.email ? `, ${status.email}` : ""}. {plan ? "Your season plan, a calendar file with reminders and the audit checklist are" : "Your audit checklist is"} on their way.</p>
            <p>Don&apos;t see it in a few minutes? Look in your spam or promotions folder.</p>
          </>
        ) : (
          <p>Thanks. We couldn&apos;t send the email just now, but we have your details and will send everything over shortly. Need it sooner? Call {site.phone}.</p>
        )}
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="cl-name">Your name</label>
        <input id="cl-name" name="name" required autoComplete="name" maxLength={100} />
      </div>
      <div className="field">
        <label htmlFor="cl-email">Email</label>
        <input id="cl-email" name="email" type="email" required autoComplete="email" maxLength={150} />
      </div>
      <div className="field">
        <label htmlFor="cl-farm">Farm name</label>
        <input id="cl-farm" name="farm" required autoComplete="organization" maxLength={150} />
      </div>
      <div className="field" style={plan ? { gridColumn: "1 / -1" } : undefined}>
        <label htmlFor="cl-phone">Phone</label>
        <input id="cl-phone" name="phone" type="tel" required autoComplete="tel" maxLength={30} />
      </div>
      {plan ? (
        <input type="hidden" name="state" value={plan.stateName ?? ""} />
      ) : (
        <div className="field">
          <label htmlFor="cl-state">State</label>
          <input id="cl-state" name="state" required autoComplete="address-level1" maxLength={40} />
        </div>
      )}
      {!plan && (
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="cl-start">Crew start date <span className="optional">(optional: we&apos;ll fill your dates into the workbook)</span></label>
          <input id="cl-start" name="start" type="date" />
        </div>
      )}
      <div className="hp" aria-hidden="true">
        <label htmlFor="cl-website">Leave this empty</label>
        <input id="cl-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="btn btn-primary" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending..." : button}
      </button>
      {status.kind === "err" && <p className="form-status err" role="alert">{status.message}</p>}
      <p className="lead-fine">We&apos;ll email you what you asked for and an occasional H-2A tip. No spam, and you can unsubscribe anytime.</p>
    </form>
  );
}
