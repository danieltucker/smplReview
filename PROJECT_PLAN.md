# smplReview — Project Plan

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Complete

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Database | PostgreSQL + Prisma |
| DB Host (POC) | Supabase |
| Auth | Clerk (multi-tenant orgs built-in) |
| Admin UI | Tailwind + shadcn/ui |
| Embed Widgets | Vanilla JS bundles (Vite) |
| Widget API | Next.js API routes |

---

## Database Schema

| Table | Purpose |
|---|---|
| `organizations` | Businesses using the product |
| `users` | Admin users (managed by Clerk, referenced by ID) |
| `review_sites` | External sites per org (Google, Yelp, etc.) with weight |
| `widget_configs` | Rating floor, style (stars/buttons), behavior flags |
| `embed_tokens` | Public tokens that identify which org's widget loads |
| `submissions` | Internal complaints/feedback (never public) |
| `testimonials` | Submitted testimonials with moderation status |

Multi-tenancy: every table except `users` scoped to `organization_id`.

---

## Phases

---

### Phase 1 — Foundation
- [x] Next.js project setup
- [x] Prisma schema (all tables, multi-tenant from day one)
- [x] Clerk auth + org setup (code complete — needs API keys, see setup steps below)
- [x] Seed script for local dev
- [ ] Supabase project created + DATABASE_URL added to `.env.local`
- [ ] `npm run db:push` — push schema to DB
- [ ] `npm run db:seed` — seed local data
- [ ] Clerk webhook configured in Clerk dashboard (see setup steps below)
- [ ] Deployed POC shell (Vercel or self-hosted)

**Devs:** `/senior-dev` + `/database`

#### Phase 1 Setup Steps
1. Copy `.env.example` → `.env.local` and fill in values
2. Create a [Supabase](https://supabase.com) project → Settings → Database → Connection string (URI, Transaction mode) → paste as `DATABASE_URL`
3. Create a [Clerk](https://clerk.com) app → API Keys → paste `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
4. In Clerk: enable **Organizations** (Configure → Organizations)
5. Run `npm run db:push` to push the schema
6. Run `npm run db:seed` to seed local data
7. Run `npm run dev` — confirm the app loads at `http://localhost:3000`
8. Once publicly accessible (Vercel or ngrok), add a Clerk webhook pointing to `/api/webhooks/clerk` with events: `organization.created`, `organization.updated`, `organization.deleted`, `organizationMembership.created`, `organizationMembership.deleted` → paste signing secret as `CLERK_WEBHOOK_SECRET`

---

### Phase 2 — Admin Dashboard
- [ ] Org settings page
- [ ] Review sites management (add/edit/delete, weight, test URL)
- [ ] Widget configuration (rating floor, stars vs. buttons, colors)
- [ ] Embed code generator (copy-paste `<script>` tag with org token)
- [ ] Submissions inbox (view complaints, mark read)
- [ ] Testimonial moderation queue (approve/reject)

**Devs:** `/ui` for designs first, then `/senior-dev` to implement

---

### Phase 3 — Review Router Widget (Embed 1)
- [ ] Vanilla JS bundle served from `/widget/router.js`
- [ ] Loads config from API using embed token
- [ ] Renders rating UI (stars or good/bad buttons)
- [ ] Happy path → weighted random redirect to configured review site
- [ ] Unhappy path → inline complaint form → POST to submissions API
- [ ] After "Good" rating → testimonial prompt hook (feeds Phase 4)
- [ ] URL param support (`?name=Jane&rating=5`) for email campaign pre-fills

**Dev:** `/senior-dev`

---

### Phase 4 — Testimonial Collection + Moderation
- [ ] Post-happy-rating testimonial prompt ("Would you like to leave us a testimonial?")
- [ ] Fields: name, text, optional star rating
- [ ] POST to testimonials API → status: `pending`
- [ ] Admin moderation queue: approve → `published`, reject → `rejected`
- [ ] Email notification placeholder (wire up in v2)

**Dev:** `/senior-dev`

---

### Phase 5 — Testimonials Display Widget (Embed 2)
- [ ] Vanilla JS bundle served from `/widget/testimonials.js`
- [ ] Fetches approved testimonials for org via public API
- [ ] Renders cards (name, quote, star rating, date)
- [ ] Configurable: max count, layout (grid/list), theme (light/dark)

**Devs:** `/ui` for component design, then `/senior-dev`

---

### Phase 6 — Security Hardening
- [ ] Embed widget CORS policy (token-scoped domains)
- [ ] Rate limiting on submission endpoints (prevent spam)
- [ ] Input sanitization (embeds are XSS-sensitive)
- [ ] CSRF protection
- [ ] Org data isolation audit

**Dev:** `/security-review`

---

## Out of Scope for v1

- Billing / Stripe → v2
- Email notifications → v2 (moderation queue is sufficient for now)
- Team member invites → v2 (Clerk supports it, just needs wiring)
- External platform API pulls (Google reviews API) → v2
- Review site weighting UI → schema supports it, expose in Phase 2 UI

---

## Decisions Log

| Date | Decision | Reason |
|---|---|---|
| 2026-04-21 | Rebuild from scratch | Original was a single static widget with no backend, no admin, incomplete features |
| 2026-04-21 | SaaS product (POC self-hosted) | Multi-tenant from day one; POC runs on Supabase free tier |
| 2026-04-21 | PostgreSQL over NoSQL | Relational data model fits the domain; Prisma makes it portable |
| 2026-04-21 | Testimonials collected in-app, not pulled from platforms | Simpler v1; platform API integration is v2 |
| 2026-04-21 | Moderation required before testimonials go public | Quality control; auto-publish too risky for client-facing widget |
| 2026-04-21 | Embed widgets as vanilla JS (not React) | Framework-agnostic; keeps bundle tiny for client sites |
| 2026-04-21 | Email notifications deferred to v2 | Moderation queue sufficient; reduces scope for POC |
