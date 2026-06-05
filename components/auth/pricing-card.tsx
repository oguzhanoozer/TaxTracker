"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plan } from "@/lib/stripe"
import { Check, Loader2, Sparkles } from "lucide-react"
import { useState } from "react"
import { FormError } from "../forms/error"

export function PricingCard({ plan, hideButton = false }: { plan: Plan; hideButton?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isPopular = plan.code === "pro"

  const handleClick = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/stripe/checkout?code=${plan.code}`, {
        method: "POST",
      })
      const data = await response.json()
      if (data.error) {
        setError(data.error)
      } else {
        window.location.href = data.session.url
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      className={`w-full max-w-xs relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] rounded-2xl ${
        isPopular
          ? "ring-2 ring-teal-500 shadow-md"
          : "border border-slate-100 shadow-sm"
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
      )}

      <CardHeader className="relative pb-2">
        {isPopular && (
          <div className="flex items-center gap-1 text-xs font-bold text-teal-600 uppercase tracking-wide mb-2">
            <Sparkles className="h-3 w-3" />
            Most Popular
          </div>
        )}
        <CardTitle className="text-2xl font-bold text-slate-800">{plan.name}</CardTitle>
        <CardDescription className="text-sm leading-snug text-slate-500">{plan.description}</CardDescription>
        {plan.price && (
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-800">{plan.price.split(" /")[0]}</span>
            {plan.price.includes("/") && (
              <span className="text-slate-400 text-sm ml-1">/ {plan.price.split("/ ")[1]}</span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="relative">
        <ul className="space-y-2.5">
          {plan.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
              <span className="text-sm text-slate-500">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 relative pt-4">
        {!hideButton && (
          <Button
            className={`w-full font-semibold ${
              isPopular
                ? "bg-teal-600 hover:bg-teal-700 text-white border-0"
                : ""
            }`}
            variant={isPopular ? "default" : "outline"}
            onClick={handleClick}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Started"}
          </Button>
        )}
        {error && <FormError>{error}</FormError>}
      </CardFooter>
    </Card>
  )
}
