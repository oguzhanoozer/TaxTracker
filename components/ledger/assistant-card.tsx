"use client"

import { Bell, Check, Inbox, Sparkles, Wand2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Pill } from "./primitives"

interface AssistantItem {
  id: string
  kind: "flag" | "review" | "auto"
  text: string
  cta: string
  href?: string
}

const DEFAULT_ITEMS: AssistantItem[] = [
  {
    id: "i1",
    kind: "review",
    text: "4 receipts in your inbox are ready to be filed — vendor, date and amounts extracted.",
    cta: "Review",
    href: "/unsorted",
  },
  {
    id: "i2",
    kind: "flag",
    text: "Your AWS bill went up €120 this month vs last. Worth a look.",
    cta: "Show me",
    href: "/transactions",
  },
  {
    id: "i3",
    kind: "auto",
    text: "Want me to auto-categorize repeat charges from Notion, Linear, and Vercel?",
    cta: "Apply",
  },
]

const KIND_ICON = {
  flag: Bell,
  review: Inbox,
  auto: Wand2,
}

export function AssistantCard({ items = DEFAULT_ITEMS }: { items?: AssistantItem[] }) {
  const [applied, setApplied] = useState<Record<string, boolean>>({})

  return (
    <section
      className="grain relative overflow-hidden rounded-xl p-6"
      style={{
        background:
          "linear-gradient(135deg, #1F4A3B 0%, #2E6E68 42%, #3C5C8A 78%, #5B4E8C 100%)",
        color: "#F4F1E9",
        boxShadow:
          "0 2px 6px rgba(30,27,22,0.06), 0 8px 24px rgba(30,27,22,0.06)",
      }}
    >
      {/* Decorative glows */}
      <div
        aria-hidden
        className="absolute -top-14 -right-10 w-[220px] h-[220px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.22), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-20 left-32 w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)",
        }}
      />

      <div className="relative flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-[10px] grid place-items-center"
          style={{
            background: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.22)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-[15px] tracking-tight">
            Ledger Assistant
          </div>
          <div className="text-xs opacity-70">
            Watching your books · updated 2 min ago
          </div>
        </div>
        <div className="ml-auto">
          <Pill
            tone="green"
            dot="pulse"
            style={{
              background: "rgba(255,255,255,0.16)",
              color: "#EAF7EF",
            }}
          >
            Live
          </Pill>
        </div>
      </div>

      <div className="relative grid gap-2.5">
        {items.map((it) => {
          const Icon = KIND_ICON[it.kind]
          const isApplied = applied[it.id]
          return (
            <div
              key={it.id}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(6px)",
              }}
            >
              <Icon className="w-[17px] h-[17px] mt-0.5 opacity-90 shrink-0" />
              <div className="flex-1 text-[13.5px] leading-[1.5] opacity-95">
                {it.text}
              </div>
              {isApplied ? (
                <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold whitespace-nowrap" style={{ color: "#D6F5E2" }}>
                  <Check className="w-3.5 h-3.5" />
                  Applied
                </span>
              ) : it.href ? (
                <Link
                  href={it.href}
                  className="shrink-0 px-3 py-1.5 text-[12.5px] font-semibold rounded-md whitespace-nowrap"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    color: "#1F2A24",
                  }}
                >
                  {it.cta}
                </Link>
              ) : (
                <button
                  onClick={() => setApplied((a) => ({ ...a, [it.id]: true }))}
                  className="shrink-0 px-3 py-1.5 text-[12.5px] font-semibold rounded-md whitespace-nowrap"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    color: "#1F2A24",
                  }}
                >
                  {it.cta}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
