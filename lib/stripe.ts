// Stripe is disabled — using dummy/demo mode
export const stripeClient = null

export type Plan = {
  code: string
  name: string
  description: string
  benefits: string[]
  price: string
  stripePriceId: string
  limits: {
    storage: number
    ai: number
  }
  isAvailable: boolean
}

export const PLANS: Record<string, Plan> = {
  unlimited: {
    code: "unlimited",
    name: "Unlimited",
    description: "Special unlimited plan",
    benefits: ["Unlimited storage", "Unlimited AI analysis", "Unlimited everything"],
    price: "",
    stripePriceId: "",
    limits: {
      storage: -1,
      ai: -1,
    },
    isAvailable: false,
  },
  starter: {
    code: "starter",
    name: "Starter",
    description: "Perfect for freelancers and indie-hackers getting started",
    benefits: [
      "256 MB of storage",
      "200 AI file analyses per month",
      "Unlimited transactions",
      "Unlimited fields & categories",
      "Email support",
    ],
    price: "$9 / month",
    stripePriceId: "price_demo_starter",
    limits: {
      storage: 256 * 1024 * 1024,
      ai: 200,
    },
    isAvailable: true,
  },
  pro: {
    code: "pro",
    name: "Pro",
    description: "For professionals and small businesses that need more power",
    benefits: [
      "2 GB of storage",
      "1 000 AI file analyses per month",
      "Unlimited transactions",
      "Unlimited fields, categories and projects",
      "Priority support",
      "Early access to new features",
    ],
    price: "$29 / month",
    stripePriceId: "price_demo_pro",
    limits: {
      storage: 2 * 1024 * 1024 * 1024,
      ai: 1000,
    },
    isAvailable: true,
  },
  business: {
    code: "business",
    name: "Business",
    description: "For teams and growing businesses that need unlimited everything",
    benefits: [
      "Unlimited storage",
      "Unlimited AI analyses",
      "Unlimited transactions",
      "Custom LLM integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
    price: "$99 / month",
    stripePriceId: "price_demo_business",
    limits: {
      storage: -1,
      ai: -1,
    },
    isAvailable: true,
  },
}
