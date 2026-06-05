"use client"

import { useState } from "react"
import { Button, Card, Icon, Pill } from "./primitives"

const LEDGER_FIELDS = [
  "— skip —",
  "Date",
  "Vendor",
  "Description",
  "Amount",
  "Currency",
  "Category",
  "Project",
  "Tax",
  "Notes",
]

const IMPORT_HEADERS = ["Date", "Description", "Amount", "Cur", "Memo"]
const IMPORT_EXAMPLE = ["2026-05-04", "Blue Bottle", "18.50", "USD", "Coffee w/ client"]
const IMPORT_ROWS = [
  ["2026-05-04", "Blue Bottle", "18.50", "USD", "Coffee w/ client"],
  ["2026-05-04", "Vercel Inc.", "20.00", "USD", "Hosting"],
  ["2026-05-02", "DB Bahn", "129.90", "EUR", "Train Berlin Munich"],
  ["2026-05-01", "WeWork", "320.00", "EUR", "Desk"],
  ["2026-04-30", "Upwork *Atlas", "540.00", "USD", "Illustration"],
]

const DEFAULT_MAP: Record<string, string> = {
  Date: "Date",
  Description: "Vendor",
  Amount: "Amount",
  Cur: "Currency",
  Memo: "Notes",
}

function SelectField({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={{ position: "relative", flex: 1 }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focusable"
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          width: "100%",
          padding: "7px 26px 7px 10px",
          fontSize: 12.5,
          fontWeight: 500,
          borderRadius: "var(--r-sm)",
          border: "1px solid var(--hairline-2)",
          background: "var(--surface)",
          color: "var(--ink)",
          cursor: "pointer",
        }}
      >
        {LEDGER_FIELDS.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      <span
        style={{
          position: "absolute",
          right: 7,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "var(--ink-3)",
        }}
      >
        <Icon name="chevDown" size={13} />
      </span>
    </div>
  )
}

