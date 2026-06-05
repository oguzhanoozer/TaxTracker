<div align="center">

# Ledger

**An editorial-finance, AI-assisted bookkeeping app for freelancers and indie operators.**

Upload a receipt, an invoice, or a PDF — Ledger extracts vendor, date, total, tax, line items and category, then files it in a calm, paper-and-ink interface designed to feel less like accounting software and more like a notebook.

[![Next.js](https://img.shields.io/badge/Next.js-15-000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-Postgres-2d3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io)
[![License](https://img.shields.io/badge/license-MIT-1F4A3B?style=flat-square)](LICENSE)

</div>

---

## Screens

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/dashboard-paper.png" alt="Dashboard — Paper theme" /></td>
    <td width="50%"><img src="docs/screenshots/dashboard-dark.png" alt="Dashboard — Carbon theme" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Paper</b> — warm cream, ink black, pine accent</sub></td>
    <td align="center"><sub><b>Carbon</b> — same layout, dark mode</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/dashboard-slate.png" alt="Dashboard — Slate theme with palette picker" /></td>
    <td width="50%"><img src="docs/screenshots/transaction-detail.png" alt="Receipt review screen" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Slate</b> — themeable accents (live tweaks panel)</sub></td>
    <td align="center"><sub><b>Review</b> — extracted fields next to the source</sub></td>
  </tr>
  <tr>
    <td colspan="2"><img src="docs/screenshots/settings-llm.png" alt="Multi-provider LLM settings" /></td>
  </tr>
  <tr>
    <td colspan="2" align="center"><sub><b>LLM settings</b> — per-job model selection with provider fallback chain</sub></td>
  </tr>
</table>

---

## What it does

Ledger turns a pile of receipts into a clean, queryable ledger.

Drop any image or PDF into the **Unsorted inbox** and a vision model extracts the vendor, date, total, currency, tax, and line items. A second pass categorises it (Software, Travel, Meals, Hardware…) against your past transactions, so categorisation gets sharper the more you use it. Foreign currency totals are converted automatically using historical rates from the transaction date — crypto included.

From there: filter, group, and search the **Transactions** table; build deterministic exports (CSV/XLSX/PDF) for your accountant; or generate **Invoices** from a template. Everything lives in a single Postgres database you own.

The UI is built around an editorial design system — Newsreader serif headings, Hanken Grotesk body, JetBrains Mono numerals — with three palettes (`paper`, `slate`, `carbon`) and switchable accent colour. No dashboards that look like a 2014 fintech demo.

---

## Highlights

- **Multi-provider LLM** — OpenAI, Anthropic, Google, Mistral, or any OpenAI-compatible endpoint. Per-job model selection (vision vs. categorisation vs. line summarisation) with a fallback chain when a provider is down.
- **Receipt → structured fields** — vision extraction with confidence scores you can verify before approving.
- **Custom fields** — add your own AI-extracted columns with a natural-language prompt.
- **Currency conversion** — automatic, historical, with crypto support.
- **CSV / XLSX import** — column mapping wizard, dedupe by transaction hash.
- **Editorial design system** — three palettes, six accent colours, JetBrains Mono numerals everywhere they matter.
- **Self-hosted by default** — no auth wall, your data sits in your Postgres.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, RSC + Server Actions) |
| Language | TypeScript 5 |
| Styling | Tailwind 4 + CSS variable tokens (HSL) |
| Type fonts | Newsreader, Hanken Grotesk, JetBrains Mono (via `next/font`) |
| Data | PostgreSQL + Prisma |
| AI | OpenAI / Anthropic / Google / Mistral via a provider abstraction |
| Auth | `better-auth` (disabled in self-hosted mode) |

---

## Run locally

```bash
git clone https://github.com/<your-username>/ledger.git
cd ledger
npm install
cp .env.example .env       # set DATABASE_URL + at least one LLM provider key
npx prisma migrate dev
npm run dev
```

Open <http://localhost:7331>.

### Required env vars

```env
DATABASE_URL=postgresql://user:pass@host:5432/ledger
BETTER_AUTH_SECRET=<openssl rand -base64 32>
OPENAI_API_KEY=sk-...      # or GOOGLE_API_KEY / MISTRAL_API_KEY / ANTHROPIC_API_KEY
```

---

## Deploy

A `render.yaml` is included for one-click deploy on [Render](https://render.com). The blueprint provisions a Node web service and runs migrations on first boot. Postgres is hosted externally (Neon recommended for free tier) — paste the connection string into `DATABASE_URL` after the blueprint scan.

> **Note on file storage** — receipt uploads land on the container's local disk (`./uploads/`). On Render's free tier this disk is ephemeral and is wiped on every redeploy. That's intentional for the live demo; for production self-hosting, mount a Render persistent disk or swap the file layer (`lib/files.ts`) for S3 / R2 / Supabase Storage.

---

## Project context

This is a portfolio project — a full redesign of an existing self-hosted accounting app, rebuilt around a coherent design system (`new-design/tokens.css`, `new-design/components.jsx`) and a clean component library (`components/ledger/*`). The original product gave the data model, Prisma schema, and AI extraction pipeline; the rebrand owns everything visual, the navigation, the dashboard, the import/export flows, and the assistant card.

The reference design and source mockups live under [`new-design/`](new-design/).

## License

MIT
