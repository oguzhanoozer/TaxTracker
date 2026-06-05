// Server-safe formatting helpers (no React, no "use client").

export function formatCurrency(value: number, currency: string = "USD") {
  const symbol =
    currency === "USD"
      ? "$"
      : currency === "EUR"
        ? "€"
        : currency === "GBP"
          ? "£"
          : currency + " "
  const neg = value < 0
  const abs = Math.abs(value)
  return (
    (neg ? "−" : "") +
    symbol +
    abs.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}
