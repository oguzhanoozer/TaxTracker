import { NextResponse } from "next/server"

// Portfolio demo — no auth gate. Visitors land on the app directly.
export default async function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
