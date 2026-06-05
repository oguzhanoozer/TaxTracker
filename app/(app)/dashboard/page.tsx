import { AssistantCard } from "@/components/ledger/assistant-card"
import { StatsRow } from "@/components/ledger/dashboard-stats"
import { Card, Pill, PulseStyle } from "@/components/ledger/primitives"
import { formatCurrency } from "@/components/ledger/format"
import { getCurrentUser } from "@/lib/auth"
import config from "@/lib/config"
import { getUnsortedFilesCount } from "@/models/files"
import { getSettings } from "@/models/settings"
import { getDashboardStats } from "@/models/stats"
import { getTransactions, TransactionFilters } from "@/models/transactions"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dashboard",
  description: config.app.description,
}

function dayName() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

function greeting(name: string) {
  const h = new Date().getHours()
  const greet =
    h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"
  const first = name?.split(" ")[0] || "there"
  return `${greet}, ${first}`
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<TransactionFilters>
}) {
  const filters = await searchParams
  const user = await getCurrentUser()

  const settings = await getSettings(user.id)
  const defaultCurrency = (settings.default_currency || "USD").toUpperCase()

  const stats = await getDashboardStats(user.id, filters)
  const unsortedCount = await getUnsortedFilesCount(user.id)
  const { transactions: recent } = await getTransactions(
    user.id,
    { ordering: "-issuedAt" },
    { limit: 6, offset: 0 }
  )

  const safeNum = (v: unknown): number => Number(v ?? 0) || 0
  // Totals in DB are stored as cents — divide by 100. Stats are per-currency Records.
  const sumRecord = (rec: Record<string, number> | undefined): number =>
    rec ? Object.values(rec).reduce((a, b) => a + safeNum(b), 0) : 0

  const incomeCents =
    safeNum(stats.totalIncomePerCurrency?.[defaultCurrency]) ||
    sumRecord(stats.totalIncomePerCurrency)
  const expensesCents =
    safeNum(stats.totalExpensesPerCurrency?.[defaultCurrency]) ||
    sumRecord(stats.totalExpensesPerCurrency)

  const income = incomeCents / 100
  const expenses = expensesCents / 100
  const net = income - Math.abs(expenses)

  const statCards = [
    { label: "Income", value: income, currency: defaultCurrency, delta: "+12%", tone: "green" as const },
    { label: "Expenses", value: -Math.abs(expenses), currency: defaultCurrency, delta: "−4%", tone: "neutral" as const },
    { label: "Net", value: net, currency: defaultCurrency, delta: "+18%", tone: "green" as const },
    { label: "Pending receipts", value: unsortedCount, isCount: true, delta: "needs review", tone: "amber" as const },
  ]

  return (
    <div className="w-full mx-auto p-6 lg:p-10 grid gap-6" style={{ maxWidth: 1180 }}>
      <PulseStyle />

      <header className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
        <div>
          <h1 className="font-serif tracking-tight" style={{ fontSize: 38, lineHeight: 1.05 }}>
            {greeting(user.name || "")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {dayName()} · here&apos;s where you stand this month
          </p>
        </div>
      </header>

      <StatsRow stats={statCards} />

      <AssistantCard />

      <div className="grid lg:grid-cols-[1.55fr_1fr] gap-4">
        <Card pad={0}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-serif" style={{ fontSize: 19 }}>
              Recent activity
            </h3>
            <Link
              href="/transactions"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              All transactions →
            </Link>
          </div>
          <div>
            {recent.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                No transactions yet. Drop a receipt into the inbox to get started.
              </div>
            )}
            {recent.map((t, i) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const tx = t as any
              const rawTotal = safeNum(tx.total ?? tx.amount) / 100
              const amount = tx.type === "expense" ? -Math.abs(rawTotal) : Math.abs(rawTotal)
              return (
                <Link
                  key={tx.id}
                  href={`/transactions/${tx.id}`}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-secondary"
                  style={{
                    borderBottom:
                      i < recent.length - 1 ? "1px solid hsl(var(--border))" : "none",
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[14px] truncate">
                      {tx.merchant || tx.name || "Untitled"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tx.issuedAt
                        ? new Date(tx.issuedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </div>
                  </div>
                  <div
                    className="font-mono-num text-sm font-semibold"
                    style={{
                      color:
                        amount >= 0
                          ? "var(--accent)"
                          : "hsl(var(--foreground))",
                    }}
                  >
                    {formatCurrency(amount, tx.currencyCode || "USD")}
                  </div>
                </Link>
              )
            })}
          </div>
        </Card>

        <Card pad={0}>
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-serif" style={{ fontSize: 19 }}>
              This month
            </h3>
          </div>
          <div className="p-5 grid gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.07em] text-muted-foreground font-bold mb-1">
                Pending review
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="font-serif font-mono-num"
                  style={{ fontSize: 28, lineHeight: 1, fontWeight: 400 }}
                >
                  {unsortedCount}
                </span>
                <Pill tone="amber">in inbox</Pill>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <div className="text-xs uppercase tracking-[0.07em] text-muted-foreground font-bold mb-1">
                Cash flow
              </div>
              <div
                className="font-mono-num"
                style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}
              >
                {formatCurrency(net, defaultCurrency)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Net for{" "}
                {new Date().toLocaleDateString("en-US", { month: "long" })}
              </p>
            </div>
            <Link
              href="/unsorted"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md py-2.5 px-4 text-sm font-semibold"
              style={{
                background: "var(--accent)",
                color: "hsl(45 40% 95%)",
              }}
            >
              Open inbox →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
