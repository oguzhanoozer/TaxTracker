import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import Link from "next/link"

export function PendingReceiptsCard({ unsortedCount }: { unsortedCount: number }) {
  return (
    <Link href="/unsorted">
      <Card className="rounded-2xl shadow-sm overflow-hidden flex flex-col border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer">
        <div className="bg-[#10b981] text-white p-4 font-medium">
          Pending Receipts
        </div>
        <div className="p-6 flex justify-between items-center grow">
          <div>
            <h3 className="text-4xl font-bold text-foreground">{unsortedCount}</h3>
            <p className="text-sm text-muted-foreground mt-1">Receipts to Review</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Calendar className="w-8 h-8 text-muted-foreground" />
            <span className="px-4 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors shadow-sm text-foreground">
              Review Now
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
