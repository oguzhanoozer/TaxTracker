import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { DashboardStats } from "@/models/stats"
import { ArrowUp, TrendingUp } from "lucide-react"
import Link from "next/link"

export function TaxSavingsCard({ stats }: { stats: DashboardStats }) {
  // Calculate potential savings (profit as savings potential)
  const totalProfit = Object.entries(stats.profitPerCurrency)
  const mainCurrency = totalProfit.length > 0 ? totalProfit[0][0] : "EUR"
  const mainAmount = totalProfit.length > 0 ? totalProfit[0][1] : 0

  return (
    <Link href="/transactions">
      <Card className="rounded-2xl shadow-sm overflow-hidden flex flex-col border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer">
        <div className="bg-[#1e40af] text-white p-4 font-medium">
          Tax Savings
        </div>
        <div className="p-6 flex justify-between items-end grow">
          <div>
            <h3 className="text-4xl font-bold text-foreground">
              {formatCurrency(Math.abs(mainAmount), mainCurrency)}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Potential Savings This Year</p>
          </div>
          <div className="text-accent flex flex-col items-end">
            <ArrowUp className="w-6 h-6 mb-2" />
            <svg className="w-16 h-8" fill="none" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 28L14 18L26 24L42 8L50 16L62 4" stroke="#10b981" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d="M2 28L14 18L26 24L42 8L50 16L62 4L62 32H2V28Z" fill="url(#savingsGradient)" opacity="0.2" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="savingsGradient" x1="32" x2="32" y1="4" y2="32">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </Card>
    </Link>
  )
}
