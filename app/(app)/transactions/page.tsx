import { TransactionsTable, type TableTx } from "@/components/ledger/transactions-table"
import { Button, Icon } from "@/components/ledger/primitives"
import { getCurrentUser } from "@/lib/auth"
import { getCategories } from "@/models/categories"
import { getProjects } from "@/models/projects"
import { getTransactions, TransactionFilters } from "@/models/transactions"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Transactions",
  description: "Manage your transactions",
}

const TRANSACTIONS_PER_PAGE = 500

interface RawTransaction {
  id: string
  merchant?: string | null
  name?: string | null
  description?: string | null
  total?: number | null
  currencyCode?: string | null
  categoryCode?: string | null
  projectCode?: string | null
  issuedAt?: Date | string | null
  createdAt?: Date | string | null
  type?: string | null
  files?: unknown
  text?: string | null
  category?: { code: string; name: string; color?: string | null } | null
  project?: { code: string; name: string; color?: string | null } | null
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<TransactionFilters>
}) {
  const params = (await searchParams) as TransactionFilters & { page?: number }
  const { page } = params
  const user = await getCurrentUser()
  const { transactions } = await getTransactions(user.id, params, {
    limit: TRANSACTIONS_PER_PAGE,
    offset: ((page ?? 1) - 1) * TRANSACTIONS_PER_PAGE,
  })

  const [categories, projects] = await Promise.all([
    getCategories(user.id),
    getProjects(user.id),
  ])

  const tableTxs: TableTx[] = (transactions as unknown as RawTransaction[]).map((t) => {
    const amount = (Number(t.total ?? 0) || 0) / 100
    const isIncome = t.type === "income"
    const signed = isIncome ? Math.abs(amount) : -Math.abs(amount)
    const files = Array.isArray(t.files) ? t.files.length : 0
    return {
      id: t.id,
      date: (t.issuedAt ?? t.createdAt ?? new Date()) as string | Date,
      vendor: t.merchant || t.name || "Untitled",
      desc: t.description ?? undefined,
      amount: signed,
      cur: t.currencyCode || "USD",
      categoryCode: t.categoryCode,
      categoryName: t.category?.name || null,
      categoryColor: t.category?.color || null,
      projectCode: t.projectCode,
      projectName: t.project?.name || null,
      projectColor: t.project?.color || null,
      status: "approved",
      ai: !!t.text,
      files,
    }
  })

  const catOpts = categories.map((c) => ({
    value: c.code,
    label: c.name,
    color: c.color || undefined,
  }))
  const projOpts = projects.map((p) => ({
    value: p.code,
    label: p.name,
    color: p.color || undefined,
  }))

  return (
    <div style={{ padding: "20px 32px 32px", maxWidth: 1320, margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            className="serif"
            style={{ fontSize: 30, lineHeight: 1.05, letterSpacing: "-.02em" }}
          >
            Transactions
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 2 }}>
            Your full ledger
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="focusable"
            title="Search"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: "var(--r-md)",
              border: "1px solid var(--hairline-2)",
              background: "var(--surface)",
              color: "var(--ink-2)",
            }}
          >
            <Icon name="search" size={17} />
          </button>
          <Link href="/unsorted">
            <Button variant="primary" icon="upload">
              Upload
            </Button>
          </Link>
        </div>
      </header>

      <TransactionsTable
        initialTxs={tableTxs}
        categories={catOpts}
        projects={projOpts}
      />
    </div>
  )
}
