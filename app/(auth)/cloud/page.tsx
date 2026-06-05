import { PricingCard } from "@/components/auth/pricing-card"
import { ColoredText } from "@/components/ui/colored-text"
import config from "@/lib/config"
import { PLANS } from "@/lib/stripe"
import { redirect } from "next/navigation"

export default async function ChoosePlanPage() {
  if (config.selfHosted.isEnabled) {
    redirect(config.selfHosted.redirectUrl)
  }

  const availablePlans = Object.values(PLANS).filter((p) => p.isAvailable)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 block mb-3">TaxFlow Cloud</h1>
        <p className="text-xl text-slate-500 max-w-xl mx-auto">
          Choose the plan that fits your needs. Cancel anytime.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {availablePlans.map((plan) => (
          <PricingCard key={plan.code} plan={plan} />
        ))}
      </div>
    </div>
  )
}
