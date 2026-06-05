"use client"

import { Card, Pill, formatCurrency } from "./primitives"

interface StatInput {
  label: string
  value: number
  currency?: string
  delta?: string
  tone?: "green" | "amber" | "red" | "neutral"
  isCount?: boolean
}

export function StatsRow({ stats }: { stats: StatInput[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {stats.map((s) => (
        <Card key={s.label} pad={18}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11.5px] font-bold uppercase tracking-[0.07em] text-muted-foreground">
              {s.label}
            </span>
            {s.delta && <Pill tone={s.tone ?? "neutral"}>{s.delta}</Pill>}
          </div>
          {s.isCount ? (
            <div
              className="font-serif font-mono-num"
              style={{
                fontSize: 36,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
          ) : (
            <div
              className="font-mono-num"
              style={{
                fontSize: 27,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color:
                  s.value >= 0
                    ? "hsl(var(--ledger-pine))"
                    : "hsl(var(--foreground))",
              }}
            >
              {formatCurrency(s.value, s.currency ?? "USD")}
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
