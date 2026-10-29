"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export default function LoginForm() {
  const [tried, setTried] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTried(true);
  }

  return (
    <form className="form card login-form" onSubmit={onSubmit}>
      <div className="field full">
        <label htmlFor="login-email">Email</label>
        <input id="login-email" name="email" type="email" required autoComplete="username" maxLength={150} />
      </div>
      <div className="field full">
        <label htmlFor="login-password">Password</label>
        <input id="login-password" name="password" type="password" required autoComplete="current-password" maxLength={200} />
      </div>
      {tried && (
        <div className="form-status err full" role="alert">
          Online login is on the way. For now, call {site.phone} or email {site.email} and we will help right away.
        </div>
      )}
      <div className="full">
        <button className="btn btn-primary" type="submit">Log in</button>
      </div>
      <p className="muted full" style={{ fontSize: "var(--step--1)" }}>
        Forgot your password? Email {site.email}.
      </p>
    </form>
  );
}
