import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { ColoredText } from "@/components/ui/colored-text"
import { PLANS } from "@/lib/stripe"
import { Cake, Ghost } from "lucide-react"
import Link from "next/link"

export default async function CloudPaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>
}) {
  const { session_id: sessionId } = await searchParams

  // Demo mode: parse the plan code from demo session id (e.g. "demo_pro")
  if (sessionId && sessionId.startsWith("demo_")) {
    const planCode = sessionId.replace("demo_", "")
    const plan = PLANS[planCode]

    return (
      <Card className="w-full max-w-xl mx-auto p-8 flex flex-col items-center justify-center gap-4 rounded-2xl shadow-sm border border-slate-100">
        <Cake className="w-24 h-24 text-teal-500" />
        <CardTitle className="text-3xl font-bold text-slate-800">
          Demo Checkout Complete
        </CardTitle>
        <CardDescription className="text-center text-xl">
          {plan ? `You selected the ${plan.name} plan (${plan.price}).` : "Plan selected."} In production, your
          subscription would be activated here. Log in to continue.
        </CardDescription>
        <CardContent className="w-full">
          <LoginForm />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-xl mx-auto p-8 flex flex-col items-center justify-center gap-4">
      <Ghost className="w-36 h-36" />
      <CardTitle className="text-3xl font-bold">Session Not Found</CardTitle>
      <CardDescription className="text-center text-xl">No valid payment session found.</CardDescription>
      <CardFooter>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
