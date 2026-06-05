"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Button,
  CatChip,
  Icon,
  Pill,
  ReceiptThumb,
  Wordmark,
} from "@/components/ledger/primitives"

/* ─── MiniScan ─── */
function MiniScan() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setP((x) => (x >= 1 ? 0 : x + 0.04)), 90)
    return () => clearInterval(t)
  }, [])
  const done = p >= 1
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: 14,
        padding: 16,
        boxShadow: "var(--shadow-md)",
        width: 250,
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <ReceiptThumb kind="photo" w={56} h={72} />
          {!done && (
            <div className="shimmer" style={{ position: "absolute", inset: 0, borderRadius: 6 }} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <Pill tone={done ? "green" : "blue"} dot={done ? true : "pulse"}>
            {done ? "Done" : "Reading…"}
          </Pill>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 8 }}>
            IMG_4821.HEIC
          </div>
          <div
            style={{
              height: 4,
              borderRadius: 8,
              background: "var(--hairline)",
              marginTop: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, p * 100)}%`,
                background: done ? "var(--green)" : "var(--blue)",
                borderRadius: 8,
                transition: "width .2s linear",
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid var(--hairline)",
          marginTop: 12,
          paddingTop: 12,
          opacity: done ? 1 : 0.35,
          transition: "opacity .3s",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Blue Bottle Coffee</span>
          <span className="num" style={{ fontWeight: 600, fontSize: 13 }}>
            −$18.50
          </span>
        </div>
        <div style={{ marginTop: 7 }}>
          <CatChip name="Meals" color="#C9783D" small />
        </div>
      </div>
    </div>
  )
}

/* ─── Feature row ─── */
function Feature({
  tag,
  title,
  body,
  mock,
  flip,
}: {
  tag: string
  title: string
  body: string
  mock: React.ReactNode
  flip?: boolean
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 56,
        alignItems: "center",
      }}
      className="feature-row"
    >
      <div style={{ order: flip ? 2 : 1 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontSize: 12,
            fontWeight: 700,
            color: "var(--accent)",
            textTransform: "uppercase",
            letterSpacing: ".08em",
            marginBottom: 14,
          }}
        >
          <Icon name="sparkle" size={14} />
          {tag}
        </div>
        <h3
          className="serif"
          style={{
            fontSize: 34,
            lineHeight: 1.1,
            letterSpacing: "-.02em",
            marginBottom: 14,
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6, maxWidth: 440 }}>
          {body}
        </p>
      </div>
      <div style={{ order: flip ? 1 : 2, display: "flex", justifyContent: "center" }}>
        {mock}
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      {/* header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          padding: "18px 7vw",
          background: "color-mix(in oklab, var(--paper) 84%, transparent)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <Wordmark size={21} />
        <nav style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 28 }}>
          {["Features", "Self-hosting", "Pricing"].map((l) => (
            <a
              key={l}
              href="#"
              style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-2)" }}
            >
              {l}
            </a>
          ))}
          <Link href="/dashboard">
            <Button variant="primary">Start</Button>
          </Link>
        </nav>
      </header>

      {/* hero */}
      <section
        style={{
          padding: "90px 7vw 70px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 100,
            background: "var(--accent-soft)",
            color: "var(--accent)",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 26,
          }}
        >
          <Icon name="sparkle" size={14} /> Bookkeeping for builders
        </div>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(44px, 7vw, 88px)",
            lineHeight: 1.02,
            letterSpacing: "-.03em",
            maxWidth: 980,
            margin: "0 auto",
            fontWeight: 400,
          }}
        >
          Let an AI agent
          <br />
          do your <em style={{ fontStyle: "italic", color: "var(--accent)" }}>books</em>.
        </h1>
        <p
          style={{
            fontSize: "clamp(16px, 1.6vw, 20px)",
            color: "var(--ink-2)",
            lineHeight: 1.55,
            maxWidth: 580,
            margin: "24px auto 0",
          }}
        >
          Pictures of receipts go in. Organized, categorized transactions come
          out. Ledger handles the OCR, currency conversion, and the boring
          parts — you stay in control.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 34 }}>
          <Link href="/dashboard">
            <Button variant="primary" size="lg" icon="arrowUR">
              Start free
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="default" size="lg" icon="eye">
              See it work
            </Button>
          </Link>
        </div>

        {/* hero product preview */}
        <div style={{ marginTop: 60, position: "relative", maxWidth: 980, marginInline: "auto" }}>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-xl)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "13px 18px",
                borderBottom: "1px solid var(--hairline)",
                background: "var(--surface-2)",
              }}
            >
              {["#e0695e", "#e6b34d", "#5cb16f"].map((c) => (
                <span
                  key={c}
                  style={{ width: 11, height: 11, borderRadius: "50%", background: c }}
                />
              ))}
              <span
                className="mono"
                style={{ marginLeft: 14, fontSize: 12.5, color: "var(--ink-3)" }}
              >
                ledger.app/unsorted
              </span>
            </div>
            <div
              className="grain"
              style={{
                position: "relative",
                padding: "40px 36px",
                background: "var(--ai-grad)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 28,
                minHeight: 230,
              }}
            >
              <div style={{ color: "#F4F1E9", textAlign: "left", maxWidth: 280 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "5px 11px",
                    borderRadius: 100,
                    background: "rgba(255,255,255,.16)",
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  <Icon name="sparkle" size={13} /> Live extraction
                </div>
                <h4
                  className="serif"
                  style={{ fontSize: 27, marginTop: 16, lineHeight: 1.15, fontWeight: 400 }}
                >
                  Drop a photo.
                  <br />
                  Watch it become a row.
                </h4>
              </div>
              <MiniScan />
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section
        style={{
          padding: "40px 7vw 60px",
          display: "grid",
          gap: 100,
          maxWidth: 1160,
          margin: "0 auto",
        }}
      >
        <Feature
          tag="AI Scanner"
          title="Receipts in, structured data out"
          body="A vision model reads vendor, date, amount, currency and VAT from any photo or PDF — then files it under the right category with a confidence score you can trust."
          mock={<MiniScan />}
        />
        <Feature
          flip
          tag="Multi-currency"
          title="Every currency, converted automatically"
          body="Spent in euros, billed in dollars? Ledger detects the currency and applies the historical exchange rate from the transaction date. No spreadsheets, no guesswork."
          mock={
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: 14,
                boxShadow: "var(--shadow-md)",
                width: 280,
                overflow: "hidden",
              }}
            >
              {[
                ["Deutsche Bahn", "−€129.90", "≈ −$140.20"],
                ["WeWork", "−€320.00", "≈ −$345.40"],
                ["Northwind", "+€3,200", "≈ +$3,454"],
              ].map((r, i, arr) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "13px 16px",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--hairline)" : "none",
                  }}
                >
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{r[0]}</span>
                  <div style={{ textAlign: "right" }}>
                    <div className="num" style={{ fontSize: 13, fontWeight: 600 }}>
                      {r[1]}
                    </div>
                    <div className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                      {r[2]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        />
        <Feature
          tag="Invoices"
          title="Bill clients where your costs live"
          body="Pull unbilled transactions from any project straight into a polished PDF invoice. Send it by email and reconcile the payment — all without leaving Ledger."
          mock={
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "var(--shadow-lg)",
                width: 270,
                padding: 22,
                color: "#1a1a1a",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid #1F4A3B",
                  paddingBottom: 12,
                  marginBottom: 12,
                }}
              >
                <span style={{ fontFamily: "var(--font-newsreader)", fontSize: 18 }}>
                  Ledger
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-newsreader)",
                    fontSize: 20,
                    color: "#1F4A3B",
                  }}
                >
                  Invoice
                </span>
              </div>
              {[
                ["Product design", "$4,800"],
                ["Design system", "$1,440"],
                ["User testing", "$480"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    padding: "5px 0",
                    color: "#555",
                  }}
                >
                  <span>{k}</span>
                  <span className="num">{v}</span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "2px solid #1F4A3B",
                  marginTop: 8,
                  paddingTop: 10,
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                <span>Total</span>
                <span className="num">$6,720</span>
              </div>
            </div>
          }
        />
        <Feature
          flip
          tag="Open / Self-hosted"
          title="Your data, your server"
          body="Ledger ships as a single Docker image. Run it on your own hardware, keep every receipt private, and back it up to a zip whenever you like. No lock-in, fully open source."
          mock={
            <div
              style={{
                background: "var(--ink)",
                color: "var(--paper)",
                borderRadius: 12,
                boxShadow: "var(--shadow-lg)",
                width: 300,
                padding: 20,
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                lineHeight: 1.9,
              }}
            >
              <div style={{ color: "#8AD3A6" }}>$ docker compose up -d</div>
              <div style={{ opacity: 0.7 }}>✓ postgres ready</div>
              <div style={{ opacity: 0.7 }}>✓ ledger running on :3000</div>
              <div style={{ opacity: 0.7 }}>✓ backups scheduled (daily)</div>
              <div style={{ color: "#8AD3A6", marginTop: 6 }}>→ open http://localhost:3000</div>
            </div>
          }
        />
      </section>

      {/* CTA */}
      <section style={{ padding: "50px 7vw 80px", textAlign: "center" }}>
        <div
          className="grain"
          style={{
            position: "relative",
            background: "var(--ai-grad)",
            borderRadius: "var(--r-xl)",
            padding: "60px 32px",
            maxWidth: 900,
            margin: "0 auto",
            color: "#F4F1E9",
            overflow: "hidden",
          }}
        >
          <h2
            className="serif"
            style={{
              fontSize: "clamp(30px, 4vw, 46px)",
              lineHeight: 1.1,
              fontWeight: 400,
              position: "relative",
            }}
          >
            Close your books in an afternoon,
            <br />
            not a weekend.
          </h2>
          <div style={{ marginTop: 28, position: "relative" }}>
            <Link href="/dashboard">
              <Button
                size="lg"
                icon="arrowUR"
                style={{
                  background: "var(--paper)",
                  color: "var(--ink)",
                  border: "none",
                }}
              >
                Get started — it&apos;s free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer
        style={{
          borderTop: "1px solid var(--hairline)",
          padding: "34px 7vw",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Wordmark size={18} />
        <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
          Bookkeeping for builders.
        </span>
        <nav style={{ marginLeft: "auto", display: "flex", gap: 22 }}>
          {["Privacy", "Terms", "Contact", "GitHub"].map((l) => (
            <a key={l} href="#" style={{ fontSize: 13, color: "var(--ink-2)" }}>
              {l}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  )
}
