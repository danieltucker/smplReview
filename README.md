# smplReview

A SaaS review management tool for small businesses. Configure your review sites once, embed a widget on your site, and let smplReview route happy customers to your Google Business, Yelp, or any other review platform — while capturing complaints privately so you can respond before they go public.

Approved testimonials from happy customers can be displayed on your site via a second embed widget.

---

## How It Works

1. A customer lands on your thank-you page or receives an email with a rating link
2. They rate their experience via the embedded widget
3. **Happy customers** (at or above your configured floor) are redirected to one of your review sites — weighted so the most important ones get priority
4. **Unhappy customers** are shown a private feedback form — their complaint goes to your inbox, not the internet
5. Happy customers are also offered the option to leave a testimonial for your website
6. You review and approve testimonials in the dashboard; approved ones appear in the display widget

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | PostgreSQL + Prisma |
| DB Host (POC) | Supabase |
| Auth | Clerk (multi-tenant orgs) |
| Admin UI | Tailwind CSS + shadcn/ui |
| Embed Widgets | Vanilla JS (Vite) — Phase 3/5 |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Sign-in / sign-up (Clerk)
│   ├── dashboard/       # Admin dashboard (Phase 2+)
│   ├── api/
│   │   └── webhooks/clerk/  # Syncs Clerk orgs → database
│   ├── layout.tsx
│   └── page.tsx         # Redirects to /dashboard or /sign-in
├── lib/
│   ├── prisma.ts        # Prisma client singleton
│   ├── auth.ts          # getOrganization / requireOrganization helpers
│   └── utils.ts         # cn() utility for shadcn/ui
└── middleware.ts         # Route protection via Clerk
prisma/
├── schema.prisma         # Full multi-tenant schema
└── seed.ts              # Local dev seed data
widgets/                 # Phase 3/5: Vite-built embed bundles
```

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local`:

- **DATABASE_URL** — Supabase project → Settings → Database → Connection string (URI, Transaction mode)
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY / CLERK_SECRET_KEY** — [Clerk dashboard](https://clerk.com) → API Keys
- **CLERK_WEBHOOK_SECRET** — set up after step 5 below

### 3. Enable Organizations in Clerk

Clerk Dashboard → Configure → Organizations → enable.

### 4. Push schema and seed

```bash
npm run db:push    # push schema to your database
npm run db:seed    # load local dev data
```

### 5. Run the app

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### 6. Configure the Clerk webhook

Once you have a public URL (Vercel or ngrok), add a webhook in the Clerk dashboard pointing to:

```
https://your-domain.com/api/webhooks/clerk
```

Required events:
- `organization.created`
- `organization.updated`
- `organization.deleted`
- `organizationMembership.created`
- `organizationMembership.deleted`

Paste the signing secret into `.env.local` as `CLERK_WEBHOOK_SECRET`.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database with local dev data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Regenerate the Prisma client |

---

## Roadmap

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for the full phase breakdown and current status.
