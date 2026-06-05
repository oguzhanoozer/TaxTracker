# Ledger — Feature Overview

Self-hosted bookkeeping app for freelancers and small teams. Pictures of receipts go in, organized transactions come out. The app does the boring parts: OCR, currency conversion, categorization, invoice generation, and end-of-year exports.

This document walks through the app **screen by screen** — what you see, what it does, and which AI features power it.

---

## 1. Landing page · `/`

The marketing page you see when not logged in.

**What's on screen**
- Hero with editorial serif headline "Let an AI agent do your books."
- Embedded autoplay video showing the receipt-scan flow
- Feature sections (one per capability) — each is a side-by-side image + bullet list:
  - **AI Scanner** — receipts and invoices → structured data
  - **Multi-currency** — auto detects + converts using historical rates
  - **Transactions Table** — custom fields, categories, projects
  - **Invoice Generator** — PDF invoices that match transactions
  - **Open / Self-hosted** — privacy story
- Sticky header with **Log in** CTA
- Footer with privacy, terms, contact links

**Brand**: "Ledger" with the tagline "Bookkeeping for builders." Header is a small wordmark in the editorial serif.

---

## 2. Login / signup · `/enter`

Email-based magic-link authentication via **better-auth**.

**What's on screen**
- Single email input
- "Send me a link" button
- Subtle social proof under the form
- Self-hosted mode: signup disabled, only existing users can enter
- Cloud mode: signup allowed, but new accounts are routed to onboarding

---

## 3. Dashboard · `/dashboard`

Your home screen after login.

**What's on screen**
- **Stat cards** at the top — Income / Expenses / Net / Pending receipts (current month by default)
- **Period switcher** — Day / Week / Month / Year / Custom
- **AI assistant box** — a glassy gradient card that explains pending uploads, suggests categorizations, surfaces unusual transactions
- **Recent transactions** — last 10 rows with quick edit
- **Upcoming reminders** — recurring expenses, tax deadlines
- **Quick actions** — Upload receipt, Create invoice, Add manual transaction

**What it powers**
- A glance at "where am I this month vs last."
- Catches forgotten receipts (the AI tags them as "needs review").

---

## 4. Unsorted inbox · `/unsorted`

The drop zone for raw documents.

**What's on screen**
- Big **dashed upload zone** — drag & drop receipts/invoices, single or bulk
- Or click to pick files; accepts PDF, JPG, PNG, HEIC
- Each upload appears as a card with a thumbnail and a **status pill**:
  - `Queued` (gray) — waiting in line
  - `Reading…` (blue, animated) — LLM is parsing it
  - `Done` (green) — ready, shown extracted vendor + amount
  - `Failed` (red) — bad scan, retry button
- Bulk select + bulk approve to move them to Transactions
- Filter: only show pending, only mine, by date

**What it powers**
- The whole AI Scanner story: drop messy files, get structured rows.

---

## 5. Transactions table · `/transactions`

The core ledger.

**What's on screen**
- **Filter bar** at the top — date range, project, category, currency, status
- **Search box** — across vendor, description, tags
- **Table** with sortable columns:
  - Date · Vendor · Amount · Currency · Category · Project · Tax · Status · Attachments
- **Row actions** — edit, duplicate, delete, attach more files
- **Bulk bar** appears when rows are selected — categorize, tag, export, delete
- **Inline edit** on most cells (click to edit, ESC to cancel)
- Each row links to a detail page with the receipt preview side-by-side with the form
- **Custom columns** — what shows depends on your fields config (Settings → Fields)

**What it powers**
- Day-to-day bookkeeping. Most freelancers live here.

---

## 6. Transaction detail · `/transactions/[id]`

The "edit + verify" screen for a single document.

**What's on screen**
- **Left:** receipt preview (zoomable, multi-page navigation)
- **Right:** form with every field the LLM extracted:
  - Vendor (with autocomplete from previous vendors)
  - Date · Amount · Currency · VAT
  - Category dropdown (with create-new inline)
  - Project dropdown
  - Custom fields (whatever you defined)
  - Notes / tags
- "Re-run AI" button — if extraction was wrong, redo with a different model
- "Approve & next" button — saves and jumps to the next unsorted item (keyboard: J/K to navigate)

**What it powers**
- Manual verification loop. AI does 80% — humans confirm 100%.

---

## 7. Files browser · `/files`

Raw attachment list, independent of transactions.

**What's on screen**
- Thumbnail grid (or list view)
- Filters: file type, attached / orphan, upload date
- Each tile has a preview hover + actions: download, attach to transaction, delete
- Static file serving via `/files/static/[filename]` for shared links
- Preview via `/files/preview/[fileId]` for in-app PDF/image viewer

