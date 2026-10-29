"use client";

import { useState } from "react";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok" } | { kind: "err"; message: string };

const roles = [
  "Ag lender", "Crop consultant / agronomist", "Accountant / bookkeeper", "Insurance agent",
  "Equipment or input dealer", "Association, co-op or extension", "Other",
];

export default function PartnerForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "sending" });
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ kind: "ok" });
        form.reset();
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
        Thanks for reaching out. We will be in touch within one business day.
      </div>
    );
  }

  return (
    <form className="form card" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="p-name">Your name</label>
        <input id="p-name" name="name" required autoComplete="name" maxLength={100} />
      </div>
      <div className="field">
        <label htmlFor="p-company">Company</label>
        <input id="p-company" name="company" required autoComplete="organization" maxLength={150} />
      </div>
      <div className="field">
        <label htmlFor="p-email">Email</label>
        <input id="p-email" name="email" type="email" required autoComplete="email" maxLength={150} />
      </div>
      <div className="field">
        <label htmlFor="p-phone">Phone</label>
        <input id="p-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} />
      </div>
      <div className="field">
        <label htmlFor="p-role">What do you do?</label>
        <select id="p-role" name="role" defaultValue="" required>
          <option value="" disabled>Choose one</option>
          {roles.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="p-state">State(s) you work in</label>
        <input id="p-state" name="state" required maxLength={80} />
      </div>
      <div className="field full">
        <label htmlFor="p-message">Tell us about the growers you work with</label>
        <textarea id="p-message" name="message" maxLength={3000} />
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="p-website">Leave this empty</label>
        <input id="p-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {status.kind === "err" && <div className="form-status err full" role="alert">{status.message}</div>}
      <div className="full">
        <button className="btn btn-primary" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending..." : "Become a partner"}
        </button>
      </div>
    </form>
  );
}
