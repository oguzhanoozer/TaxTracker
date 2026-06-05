"use client"

/* ============================================================
   Ledger demo store — pure localStorage. No backend.
   ============================================================ */

const LS_KEY = "ledger.demo.store.v1"

export interface LocalTx {
  id: string
  date: string // YYYY-MM-DD
  vendor: string
  desc?: string
  amount: number // negative = expense, positive = income
  cur: string
  categoryCode?: string
  projectCode?: string
  vat?: number
  status: "approved" | "review"
  files: number
  ai?: boolean
  createdAt: string
}

export interface LocalCategory {
  code: string
  name: string
  color: string
}
export interface LocalProject {
  code: string
  name: string
  color: string
}

export interface LedgerStore {
  txs: LocalTx[]
  categories: LocalCategory[]
  projects: LocalProject[]
}

/* ---- Seed data ---- */
const SEED_CATEGORIES: LocalCategory[] = [
  { code: "income", name: "Client Income", color: "#1F4A3B" },
  { code: "saas", name: "Software & SaaS", color: "#3C5C8A" },
  { code: "meals", name: "Meals & Coffee", color: "#C9783D" },
  { code: "travel", name: "Travel", color: "#BB3B2C" },
  { code: "office", name: "Office & Supplies", color: "#2E7D52" },
  { code: "contractors", name: "Contractors", color: "#1E1B16" },
  { code: "hardware", name: "Hardware", color: "#7B6F9E" },
  { code: "other", name: "Other", color: "#837C6D" },
]

const SEED_PROJECTS: LocalProject[] = [
  { code: "northwind", name: "Northwind Co.", color: "#1F4A3B" },
  { code: "atlas", name: "Atlas Rebrand", color: "#3C5C8A" },
  { code: "internal", name: "Internal / Ops", color: "#837C6D" },
  { code: "personal", name: "Personal", color: "#C9783D" },
]

function isoDateOffset(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

const SEED_TXS: LocalTx[] = [
  {
    id: "tx-1",
    date: isoDateOffset(1),
    vendor: "OpenAI",
    desc: "API usage — May",
    amount: -184.2,
    cur: "USD",
    categoryCode: "saas",
    projectCode: "northwind",
    status: "approved",
    files: 1,
    ai: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-2",
    date: isoDateOffset(1),
    vendor: "Blue Bottle Coffee",
    desc: "Client meeting",
    amount: -18.5,
    cur: "USD",
    categoryCode: "meals",
    projectCode: "northwind",
    vat: 1.48,
    status: "review",
    files: 1,
    ai: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-3",
    date: isoDateOffset(2),
    vendor: "Northwind Co.",
    desc: "Invoice #024 — sprint 3",
    amount: 6400,
    cur: "USD",
    categoryCode: "income",
    projectCode: "northwind",
    status: "approved",
    files: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-4",
    date: isoDateOffset(2),
    vendor: "Vercel",
    desc: "Pro plan",
    amount: -20,
    cur: "USD",
    categoryCode: "saas",
    projectCode: "internal",
    status: "approved",
    files: 1,
    ai: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-5",
    date: isoDateOffset(3),
    vendor: "Deutsche Bahn",
    desc: "Berlin → Munich",
    amount: -129.9,
    cur: "EUR",
    categoryCode: "travel",
    projectCode: "atlas",
    vat: 9.1,
    status: "review",
    files: 1,
    ai: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-6",
    date: isoDateOffset(3),
    vendor: "Figma",
    desc: "Organization seat",
    amount: -45,
    cur: "USD",
    categoryCode: "saas",
    projectCode: "atlas",
    status: "approved",
    files: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-7",
    date: isoDateOffset(4),
    vendor: "WeWork",
    desc: "Hot desk — June",
    amount: -320,
    cur: "EUR",
    categoryCode: "office",
    projectCode: "internal",
    vat: 51.1,
    status: "approved",
    files: 1,
    ai: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-8",
    date: isoDateOffset(6),
    vendor: "Upwork",
    desc: "Illustration — Atlas",
    amount: -540,
    cur: "USD",
    categoryCode: "contractors",
    projectCode: "atlas",
    status: "approved",
    files: 2,
    ai: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-9",
    date: isoDateOffset(7),
    vendor: "Apple",
    desc: "Studio Display",
    amount: -1599,
    cur: "USD",
    categoryCode: "hardware",
    projectCode: "internal",
    status: "approved",
    files: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-10",
    date: isoDateOffset(8),
    vendor: "Atlas Rebrand",
    desc: "Invoice #023 — deposit",
    amount: 3200,
    cur: "EUR",
    categoryCode: "income",
    projectCode: "atlas",
    status: "approved",
    files: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-11",
    date: isoDateOffset(9),
    vendor: "Adobe",
    desc: "Creative Cloud",
    amount: -59.99,
    cur: "USD",
    categoryCode: "saas",
    projectCode: "internal",
    status: "approved",
    files: 1,
    ai: true,
    createdAt: new Date().toISOString(),
  },
]

const SEED: LedgerStore = {
  txs: SEED_TXS,
  categories: SEED_CATEGORIES,
  projects: SEED_PROJECTS,
}

/* ---- I/O ---- */
function read(): LedgerStore {
  if (typeof window === "undefined") return SEED
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(SEED))
      return SEED
    }
    return JSON.parse(raw) as LedgerStore
  } catch {
    return SEED
  }
}

function write(s: LedgerStore) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

/* ---- Public API ---- */
export function getStore(): LedgerStore {
  return read()
}

export function resetStore(): LedgerStore {
  write(SEED)
  return SEED
}

export function listTxs(): LocalTx[] {
  return read().txs.slice().sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function addTx(input: Omit<LocalTx, "id" | "createdAt">): LocalTx {
  const s = read()
  const tx: LocalTx = {
    ...input,
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  }
  s.txs.unshift(tx)
  write(s)
  return tx
}

export function updateTx(id: string, patch: Partial<LocalTx>): LocalTx | null {
  const s = read()
  const idx = s.txs.findIndex((t) => t.id === id)
  if (idx === -1) return null
  s.txs[idx] = { ...s.txs[idx], ...patch }
  write(s)
  return s.txs[idx]
}

export function deleteTx(id: string): void {
  const s = read()
  s.txs = s.txs.filter((t) => t.id !== id)
  write(s)
}

export function listCategories(): LocalCategory[] {
  return read().categories
}

export function listProjects(): LocalProject[] {
  return read().projects
}

/* Stats for dashboard */
export function dashboardStats() {
  const txs = listTxs()
  const now = new Date()
  const thisMonth = now.getMonth()
  const inThisMonth = txs.filter((t) => new Date(t.date).getMonth() === thisMonth)
  const income = inThisMonth.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const expenses = inThisMonth.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const review = txs.filter((t) => t.status === "review").length
  return { income, expenses, net: income - expenses, review }
}
