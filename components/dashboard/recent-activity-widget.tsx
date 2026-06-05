import { formatCurrency } from "@/lib/utils"
import { Transaction } from "@/prisma/client"
import { FileText } from "lucide-react"
import Link from "next/link"

export function RecentActivityWidget({ transactions }: { transactions: Transaction[] }) {
  const getBadgeClass = (projectCode: string | null) => {
    if (!projectCode) return "bg-secondary0 text-white"
    const code = projectCode.toLowerCase()
    if (code === "personal") return "bg-blue-500 text-white"
    if (code === "business") return "bg-accent text-white"
    return "bg-amber-500 text-white"
  }

  return (
    <section className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        <Link
          href="/transactions"
          className="text-sm text-accent hover:opacity-80 font-medium transition-colors"
        >
          View All →
        </Link>
      </div>
      <div className="overflow-x-auto">
        {transactions.length > 0 ? (
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium" scope="col">Name</th>
                <th className="px-6 py-3 font-medium" scope="col">Issued At</th>
                <th className="px-6 py-3 font-medium" scope="col">Project</th>
                <th className="px-6 py-3 font-medium" scope="col">Category</th>
                <th className="px-6 py-3 font-medium text-center" scope="col">Files</th>
                <th className="px-6 py-3 font-medium text-right" scope="col">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {transactions.map((tx) => {
                const files = Array.isArray(tx.files) ? tx.files : []
                const issuedDate = tx.issuedAt
                  ? new Date(tx.issuedAt).toISOString().split("T")[0]
                  : "—"
                const categoryName =
                  (tx as Record<string, unknown>).category &&
                  typeof (tx as Record<string, unknown>).category === "object"
                    ? ((tx as Record<string, unknown>).category as { name?: string })?.name || "—"
                    : tx.categoryCode || "—"
                const projectName =
                  (tx as Record<string, unknown>).project &&
                  typeof (tx as Record<string, unknown>).project === "object"
                    ? ((tx as Record<string, unknown>).project as { name?: string })?.name || tx.projectCode || "—"
                    : tx.projectCode || "—"

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium">{tx.name || "Untitled"}</td>
                    <td className="px-6 py-4">{issuedDate}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBadgeClass(tx.projectCode)}`}
                      >
                        {projectName}
                      </span>
                    </td>
                    <td className="px-6 py-4">{categoryName}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>{files.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium">
                        {tx.currencyCode?.toUpperCase()}{" "}
                        {formatCurrency(tx.total || 0, tx.currencyCode || "EUR")}
                      </div>
                      {tx.convertedTotal && tx.convertedCurrencyCode && tx.convertedCurrencyCode !== tx.currencyCode && (
                        <div className="text-xs text-muted-foreground">
                          ({formatCurrency(tx.convertedTotal, tx.convertedCurrencyCode)})
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">No transactions yet</p>
            <p className="text-sm mt-1">Upload documents to get started</p>
          </div>
        )}
      </div>
    </section>
  )
}
