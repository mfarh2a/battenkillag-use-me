// Sends website sign-ups to the Battenkill Ag CRM (a Google Sheet with an Apps Script web app).
// Set CRM_WEBHOOK_URL and CRM_WEBHOOK_SECRET in Vercel. If they are not set, this does nothing.
// Never blocks or breaks the form: errors and slow responses are ignored.

export type CrmSignup = {
  source: "newsletter" | "contact";
  name: string;
  email: string;
  farm?: string;
  phone?: string;
  state?: string;
  workers?: string;
  startMonth?: string;
  current?: string;
  message?: string;
};

export async function sendToCrm(signup: CrmSignup): Promise<void> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...signup, secret: process.env.CRM_WEBHOOK_SECRET || "" }),
      signal: controller.signal,
      redirect: "follow",
    });
  } catch {
    // Ignore: the visitor's request should still succeed.
  } finally {
    clearTimeout(timer);
  }
}
