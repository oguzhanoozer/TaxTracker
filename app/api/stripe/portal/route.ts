import { getCurrentUser } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

// Demo mode: redirect to profile settings instead of Stripe portal
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.redirect(new URL("/settings/profile", request.url))
}
