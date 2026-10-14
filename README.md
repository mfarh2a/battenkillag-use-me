# H-2A Agency Website

Phase 1: the public website. The customer portal comes in later phases.

## Where to change things

| To change | Edit this file |
| --- | --- |
| Company name, phone, email, mailing address, headline | `lib/site.ts` |
| The Why Orra page | `app/why-orra/page.tsx` |
| The guides | `content/articles/` (one file per guide) |
| Privacy policy | `content/privacy.md` |
| Terms of use | `content/terms.md` |

You can edit these right on github.com: open the file, click the pencil icon, change the words, and click "Commit changes". Vercel rebuilds the site in about a minute.

## Contact form email

The form emails you through Resend. Until these are set in Vercel (Project > Settings > Environment Variables), the form tells visitors to call or email instead:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` (where requests go)
- `CONTACT_FROM_EMAIL` (an address on a domain verified in Resend)

## For a developer

Next.js 16 (App Router, TypeScript). `npm install`, then `npm run dev`. No database in phase 1.
