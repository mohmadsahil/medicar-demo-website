# MediCare Plus Hospital â€” DPDP Act 2023 Consent Manager Demo

A production-ready Next.js 14 hospital website showcasing DPDP Act 2023 (India) compliant consent management.

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Database**: MongoDB with Mongoose
- **Auth**: Custom JWT (HS256) + OTP (email SMTP / static 123456 for phone)
- **Email**: Nodemailer + custom HTML templates
- **Styling**: Tailwind CSS
- **Icons**: lucide-react

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required variables:
```
MONGODB_URI=mongodb+srv://...
JWT_ACCESS_SECRET=your-secret-min-32-chars
JWT_REFRESH_SECRET=your-other-secret
STATIC_PHONE_OTP=123456
WEBHOOK_NOTICE_SECRET=your-webhook-secret
NEXT_PUBLIC_DEMO_MODE=true
```

SMTP (optional â€” emails log to console if not set):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=app-password
SMTP_FROM="MediCare Plus <no-reply@medicare.example>"
ADMIN_EMAIL=admin@example.com
```

### 3. Seed the Database

```bash
npx tsx scripts/seed.ts
```

This creates:
- 6 departments, 6 doctors
- 5 DPDP-compliant consent purposes
- Demo user: `demo@medicare.example` (referenceId: `DEMO-REF-001`)
- Admin user: `admin@medicare.example`

### 4. Run Dev Server

```bash
npm run dev
```

Visit http://localhost:3000

## Demo Script

### Full Demo Flow:

1. **Visit** http://localhost:3000 â€” see hospital homepage
2. **Sign up** at `/auth/login` with your email â€” receive OTP
3. **Complete profile** â€” grant DPDP consents (granular, purpose-specific)
4. **Book appointment** at `/appointments/book` â€” receive confirmation email
5. **Manage consents** at `/consent/dashboard` â€” withdraw/grant per-purpose
6. **Trigger webhook** â€” see below
7. **Check admin panel** at `/admin/webhook-events` â€” see event + replay

### Phone OTP (Demo Mode)

When `NEXT_PUBLIC_DEMO_MODE=true`, phone OTP is always `123456`.

---

## Testing the Webhook

### Prerequisites
Set `WEBHOOK_NOTICE_SECRET` in `.env.local`. The signature header must match exactly.

### consent.granted Event

```bash
curl -X POST http://localhost:3000/api/consent/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-event: consent.granted" \
  -H "x-webhook-signature: YOUR_WEBHOOK_NOTICE_SECRET" \
  -d '{
    "id": "evt-001",
    "data": {
      "referenceId": "demo@medicare.example",
      "consentId": "CR-AABB1122",
      "purpose": { "name": "Medical Treatment" }
    },
    "occurredAt": "2026-01-15T10:30:00Z"
  }'
```

### consent.withdrawn Event

```bash
curl -X POST http://localhost:3000/api/consent/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-event: consent.withdrawn" \
  -H "x-webhook-signature: YOUR_WEBHOOK_NOTICE_SECRET" \
  -d '{
    "id": "evt-002",
    "data": {
      "referenceId": "demo@medicare.example",
      "consentId": "CR-AABB1122",
      "purpose": { "name": "Marketing" }
    },
    "occurredAt": "2026-01-15T11:00:00Z"
  }'
```

### consent.expiry.reminder Event

```bash
curl -X POST http://localhost:3000/api/consent/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-event: consent.expiry.reminder" \
  -H "x-webhook-signature: YOUR_WEBHOOK_NOTICE_SECRET" \
  -d '{
    "id": "evt-003",
    "data": {
      "referenceId": "demo@medicare.example",
      "consentId": "CR-AABB1122",
      "purpose": { "name": "Health Communications" }
    },
    "occurredAt": "2026-01-15T12:00:00Z"
  }'
```

### notice.accepted Event

```bash
curl -X POST http://localhost:3000/api/consent/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-event: notice.accepted" \
  -H "x-webhook-signature: YOUR_WEBHOOK_NOTICE_SECRET" \
  -d '{
    "id": "evt-004",
    "data": {
      "referenceId": "demo@medicare.example",
      "transactionId": "TXN-2026-001",
      "tenantPrincipalId": "TP-001"
    },
    "accessUrl": "https://consent.example.com/notice/abc",
    "accessToken": "tok_demo_abc123",
    "occurredAt": "2026-01-15T09:00:00Z"
  }'
```

### notice.rejected Event

```bash
curl -X POST http://localhost:3000/api/consent/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-event: notice.rejected" \
  -H "x-webhook-signature: YOUR_WEBHOOK_NOTICE_SECRET" \
  -d '{
    "id": "evt-005",
    "data": {
      "referenceId": "demo@medicare.example",
      "transactionId": "TXN-2026-002",
      "tenantPrincipalId": "TP-001"
    },
    "accessUrl": "https://consent.example.com/notice/def",
    "accessToken": "tok_demo_def456",
    "occurredAt": "2026-01-15T09:30:00Z"
  }'
```

---

## DPDP Act 2023 Compliance Mapping

| Requirement | Implementation |
|-------------|----------------|
| Section 5 â€” Notice | Consent notice shown at signup + cookie banner |
| Section 6 â€” Consent | Granular per-purpose consent with receipt ID |
| Section 6(4) â€” Withdrawal | One-click withdrawal on consent dashboard |
| Section 7 â€” Retention | Retention period specified per consent purpose |
| Section 8(6) â€” Accountability | All webhook events stored in audit log |
| Section 11 â€” Access right | DPR API route + patient portal |
| Section 13 â€” Grievance | Grievance portal at /grievance |
| ISO/IEC 29184 | Consent receipt ID generated per grant |

## API Reference

### Auth
- `POST /api/auth/request-otp` â€” Send OTP to email/phone
- `POST /api/auth/verify-otp` â€” Verify OTP, get JWT
- `POST /api/auth/complete-profile` â€” Complete profile + grant consents
- `POST /api/auth/refresh` â€” Rotate refresh token
- `POST /api/auth/logout` â€” Revoke refresh token
- `GET /api/auth/me` â€” Get current user

### Consent
- `GET /api/consent/purposes` â€” List all consent purposes
- `POST /api/consent/grant` â€” Grant consent for a purpose
- `POST /api/consent/withdraw` â€” Withdraw consent (Section 6(4))
- `GET /api/consent/my-consents` â€” Get user's consent status
- `GET /api/consent/history` â€” Audit trail
- `POST /api/consent/webhook` â€” Webhook handler

### Hospital
- `GET /api/doctors` â€” List all doctors
- `GET /api/departments` â€” List all departments
- `GET /api/slots?doctorId=&date=` â€” Available slots
- `POST /api/appointments` â€” Book appointment (auth required)
- `GET /api/appointments/mine` â€” User's appointments
