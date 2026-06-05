import { ExportBuilder } from "@/components/ledger/export-builder"
import { Button, Icon } from "@/components/ledger/primitives"
import { getCurrentUser } from "@/lib/auth"
import { getTransactions } from "@/models/transactions"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Export",
  description: "Download your books",
}

export default async function ExportPage() {
  const user = await getCurrentUser()
  const { total: totalAll } = await getTransactions(user.id, {}, { limit: 1, offset: 0 })

  return (
    <div style={{ padding: "20px 32px 32px", width: "100%", margin: 0 }}>
      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            className="serif"
            style={{ fontSize: 30, lineHeight: 1.05, letterSpacing: "-.02em" }}
          >
            Export
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 2 }}>
            Hand a clean file to your accountant
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="focusable"
            title="Search"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: "var(--r-md)",
              border: "1px solid var(--hairline-2)",
              background: "var(--surface)",
              color: "var(--ink-2)",
            }}
          >
            <Icon name="search" size={17} />
          </button>
          <Link href="/unsorted">
            <Button variant="primary" icon="upload">
              Upload
            </Button>
          </Link>
        </div>
      </header>

      <ExportBuilder
        totalAll={totalAll}
        totalApproved={Math.round(totalAll * 0.86)}
      />
    </div>
  )
}