export function ImportWizard() {
  const [stage, setStage] = useState<"upload" | "map" | "importing" | "done">("upload")
  const [columnMap, setColumnMap] = useState<Record<string, string>>(DEFAULT_MAP)
  const [prog, setProg] = useState(0)

  const startImport = () => {
    setStage("importing")
    setProg(0)
    const t = setInterval(() => {
      setProg((p) => {
        if (p >= 1) {
          clearInterval(t)
          setStage("done")
          return 1
        }
        return p + 0.07
      })
    }, 120)
  }

  if (stage === "upload") {
    return (
      <div style={{ maxWidth: 760 }}>
        <div
          onClick={() => setStage("map")}
          style={{
            border: "2px dashed var(--hairline-2)",
            borderRadius: "var(--r-xl)",
            background: "var(--surface)",
            padding: "56px 32px",
            textAlign: "center",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
            transition: "border-color .15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--hairline-2)")}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "var(--accent-soft)",
              color: "var(--accent)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 18px",
            }}
          >
            <Icon name="importI" size={28} />
          </div>
          <div className="serif" style={{ fontSize: 22 }}>
            Upload a CSV or XLSX
          </div>
          <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 6 }}>
            Coming from QuickBooks, Excel, or another tool? Drop your file and
            we&apos;ll map the columns.
          </div>
          <div style={{ marginTop: 18 }}>
            <Button variant="primary" icon="upload">
              Choose file
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (stage === "importing" || stage === "done") {
    return (
      <div style={{ maxWidth: 620 }}>
        <Card pad={28}>
          {stage === "importing" ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <span style={{ display: "flex", color: "var(--accent)" }}>
                  <Icon name="refresh" size={20} />
                </span>
                <h3 className="serif" style={{ fontSize: 20 }}>
                  Importing 153 rows…
                </h3>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 10,
                  background: "var(--hairline)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, prog * 100)}%`,
                    background: "var(--accent)",
                    borderRadius: 10,
                    transition: "width .15s",
                  }}
                />
              </div>
              <div
                className="num"
                style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 10 }}
              >
                {Math.round(Math.min(100, prog * 100))}% ·{" "}
                {Math.round(Math.min(153, prog * 153))} of 153
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--green-soft)",
                  color: "var(--green)",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Icon name="check" size={28} />
              </div>
              <h3 className="serif" style={{ fontSize: 22 }}>
                149 of 153 imported
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 6 }}>
                4 rows had issues and were skipped.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Button variant="default" icon="download">
                  Download 4 failed rows
                </Button>
                <Button
                  variant="primary"
                  onClick={() => (window.location.href = "/transactions")}
                >
                  View transactions
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    )
  }

  // map stage
  return (
    <div style={{ maxWidth: 1180, display: "grid", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button variant="ghost" size="sm" icon="chevLeft" onClick={() => setStage("upload")}>
          Back
        </Button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13.5,
          }}
        >
          <Icon name="file" size={16} style={{ color: "var(--ink-3)" }} />
          <span className="mono" style={{ fontSize: 12.5 }}>
            quickbooks_export_2026.csv
          </span>
          <Pill tone="neutral">153 rows</Pill>
        </div>
      </div>

      <Card pad={0}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--hairline)" }}>
          <h3 className="serif" style={{ fontSize: 19 }}>
            Map your columns
          </h3>
          <p style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
            Match each column in your file to a Ledger field.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${IMPORT_HEADERS.length}, minmax(0, 1fr))`,
            gap: 10,
            padding: 16,
          }}
        >
          {IMPORT_HEADERS.map((h, i) => (
            <div
              key={h}
              style={{
                border: "1px solid var(--hairline)",
                borderRadius: "var(--r-md)",
                padding: 10,
                background: "var(--surface-2)",
                minWidth: 0,
              }}
            >
              <div
                className="mono"
                style={{ fontSize: 11.5, color: "var(--ink-2)", fontWeight: 600 }}
              >
                {h}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: "var(--ink-3)",
                  margin: "2px 0 8px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                e.g. {IMPORT_EXAMPLE[i]}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Icon
                  name="chevDown"
                  size={12}
                  style={{ color: "var(--accent)", transform: "rotate(-90deg)", flexShrink: 0 }}
                />
                <SelectField
                  value={columnMap[h]}
                  onChange={(v) => setColumnMap((m) => ({ ...m, [h]: v }))}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card pad={0}>
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--hairline)",
            fontSize: 12.5,
            color: "var(--ink-3)",
          }}
        >
          Preview · first 5 rows
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                {IMPORT_HEADERS.map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "9px 14px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    {columnMap[h] === "— skip —" ? (
                      <span style={{ color: "var(--ink-3)", textDecoration: "line-through" }}>
                        {h}
                      </span>
                    ) : (
                      columnMap[h]
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {IMPORT_ROWS.map((row, ri) => (
                <tr key={ri} style={{ borderTop: "1px solid var(--hairline)" }}>
                  {row.map((cell, ci) => {
                    const skip = columnMap[IMPORT_HEADERS[ci]] === "— skip —"
                    return (
                      <td
                        key={ci}
                        className={ci === 2 ? "num" : ""}
                        style={{
                          padding: "9px 14px",
                          color: skip ? "var(--ink-3)" : "var(--ink)",
                          opacity: skip ? 0.4 : 1,
                        }}
                      >
                        {cell}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            background: "var(--surface-2)",
            borderTop: "1px solid var(--hairline)",
          }}
        >
          <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
            <Pill tone="amber">2 rows flagged</Pill>{" "}
            <span style={{ marginLeft: 8 }}>missing currency — will default to USD</span>
          </span>
          <Button variant="primary" icon="check" size="lg" onClick={startImport}>
            Import 153 rows
          </Button>
        </div>
      </Card>
    </div>
  )
}
