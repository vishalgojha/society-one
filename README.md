# SocietyOne

React + Vite + Tailwind visitor management for residential societies.

## Stack

- React 18
- Vite
- Tailwind + shadcn/ui
- Supabase Auth, Postgres, Storage, Edge Functions
- PWA via `vite-plugin-pwa`

## Environment

Copy `.env.example` to `.env` and set:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_LLM_API_URL=
```

## Supabase

- SQL bootstrap: `supabase/migrations/001_init.sql`
- Edge function stubs:
  - `supabase/functions/verify-visitor`
  - `supabase/functions/extract-visitor-info`
  - `supabase/functions/generate-report`
  - `supabase/functions/notify-visitor`
  - `supabase/functions/list-users`

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Notes

- Client-side visitor export now happens through `src/api/functions.js`.
- The PWA manifest and icons live in `public/`.
- Role checks are implemented in `src/lib/rbac.js` and `src/components/RequireRole.jsx`.
