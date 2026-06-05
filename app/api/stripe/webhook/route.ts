import { NextResponse } from "next/server"

// Demo mode: webhook handler is a no-op
export async function POST() {
  return new NextResponse("Demo mode — webhook not processed", { status: 200 })
}

async function handleUserSubscriptionUpdate(
  customerId: string,
  item: Stripe.SubscriptionItem
) {
  console.log(`Updating subscription for customer ${customerId}`)

  if (!stripeClient) {
    return new NextResponse("Stripe client is not initialized", { status: 500 })
  }

  const plan = Object.values(PLANS).find((p) => p.stripePriceId === item.price.id)
  if (!plan) {
    throw new Error(`Plan not found for price ID: ${item.price.id}`)
  }

  let user = await getUserByStripeCustomerId(customerId)
  if (!user) {
    const customer = (await stripeClient.customers.retrieve(customerId)) as Stripe.Customer
    console.log(`User not found for customer ${customerId}, creating new user with email ${customer.email}`)

    user = await getOrCreateCloudUser(customer.email as string, {
      email: customer.email as string,
      name: customer.name as string,
      stripeCustomerId: customer.id,
    })
  }

  const newMembershipExpiresAt = new Date(item.current_period_end * 1000)

  await updateUser(user.id, {
    membershipPlan: plan.code,
    membershipExpiresAt:
      user.membershipExpiresAt && user.membershipExpiresAt > newMembershipExpiresAt
        ? user.membershipExpiresAt
        : newMembershipExpiresAt,
    storageLimit: plan.limits.storage,
    aiBalance: plan.limits.ai,
    updatedAt: new Date(),
  })

  console.log(`Updated user ${user.id} with plan ${plan.code} and expires at ${newMembershipExpiresAt}`)
}
