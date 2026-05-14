# MANZILCHASER EdTech Platform

Full-stack screening assignment for a modern EdTech platform with public discovery, OTP authentication, student LMS, admin CRM, and Razorpay-ready payments.

## Stack

- Web: Next.js App Router, TypeScript, Tailwind CSS
- API: Node.js, Express, TypeScript, Prisma
- Database: PostgreSQL
- Payments: Razorpay test mode with mock fallback when keys are absent

## Monorepo layout

```text
apps/web      Next.js frontend
apps/api      Express REST API
packages/shared Shared Zod schemas and constants
```

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Start PostgreSQL:

```bash
npm run db:up
```

3. Copy environment files:

```bash
copy .env.example apps\api\.env
copy .env.example apps\web\.env.local
```

4. Run migrations and seed:

```bash
npm run db:migrate
npm run db:seed
```

5. Start both apps:

```bash
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:4000

## Demo accounts

- Student: `ankit@demo.com` / `student123` or mobile `9876543210` with OTP
- Admin: `admin@demo.com` / `admin123`

In development, OTP responses include `devOtp` for quick login testing.

## Architecture

The frontend consumes versioned REST endpoints from the Express API. Public catalog and lead capture routes are open. Student and admin areas require JWT cookies issued after password or OTP login. Course discovery, enrollments, lesson progress, quiz attempts, lead status updates, and payment verification all persist in PostgreSQL through Prisma.

## Key journeys

- Browse homepage, mega menu, and course filters
- Submit Talk to Expert / Enroll leads into admin CRM
- Login with password or OTP
- Continue enrolled course, mark lesson progress, submit quiz
- Review attendance, assignments, wallet, and dashboard stats
- Manage leads, students, courses, and payments in admin
- Complete Razorpay test checkout or mock checkout without keys

## Deployment notes

- Deploy `apps/web` to Vercel with `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- Deploy `apps/api` to Railway or Render with `DATABASE_URL`, `JWT_SECRET`, `WEB_ORIGIN`, and Razorpay secrets
- Run `prisma migrate deploy` and `npm run db:seed` once on the hosted database

## Submission package

- GitHub repository link
- Live demo links for web and API
- README architecture summary
- Optional screenshots or Loom walkthrough
