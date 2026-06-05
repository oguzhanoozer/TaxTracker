import { formatCurrency } from "@/lib/utils"
import { ProjectStats } from "@/models/stats"
import { Project } from "@/prisma/client"
import Link from "next/link"

export function ProjectsWidget({
  projects,
  statsPerProject,
}: {
  projects: Project[]
  statsPerProject: Record<string, ProjectStats>
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">Project Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => {
          const projectStats = statsPerProject[project.code]
          const incomeEntries = Object.entries(projectStats?.totalIncomePerCurrency || {})
          const expenseEntries = Object.entries(projectStats?.totalExpensesPerCurrency || {})
          const profitEntries = Object.entries(projectStats?.profitPerCurrency || {})

          return (
            <Link key={project.code} href={`/transactions?projectCode=${project.code}`}>
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col gap-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer">
                <span
                  className="text-white text-xs font-semibold px-2 py-1 rounded w-max"
                  style={{ backgroundColor: project.color || "#1e293b" }}
                >
                  {project.name}
                </span>
                <div className="text-3xl font-bold text-foreground">
                  {profitEntries.length > 0
                    ? profitEntries.map(([currency, total]) => (
                        <span key={currency}>{formatCurrency(total, currency)}</span>
                      ))
                    : "$0.00"}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-secondary rounded-lg p-2 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Income</div>
                    <div className="text-sm font-semibold text-accent">
                      {incomeEntries.length > 0
                        ? incomeEntries.map(([currency, total]) => (
                            <div key={currency}>{formatCurrency(total, currency)}</div>
                          ))
                        : "$0.00"}
                    </div>
                  </div>
                  <div className="bg-secondary rounded-lg p-2 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Expenses</div>
                    <div className="text-sm font-semibold text-destructive">
                      {expenseEntries.length > 0
                        ? expenseEntries.map(([currency, total]) => (
                            <div key={currency}>{formatCurrency(total, currency)}</div>
                          ))
                        : "$0.00"}
                    </div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-2 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Profit</div>
                    <div className="text-sm font-semibold text-foreground">
                      {profitEntries.length > 0
                        ? profitEntries.map(([currency, total]) => (
                            <div key={currency}>{formatCurrency(total, currency)}</div>
                          ))
                        : "0.00"}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
