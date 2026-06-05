import LandingPage from "@/app/landing/landing"

// Portfolio demo: always show the landing page. Visitors click "Start" to enter
// the app — getCurrentUser auto-creates / returns the local user.
export default function Home() {
  return <LandingPage />
}

export const dynamic = "force-dynamic"
