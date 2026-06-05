import { FiltersWidget } from "@/components/dashboard/filters-widget"
import { IncomeExpenseGraph } from "@/components/dashboard/income-expense-graph"
import { PendingReceiptsCard } from "@/components/dashboard/pending-receipts-card"
import { ProjectsWidget } from "@/components/dashboard/projects-widget"
import { RecentActivityWidget } from "@/components/dashboard/recent-activity-widget"
import { TaxSavingsCard } from "@/components/dashboard/tax-savings-card"
import { getCurrentUser } from "@/lib/auth"
import { getProjects } from "@/models/projects"
import { getSettings } from "@/models/settings"
import { getDashboardStats, getDetailedTimeSeriesStats, getProjectStats } from "@/models/stats"
import { getTransactions, TransactionFilters } from "@/models/transactions"
import { getUnsortedFilesCount } from "@/models/files"

export async function StatsWidget({ filters }: { filters: TransactionFilters }) {
  const user = await getCurrentUser()
  const projects = await getProjects(user.id)
  const settings = await getSettings(user.id)
  const defaultCurrency = settings.default_currency || "EUR"

  const stats = await getDashboardStats(user.id, filters)
  const statsTimeSeries = await getDetailedTimeSeriesStats(user.id, filters, defaultCurrency)
  const unsortedCount = await getUnsortedFilesCount(user.id)

  const statsPerProject = Object.fromEntries(
    await Promise.all(
      projects.map((project) => getProjectStats(user.id, project.code, filters).then((stats) => [project.code, stats]))
    )
  )

  // Get recent transactions (last 5)
  const { transactions: recentTransactions } = await getTransactions(
    user.id,
    { ordering: "-issuedAt" },
    { limit: 5, offset: 0 }
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Tax Savings & Pending Receipts Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaxSavingsCard stats={stats} />
        <PendingReceiptsCard unsortedCount={unsortedCount} />
      </section>

      {/* Income/Expense Graph */}
      {statsTimeSeries.length > 0 && (
        <section className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Income & Expenses</h2>
            <FiltersWidget defaultFilters={filters} defaultRange="last-12-months" />
          </div>
          <IncomeExpenseGraph data={statsTimeSeries} defaultCurrency={defaultCurrency} />
        </section>
      )}

      {/* Project Overview */}
      <ProjectsWidget projects={projects} statsPerProject={statsPerProject} />

      {/* Recent Activity */}
      <RecentActivityWidget transactions={recentTransactions} />
    </div>
  )
}
