"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Icon, Pill, Segmented, Money, Button } from "./primitives"
import { formatCurrency } from "./format"

export interface TableTx {
  id: string
  date: string | Date
  vendor: string
  desc?: string
  amount: number
  cur: string
  categoryCode?: string | null
  categoryName?: string | null
  categoryColor?: string | null
  projectCode?: string | null
  projectName?: string | null
  projectColor?: string | null
  vat?: number
  status: "approved" | "review"
  ai?: boolean
  files: number
}

export interface CategoryOpt { value: string; label: string; color?: string }
export interface ProjectOpt { value: string; label: string; color?: string }

function Select({
  value,
  onChange,
  options,
  placeholder,
  w,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  w?: number | string
}) {
  return (
    <div style={{ position: "relative", width: w }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focusable"
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          width: "100%",
          padding: "8px 30px 8px 11px",
          fontSize: 13,
          fontWeight: 500,
          borderRadius: "var(--r-md)",
          border: "1px solid var(--hairline-2)",
          background: "var(--surface)",
          color: value ? "var(--ink)" : "var(--ink-3)",
          cursor: "pointer",
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span
        style={{
          position: "absolute",
          right: 9,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "var(--ink-3)",
        }}
      >
        <Icon name="chevDown" size={15} />
      </span>
    </div>
  )
}

const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })

