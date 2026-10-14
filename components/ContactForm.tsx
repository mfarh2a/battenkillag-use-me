"use client";

import { useState } from "react";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok" } | { kind: "err"; message: string };

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December", "Not sure yet",
];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "sending" });
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ kind: "ok" });
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus({ kind: "err", message: body.error || "Something went wrong. Please call or email us instead." });
      }
    } catch {
      setStatus({ kind: "err", message: "We couldn't send that. Please call or email us instead." });
    }
  }

  if (status.kind === "ok") {
    return (
      <div className="form-status ok" role="status">
        Thanks. Your request is in, and we will be in touch within one business day.
      </div>
    );
  }

  return (
    <form className="form card" onSubmit={onSubmit} noValidate={false}>
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" required autoComplete="name" maxLength={100} />
      </div>
      <div className="field">
        <label htmlFor="farm">Farm name</label>
        <input id="farm" name="farm" required autoComplete="organization" maxLength={150} />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" maxLength={150} />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} />
      </div>
      <div className="field">
        <label htmlFor="state">State</label>
        <input id="state" name="state" required maxLength={40} />
      </div>
      <div className="field">
        <label htmlFor="workers">Workers needed</label>
        <input id="workers" name="workers" inputMode="numeric" maxLength={10} />
      </div>
      <div className="field">
        <label htmlFor="startMonth">When do you need them?</label>
        <select id="startMonth" name="startMonth" defaultValue="">
          <option value="" disabled>Pick a month</option>
          {months.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="current">Do you use H-2A today?</label>
        <select id="current" name="current" defaultValue="">
          <option value="" disabled>Choose one</option>
          <option>Yes, with an agency</option>
          <option>Yes, we file ourselves</option>
          <option>No, this would be our first season</option>
        </select>
      </div>
      <div className="field full">
        <label htmlFor="message">What do you grow, and anything else we should know?</label>
        <textarea id="message" name="message" maxLength={3000} />
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {status.kind === "err" && <div className="form-status err full" role="alert">{status.message}</div>}
      <div className="full">
        <button className="btn btn-primary" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending..." : "Send my request"}
        </button>
      </div>
    </form>
  );
}
