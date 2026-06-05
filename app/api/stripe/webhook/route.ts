import { NextResponse } from "next/server"

// Demo mode: webhook handler is a no-op (billing disabled in self-hosted build).
export async function POST() {
  return new NextResponse("Demo mode — webhook not processed", { status: 200 })
}