export function TransactionsTable({
  initialTxs,
  categories,
  projects,
}: {
  initialTxs: TableTx[]
  categories: CategoryOpt[]
  projects: ProjectOpt[]
}) {
  const [q, setQ] = useState("")
  const [fCat, setFCat] = useState("")
  const [fProj, setFProj] = useState("")
  const [fStatus, setFStatus] = useState<"all" | "approved" | "review">("all")
  const [sortKey, setSortKey] = useState<"date" | "vendor" | "amount">("date")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [sel, setSel] = useState<Record<string, boolean>>({})

  const sort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const rows = useMemo(() => {
    let r = initialTxs.filter((t) => {
      if (fCat && t.categoryCode !== fCat) return false
      if (fProj && t.projectCode !== fProj) return false
      if (fStatus !== "all" && t.status !== fStatus) return false
      if (q) {
        const s = `${t.vendor} ${t.desc ?? ""}`.toLowerCase()
        if (!s.includes(q.toLowerCase())) return false
      }
      return true
    })
    r.sort((a, b) => {
      let av: string | number = (a as unknown as Record<string, unknown>)[sortKey] as string | number
      let bv: string | number = (b as unknown as Record<string, unknown>)[sortKey] as string | number
      if (sortKey === "date") {
        av = new Date(a.date).getTime()
        bv = new Date(b.date).getTime()
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })
    return r
  }, [initialTxs, q, fCat, fProj, fStatus, sortKey, sortDir])

  const selIds = Object.keys(sel).filter((k) => sel[k])
  const allSel = rows.length > 0 && rows.every((r) => sel[r.id])
  const toggleAll = () => {
    if (allSel) setSel({})
    else {
      const s: Record<string, boolean> = {}
      rows.forEach((r) => (s[r.id] = true))
      setSel(s)
    }
  }

  const SortHead = ({
    k,
    children,
    align,
  }: {
    k: "date" | "vendor" | "amount"
    children: React.ReactNode
    align?: "left" | "right"
  }) => (
    <th
      onClick={() => sort(k)}
      style={{
        textAlign: align || "left",
        padding: "11px 14px",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 700,
        color: "var(--ink-3)",
        textTransform: "uppercase",
        letterSpacing: ".06em",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          justifyContent: align === "right" ? "flex-end" : "flex-start",
        }}
      >
        {children}
        {sortKey === k && (
          <Icon
            name="chevDown"
            size={13}
            style={{ transform: sortDir === "asc" ? "rotate(180deg)" : "none" }}
          />
        )}
      </span>
    </th>
  )

  const th = (label: string, align?: "left" | "right" | "center") => (
    <th
      style={{
        textAlign: align || "left",
        padding: "11px 14px",
        fontSize: 11,
        fontWeight: 700,
        color: "var(--ink-3)",
        textTransform: "uppercase",
        letterSpacing: ".06em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </th>
  )

  return (
    <div className="stagger" style={{ display: "grid", gap: 16 }}>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 260px", minWidth: 220 }}>
          <span
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--ink-3)",
            }}
          >
            <Icon name="search" size={16} />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search vendor, description, tags…"
            className="focusable"
            style={{
              width: "100%",
              padding: "9px 12px 9px 34px",
              fontSize: 13.5,
              borderRadius: "var(--r-md)",
              border: "1px solid var(--hairline-2)",
              background: "var(--surface)",
            }}
          />
        </div>
        <Select
          value={fCat}
          onChange={setFCat}
          placeholder="All categories"
          w={170}
          options={categories}
        />
        <Select
          value={fProj}
          onChange={setFProj}
          placeholder="All projects"
          w={150}
          options={projects}
        />
        <Segmented
          value={fStatus}
          onChange={(v) => setFStatus(v as "all" | "approved" | "review")}
          size="sm"
          options={[
            { value: "all", label: "All" },
            { value: "approved", label: "Approved" },
            { value: "review", label: "Review" },
          ]}
        />
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--r-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Bulk bar */}
        {selIds.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 16px",
              background: "var(--accent-soft)",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
              {selIds.length} selected
            </span>
            <div style={{ flex: 1 }} />
            <Button variant="ghost" size="sm" icon="layers">
              Categorize
            </Button>
            <Button variant="ghost" size="sm" icon="paperclip">
              Tag
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="exportI"
              onClick={() => (window.location.href = "/export")}
            >
              Export
            </Button>
            <Button variant="danger" size="sm" icon="trash" onClick={() => setSel({})}>
              Clear
            </Button>
          </div>
        )}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--hairline)",
                  background: "var(--surface-2)",
                }}
              >
                <th style={{ padding: "11px 14px", width: 40 }}>
                  <input
                    type="checkbox"
                    checked={allSel}
                    onChange={toggleAll}
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: "var(--accent)",
                      cursor: "pointer",
                    }}
                  />
                </th>
                <SortHead k="date">Date</SortHead>
                <SortHead k="vendor">Vendor</SortHead>
                <SortHead k="amount" align="right">
                  Amount
                </SortHead>
                {th("Category")}
                {th("Project")}
                {th("Tax", "right")}
                {th("Status")}
                {th("", "center")}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: "40px 20px",
                      textAlign: "center",
                      color: "var(--ink-3)",
                      fontSize: 13,
                    }}
                  >
                    No transactions match your filters.
                  </td>
                </tr>
              )}
              {rows.map((t) => (
                <tr
                  key={t.id}
                  style={{ borderBottom: "1px solid var(--hairline)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface-2)")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "11px 14px" }}>
                    <input
                      type="checkbox"
                      checked={!!sel[t.id]}
                      onChange={() => setSel((s) => ({ ...s, [t.id]: !s[t.id] }))}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: "var(--accent)",
                        cursor: "pointer",
                      }}
                    />
                  </td>
                  <td
                    className="num"
                    style={{ padding: "11px 14px", color: "var(--ink-2)", whiteSpace: "nowrap" }}
                  >
                    {fmtDate(t.date)}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <Link
                      href={`/transactions/${t.id}`}
                      style={{
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        color: "var(--ink)",
                      }}
                    >
                      {t.vendor}
                      {t.ai && (
                        <span
                          title="Scanned by AI"
                          style={{ color: "var(--accent)", display: "flex" }}
                        >
                          <Icon name="sparkle" size={12} />
                        </span>
                      )}
                    </Link>
                    {t.desc && (
                      <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{t.desc}</div>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Money amount={t.amount} cur={t.cur} size={13.5} weight={600} />
                    <span
                      className="num"
                      style={{ fontSize: 10.5, color: "var(--ink-3)", marginLeft: 5 }}
                    >
                      {t.cur}
                    </span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    {t.categoryName ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        <span
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: 3,
                            background: t.categoryColor || "var(--ink-3)",
                            boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)",
                          }}
                        />
                        {t.categoryName}
                      </span>
                    ) : (
                      <span style={{ color: "var(--ink-3)" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    {t.projectName ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12.5,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: t.projectColor || "var(--ink-3)",
                          }}
                        />
                        {t.projectName}
                      </span>
                    ) : (
                      <span style={{ color: "var(--ink-3)" }}>—</span>
                    )}
                  </td>
                  <td
                    className="num"
                    style={{
                      padding: "11px 14px",
                      textAlign: "right",
                      color: t.vat ? "var(--ink-2)" : "var(--ink-3)",
                    }}
                  >
                    {t.vat ? formatCurrency(t.vat, t.cur).replace("−", "") : "—"}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    {t.status === "review" ? (
                      <Pill tone="amber" dot>
                        Review
                      </Pill>
                    ) : (
                      <Pill tone="green" dot>
                        Approved
                      </Pill>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      textAlign: "center",
                      color: "var(--ink-3)",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {t.files > 0 && (
                        <span
                          title={`${t.files} attachment(s)`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 2,
                            fontSize: 12,
                          }}
                        >
                          <Icon name="paperclip" size={14} />
                          {t.files}
                        </span>
                      )}
                      <Link
                        href={`/transactions/${t.id}`}
                        style={{ display: "flex" }}
                        title="Open"
                      >
                        <Icon name="chevRight" size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderTop: "1px solid var(--hairline)",
            background: "var(--surface-2)",
          }}
        >
          <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
            {rows.length} of {initialTxs.length} transactions
          </span>
          <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
            Tip: click a row to open the detail view
          </span>
        </div>
      </div>
    </div>
  )
}
