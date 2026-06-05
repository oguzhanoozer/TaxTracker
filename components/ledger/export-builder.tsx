"use client"

import { useEffect, useState } from "react"
import { Button, Card, Segmented } from "./primitives"

const LS_KEY = "ledger.export.prefs"

interface ExportPrefs {
  fmt: "csv" | "xlsx" | "pdf"
  group: "none" | "category" | "project" | "month"
  include: "all" | "approved"
  from: string
  to: string
}

function loadPrefs(): Partial<ExportPrefs> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function savePrefs(p: ExportPrefs) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}

const INPUT_STYLE: React.CSSProperties = {
  padding: "7px 10px",
  fontSize: 13,
  borderRadius: "var(--r-sm)",
  border: "1px solid var(--hairline-2)",
  background: "var(--surface)",
  color: "var(--ink)",
  width: 150,
}

function OptionRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <span style={{ fontSize: 13.5, fontWeight: 600 }}>{label}</span>
      {children}
    </div>
  )
}

export function ExportBuilder({
  totalApproved,
  totalAll,
}: {
  totalApproved: number
  totalAll: number
}) {
  const [fmt, setFmt] = useState<"csv" | "xlsx" | "pdf">("csv")
  const [group, setGroup] = useState<"none" | "category" | "project" | "month">("none")
  const [include, setInclude] = useState<"all" | "approved">("approved")
  const [from, setFrom] = useState(() => {
    const d = new Date()
    d.setMonth(0, 1)
    return d.toISOString().slice(0, 10)
  })
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10))

  // Hydrate from localStorage on mount
  useEffect(() => {
    const p = loadPrefs()
    if (p.fmt) setFmt(p.fmt)
    if (p.group) setGroup(p.group)
    if (p.include) setInclude(p.include)
    if (p.from) setFrom(p.from)
    if (p.to) setTo(p.to)
  }, [])

  // Persist on every change
  useEffect(() => {
    savePrefs({ fmt, group, include, from, to })
  }, [fmt, group, include, from, to])

  const count = include === "approved" ? totalApproved : totalAll
  const fmtSize: Record<typeof fmt, string> = {
    csv: `${Math.max(1, Math.round((count * 0.21) / 1024 * 1024))} KB`,
    xlsx: `${Math.max(2, Math.round((count * 0.35) / 1024 * 1024))} KB`,
    pdf: `${(count * 0.003).toFixed(1)} MB`,
  }

  const startDownload = () => {
    const params = new URLSearchParams({
      format: fmt,
      group,
      include,
      from,
      to,
    })
    window.location.href = `/export/transactions?${params.toString()}`
  }

  return (
    <div style={{ maxWidth: 980, width: "100%", margin: "0 auto", display: "grid", gap: 14 }}>
      <Card pad={0}>
        <div style={{ padding: "14px 20px 2px" }}>
          <h3 className="serif" style={{ fontSize: 19 }}>
            Build your export
          </h3>
          <p style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>
            Everything your accountant needs, in the shape they want it.
          </p>
        </div>
        <div style={{ padding: "0 20px" }}>
          <OptionRow label="Date range">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                style={INPUT_STYLE}
              />
              <span style={{ color: "var(--ink-3)" }}>→</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                style={INPUT_STYLE}
              />
            </div>
          </OptionRow>
          <OptionRow label="Format">
            <Segmented
              value={fmt}
              onChange={(v) => setFmt(v as typeof fmt)}
              options={[
                { value: "csv", label: "CSV" },
                { value: "xlsx", label: "XLSX" },
                { value: "pdf", label: "PDF" },
              ]}
            />
          </OptionRow>
          <OptionRow label="Group by">
            <Segmented
              value={group}
              onChange={(v) => setGroup(v as typeof group)}
              options={[
                { value: "none", label: "None" },
                { value: "category", label: "Category" },
                { value: "project", label: "Project" },
                { value: "month", label: "Month" },
              ]}
            />
          </OptionRow>
          <OptionRow label="Include">
            <Segmented
              value={include}
              onChange={(v) => setInclude(v as typeof include)}
              options={[
                { value: "all", label: "All" },
                { value: "approved", label: "Only approved" },
              ]}
            />
          </OptionRow>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            background: "var(--surface-2)",
            borderTop: "1px solid var(--hairline)",
            marginTop: 4,
          }}
        >
          <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
            Will export <strong className="num">{count}</strong> transactions ·{" "}
            <span className="num">≈ {fmtSize[fmt]}</span>
          </div>
          <Button variant="primary" icon="download" size="lg" onClick={startDownload}>
            Download {fmt.toUpperCase()}
          </Button>
        </div>
      </Card>
    </div>
  )
}
