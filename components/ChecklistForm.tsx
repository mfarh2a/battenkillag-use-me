"use client";

import { useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok"; emailed: boolean; url?: string; fileName?: string }
  | { kind: "err"; message: string };

function toBlobUrl(base64: string) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  return URL.createObjectURL(blob);
}

export default function ChecklistForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "sending" });
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
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
      let url: string | undefined;
      if (body.file) {
        url = toBlobUrl(body.file);
        const a = document.createElement("a");
        a.href = url;
        a.download = body.fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      setStatus({ kind: "ok", emailed: Boolean(body.emailed), url, fileName: body.fileName });
    } catch {
      setStatus({ kind: "err", message: "We couldn't send that. Please try again." });
    }
  }

  if (status.kind === "ok") {
    return (
      <div className="form-status ok stack" role="status">
        <p>
          {status.emailed
            ? "Your checklist is downloading, and a copy is on its way to your inbox."
            : "Your checklist is downloading now."}
        </p>
        {status.url && (
          <p>
            Download didn&apos;t start? <a href={status.url} download={status.fileName}>Click here to download it.</a>
          </p>
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
        <label htmlFor="cl-farm">Farm name <span className="optional">(optional)</span></label>
        <input id="cl-farm" name="farm" autoComplete="organization" maxLength={150} />
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="cl-website">Leave this empty</label>
        <input id="cl-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="btn btn-primary" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending..." : "Email me the checklist"}
      </button>
      {status.kind === "err" && <p className="form-status err" role="alert">{status.message}</p>}
      <p className="lead-fine">We&apos;ll email you the checklist and an occasional H-2A tip. No spam, and you can unsubscribe anytime.</p>
    </form>
  );
}
