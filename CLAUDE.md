# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server on port 5173 (webpack mode)
npm run build    # production build
npm run lint     # ESLint via next lint
npm start        # production server
```

No test suite configured.

## Architecture

Next.js 15 App Router project. All routes under `app/`. TypeScript + Tailwind.

### Auth layers

Two separate auth systems, both JWT via httpOnly cookies:

1. **User auth** — `lib/auth.ts` signs/verifies tokens stored in `auth_token` cookie. `AuthContext` (client-side) holds user state, calls `/api/auth/*`. Registration requires a `consentId` from the Digital Anumati widget.

2. **Admin auth** — flat credential check (`ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars) stored in `admin_token` cookie. Admin routes under `/api/admin/*`.

### Database

MongoDB via Mongoose (`lib/mongodb.ts`). Single cached connection using `global._mongooseCache` for Next.js hot-reload safety. Models: `User`, `Contact`, `Application`, `HospitalConsentSubmission`.

Every model has consent flag fields (`consentGranted`, `consentRevoked`, `consentErased`, `consentAutoExpired`, `consentExtended`, `consentUpdated`) and a `referenceId` that links across models.

### Consent integration (Digital Anumati)

External CMP at `DIGITAL_ANUMATI_URL`. Flow:

1. Frontend embeds `widget.iife.js` (loaded in `app/layout.tsx`) — widget handles consent UI and issues a `consentId`.
2. On appointment booking, `verifyDigitalAnumatiConsent` (`lib/digitalAnumati.ts`) calls the external API with `consentId` + `referenceId` + `email` to map the consent record. Returns `revokeUrl`, `userId`, `consentRecordId`.
3. Webhook endpoints (`/api/consent/*`) receive lifecycle events (grant, revoke, erase, auto-expired, extension, update) and call `applyConsentFlag` (`lib/consentWebhook.ts`) which updates matching records across all three user-facing models by `referenceId`.
4. After mapping, a revoke-link email is sent via Nodemailer (`lib/email.ts`).

`window.__CMP_CONFIG = { referenceId }` is set client-side when a logged-in user's `referenceId` is available (see `AuthContext`).

### Key env vars

| Var | Purpose |
|-----|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Shared secret for both user and admin tokens |
| `DIGITAL_ANUMATI_URL` | Base URL of consent management API |
| `DIGITAL_ANUMATI_API_KEY` | Server key for `x-server-key` header |
| `SMTP_*` | Nodemailer config for revoke emails |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin portal credentials |

### Route map

```
/                          → homepage (consent highlights + dept cards)
/book-demo-appointment     → appointment booking form (AppointmentBookingPage component)
/consent-demo              → standalone consent demo page
/login                     → login + register (tabs)
/profile                   → authenticated user profile
/admin                     → admin dashboard (protected by admin_token)
/contact                   → contact form

/api/auth/*                → login, register, logout, me
/api/admin/*               → admin login, logout, data
/api/demo-consent/*        → appointment submit, records list, template info
/api/consent/*             → webhook receivers for CMP lifecycle events
/api/contact               → contact form submission
/api/careers               → careers form submission
```

### CI/CD

Azure Pipelines (`azure-pipelines.yml`) triggers on `main`. Runs `npm install && npm run build`, then publishes full artifact as `drop`. `MONGODB_URI` injected from pipeline variable group.
