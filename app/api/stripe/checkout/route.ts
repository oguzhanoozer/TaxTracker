import { PLANS } from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "Missing plan code" }, { status: 400 })
  }

  const plan = PLANS[code]
  if (!plan || !plan.isAvailable) {
    return NextResponse.json({ error: "Invalid or inactive plan" }, { status: 400 })
  }

  // Demo mode: simulate a successful checkout session
  const demoSession = {
    id: `demo_session_${plan.code}_${Date.now()}`,
    url: `/cloud/payment/success?session_id=demo_${plan.code}`,
  }

  return NextResponse.json({ session: demoSession })
}
