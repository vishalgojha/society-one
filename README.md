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
- The local AI bridge lives in `server/index.mjs`.
- Default task routing uses local Ollama models:
  - `qwen3:8b`: security checks, reports, default reasoning
  - `llava-phi3:latest`: ID image OCR / vision
  - `qwen2.5:3b`: structured extraction and classification
  - `qwen2.5:0.5b`: short notifications
  - `llama3.2:1b`: lightweight quick tasks / fallback
- WhatsApp transport now uses Baileys in the same local bridge process:
  - pairing + session status endpoints
  - QR surfaced in Settings
  - test message/send endpoint for resident or operator alerts
