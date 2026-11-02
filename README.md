# BankPrep

A banking exam preparation platform built around topic-wise practice: pick an exam, subject, topic and difficulty, answer questions, read explanations, and track accuracy. It also has timed mock tests, a mistake notebook, bookmarks, analytics, an admin panel and AI-assisted question drafting.

Supported exams: RBI Grade B, RBI Assistant, IBPS PO, IBPS Clerk, IBPS SO IT Officer, SBI PO, SBI Clerk.

Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui, PostgreSQL on Supabase, Prisma 6, Auth.js, Zod, Zustand, Recharts, Framer Motion, Google Gemini.

## Run it

Requires Node 20.9 or later.

```bash
npm install
cp .env.example .env     # then fill it in (see below)

npm run db:deploy        # create the tables
npm run db:seed          # exams, topics, patterns, 346 sample questions, two accounts
npm run dev              # http://localhost:3000
```

Sign in with the `SEED_ADMIN_*` or `SEED_DEMO_*` credentials from `.env`, or register a new learner account.

### Database: Supabase

In your Supabase project open **Connect > ORMs > Prisma** and copy both connection strings into `.env`:

- `DATABASE_URL`: the transaction pooler, port 6543, ending `?pgbouncer=true`. The app uses this.
- `DIRECT_URL`: the session pooler, port 5432. Migrations use this, because they can't run through the transaction pooler.

Use an empty project. `db:deploy` refuses to run on a database that already has other tables, and that is the safe outcome: don't reset a project that holds data you need.

A migration turns on Row Level Security for every table, with no policies. Supabase's REST API therefore can't read them with the public key, while Prisma, which connects as the table owner, is unaffected. New tables need the same treatment; an integration test fails if one is missed.

### Local database for development and tests

`npm run db` runs PostgreSQL from the `embedded-postgres` package on port 5433, with its data in `.pgdata/`. To use it, set both URLs to `postgresql://bankprep:bankprep@localhost:5433/bankprep`. `docker compose up -d` is an alternative.

### Optional: AI question generation

Set `GEMINI_API_KEY` in `.env` (create one at https://aistudio.google.com/apikey). Without it, the AI page explains that generation is off and everything else works normally. `AI_MODEL` selects the model (default `gemini-2.5-flash`). Google limits 2.5 models to accounts that already use them, so if you get a "model not available" error, change `AI_MODEL` to a current model.

## Test it

```bash
npm run typecheck
npm run lint
npm test                 # unit and database integration tests (needs the database running)
npx playwright install chromium   # first time only
npm run build && npm run test:e2e # browser flows against the production build
```

The test suites create their own users and data and remove them afterwards. Run them against the local database, not your live Supabase project: `.env` values give way to variables already set in the shell, so set `DATABASE_URL` and `DIRECT_URL` there first.

## Things worth knowing

**Answers stay on the server until they may be shown.** `services/question-view.ts` splits a question into what is safe before answering (`toClientQuestion`) and the key and explanation (`toReveal`). Practice mode reveals per question after submission; test mode and mock tests reveal only at the end.

**Previous-year questions are never invented.** The seed contains no PYQs, and the page is honestly empty until an admin adds real ones. A PYQ needs a source reference, reaches learners only after an admin verifies it, and loses verification if its source changes. Seed questions are labelled "Illustrative sample" and AI output "AI-generated practice".

**AI output goes through review.** Generated questions are validated with Zod, checked for exact and near duplicates, and stored as `PENDING_REVIEW`. Learners see them only after approval. The API key is read only in `services/ai-generation.ts`, on the server, and is sent in a header.

**Exam patterns are starting points.** Exam bodies revise patterns, so seeded ones are stored unverified, and the UI says so. Check them against the current official notification under Admin → Exam Patterns, then mark them verified. Editing a pattern clears its verification.

**The mock timer is enforced by the server.** The countdown on screen is for display. Every write is checked against the deadline, and a tab closed through a deadline does not gain time: the next section starts at the previous deadline.

**Each mock test can run short.** The starter bank holds 346 questions, which cannot fill every full-length pattern (RBI Grade B asks for 200). A test serves what exists and states the shortfall. Mini mocks at 25% length always fit.

**Common practice mode** is the only way to cross exams. Otherwise practice is filtered through each question's exam relevance and each exam's topic configuration.

**Calendar days use `APP_TIMEZONE`** (default `Asia/Kolkata`) for streaks and daily targets.

## Design system

The UI follows the Stitch export in `stitch_bankprep_exam_platform_ux/` ("Executive FinEd Sovereign"): Oswald for headings, metrics and uppercase labels, Work Sans for body text, Playwrite for one-line editorial accents, a blue-tinted canvas with white cards, Sovereign Blue `#2563eb` for actions and Fiscal Jade `#0d9488` for success. Tokens live in `app/globals.css` (light and dark), with the `eyebrow`, `metric` and `script-accent` utilities, and shared pieces (`Chip`, `Bar`, `RingGauge`, `StatCard`, `Panel`) in `components/app/common.tsx`. The reference screens show invented numbers; the app only ever shows real ones, so panels that would need data it does not have (rankings, peer averages, AI tutor) were left out.

## Layout

```
app/          routes: (auth), (app) for learners, admin
components/   ui (shadcn) and app (shared parts, including the question renderer)
features/     per-feature client components and server actions
services/     business logic and database access, with no UI
validations/  Zod schemas shared by forms, actions and imports
lib/          auth, sessions, dates, scoring, hashing
hooks/        useAction: runs a server action and always surfaces failures
prisma/       schema, migrations, seed, seed-data
tests/ e2e/   Vitest and Playwright
```

## Deployment

1. Set `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `GEMINI_API_KEY`, and `AUTH_TRUST_HOST` or `AUTH_URL`.
2. Run `npm ci`, then `npm run build` (it runs `prisma generate`).
3. Run `npm run db:deploy`. Run `npm run db:seed` once, with strong `SEED_*` passwords.
4. Start with `npm start`, behind HTTPS.

The login throttle in `lib/rate-limit.ts` is in memory and per process. Move it to a shared store if you run more than one instance.

## Bulk import

Admin → Bulk Import takes CSV or JSON. Every row is validated first, and a file with any invalid row imports nothing. The page documents the columns.