**What it powers**
- Recovery — if a receipt got separated from its transaction, you find it here.

---

## 8. Import · `/import/csv`

For migrating from another app.

**What's on screen**
- Upload CSV/XLSX
- Column mapper UI — drag your CSV columns onto Ledger's fields
- Preview pane — first 5 rows mapped + flagged issues
- "Import 153 rows" button at the bottom
- Progress bar during import; failed rows downloadable as CSV

**What it powers**
- Onboarding people coming from QuickBooks, Excel, or other tools.

---

## 9. Export · `/export/transactions`

For accountants and tax filing.

**What's on screen**
- Date range picker
- Format toggle: CSV · XLSX · PDF
- Group by: none / category / project / month
- Include: all / only approved / only specific currencies
- Preview total: "Will export 412 transactions ≈ 87 KB"
- Big "Download" button

**What it powers**
- Hand the file to your accountant. They love you.

---

## 10. Apps · `/apps`

Mini-tools that build on the transaction data.

### Invoice generator · `/apps/invoices`

**What's on screen**
- Sidebar with saved invoice templates
- Main canvas — live preview of the PDF as you edit
- Form panel — bill-to, items (with description, qty, price, tax), currency, due date
- "Pre-fill from project" — pulls all unbilled transactions from a chosen project into invoice line items
- "Download PDF" button — generates via `@react-pdf/renderer`
- "Send via email" (when Resend is configured)
- Color/logo customization in Settings → Business

**What it powers**
- Bill clients from the same place your costs live. No more spreadsheet hopping.

---

## 11. Settings

A sidebar layout with eight panels.

| Panel | What you configure |
|---|---|
| **Profile** | Name, email, avatar, locale, timezone |
| **Business** | Company name, address, tax ID, logo, invoice color |
| **Currencies** | Which currencies you use, default, exchange-rate provider |
| **Categories** | Tree of categories with icons + colors (used in dropdowns) |
| **Projects** | Tag for grouping transactions (e.g. "Client A", "Side hustle") |
| **Fields** | Custom columns — add a "Reimbursable?" toggle or "Meeting notes" textarea |
| **LLM** | Pick model per task (OpenAI / Mistral / Google), set fallback |
| **Backups** | Snapshot / restore your data, download as zip |
| **Danger** | Wipe data, delete account |

**LLM panel detail**
- Three rows: "Document parsing", "Categorization suggestions", "Invoice line summarization"
- Each row: provider dropdown + model dropdown + temperature slider + "Test" button
- The test sends a sample receipt and shows the parsed JSON inline

---

## 12. Stripe billing · `/cloud/payment`

Only shown in cloud (multi-tenant) mode.

**What's on screen**
- Plan cards — Free / Pro / Team
- Quota meter — "47 / 100 documents this month"
- Upgrade flow → Stripe Checkout → success page → quotas updated
- Webhook at `/api/stripe/webhook` syncs subscription state

---

## 13. Backups · `/settings/backups`

The self-hosted insurance plan.

**What's on screen**
- "Create backup now" button — produces a zip of DB + uploads
- List of past backups — date, size, download, restore
- Schedule editor (daily / weekly / monthly)
- "Upload backup" button to restore from a downloaded file

---

## Architecture in one paragraph

Next.js 16 app with a `(app)` route group for authenticated pages and `(auth)` for the login flow. **Prisma + Postgres** holds users, transactions, files, categories, custom fields. **better-auth** handles sessions and email magic links. **LangChain** wraps the three LLM providers (OpenAI, Mistral, Google) — you can mix and match per task. **Sharp** processes thumbnails. **`@react-pdf/renderer`** builds invoice PDFs. **Stripe** runs cloud billing via webhooks. Everything is one Docker image you can `docker compose up` for self-hosting, or deploy on Vercel/Render with a managed Postgres.

---

## AI Engineer features at a glance

| Skill on the AI Engineer roadmap | Where it lives in this app |
|---|---|
| **Multimodal — image understanding** | Receipt photo → structured JSON via vision model |
| **Multi-LLM routing** | Settings → LLM panel lets you pick per task; provider abstraction in `lib/llm.ts` |
| **Structured outputs** | Zod schemas validate every LLM response before it touches the DB |
| **Prompt engineering** | Per-task prompts (parsing vs categorization vs summarization) under `ai/prompts/` |
| **Background jobs** | Async receipt processing with progress polling via `/api/progress/[id]` |
| **RAG-lite** | Categorization suggestions use embedding similarity against your past transactions |
| **Tool use** | Currency-conversion and tax-rate APIs invoked as tools during parsing |

---

> Built as the bookkeeping piece of an AI Engineer portfolio. The original open-source project is excellent and this fork keeps full attribution.
