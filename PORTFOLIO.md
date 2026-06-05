# Ledger — AI bookkeeping for builders (portfolio framing)

> Originally forked / extended from the open-source TaxHacker project. The UI has been rebranded as **Ledger** with an editorial palette (forest × honey × ink). The agent layer, multi-LLM routing and OCR pipeline are the AI Engineer skills on display.

**Live:** _add Vercel URL_

---

## What this demonstrates

| AI Engineer skill | Where it shows up |
|---|---|
| **Multi-LLM routing** | `lib/llm.ts` — OpenAI / Mistral / Gemini configurable per task |
| **Document understanding** | `ai/` agents extract vendor, date, line items from receipt photos/PDFs |
| **OCR + Vision** | Sharp + LangChain vision calls on uploaded receipts |
| **Structured outputs** | Zod schemas convert vision output → typed Transaction rows |
| **Prompt engineering** | Per-document prompt templates with currency / category hints |
| **Background jobs** | Receipt scan kicked off async, polled by the UI |
| **Multi-tenant** | better-auth + Prisma roles, project scoping |
| **Self-hosted by default** | Runs against local Postgres + S3-compatible storage |

## Stack

Next.js 16 · React 19 · TypeScript · Prisma + Postgres · better-auth · Tailwind v4 · shadcn/ui · LangChain · Sentry · Stripe · Sharp · PDF.js

## Run locally

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev    # http://localhost:7331
```

## Deploy

- **Vercel:** push to GitHub, import, set the env vars. Use Vercel Postgres or an external Postgres for `DATABASE_URL`.
- **Self-hosted Docker:** see the original project's docs in `docs/` for full instructions.

## Files I changed for this portfolio framing

```
app/
  globals.css                  # Ledger theme tokens (forest × honey × cream)
  landing/landing.tsx          # Rebranded hero, header, footer
vercel.json                    # Deployment config
PORTFOLIO.md                   # ← this file
```

The internal dashboard / settings / forms keep their original shadcn structure — they pick up the new tokens automatically.

---

> Built as part of an AI Engineer portfolio. The original open-source project is excellent; the rebrand here exists to show how a polished AI tool can ship under a unified brand.
