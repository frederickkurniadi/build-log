# Build Log

A public, read-only log of personal projects. Only you can sign in and add new entries.

**Stack:** Next.js 15 (App Router) · Supabase (DB / Auth / Storage) · Tailwind · Vercel

## Setup

### 1. Install

```bash
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste and run [`supabase/schema.sql`](supabase/schema.sql).
3. **Storage** → create a public bucket named `thumbnails` (the SQL adds the read/write policies for it).
4. **Authentication → Providers** → enable **Email** (magic link is on by default).
5. **Authentication → Settings** → turn **off** "Allow new users to sign up".
6. **Authentication → Users** → invite yourself by email. Only invited users can sign in.

### 3. Environment

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from **Project Settings → API**.

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000. Click **Sign in** to get a magic link.

### 5. Deploy

Push to GitHub, import into Vercel, add the two env vars. Then in Supabase **Authentication → URL Configuration** set:

- **Site URL** → your Vercel domain
- **Redirect URLs** → `https://your-domain.vercel.app/auth/callback`

## How it works

- **Public read, owner write** is enforced by Supabase Row-Level Security on the `builds` table — even direct API calls can't write without a valid session matching `owner_id`.
- The home page is a server component reading directly from Supabase with the anon key (RLS-filtered).
- The admin page is gated by a session check + server actions for create/update/delete.

## Files

- [`app/page.tsx`](app/page.tsx) — public grid
- [`app/admin/page.tsx`](app/admin/page.tsx) — admin grid with form / edit / delete
- [`app/admin/actions.ts`](app/admin/actions.ts) — server actions (insert / update / delete + storage upload)
- [`app/login/page.tsx`](app/login/page.tsx) — magic-link form
- [`app/auth/callback/route.ts`](app/auth/callback/route.ts) — OAuth callback
- [`lib/supabase/`](lib/supabase) — client / server / middleware helpers
- [`components/`](components) — UI primitives + `BuildCard`, `BuildForm`
- [`supabase/schema.sql`](supabase/schema.sql) — DB schema + RLS policies
