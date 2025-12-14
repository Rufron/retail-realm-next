"use client"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { OrderSummary } from "@/components/checkout/order-summary"

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutClient({ clientSecret, cart, total }: { clientSecret: string, cart: any, total: number }) {
    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
        },
    }

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm clientSecret={clientSecret} />
                </Elements>
            </div>
            <div className="lg:col-span-4">
                <div className="sticky top-24">
                    <OrderSummary items={cart.items} total={total} />
                </div>
            </div>
        </div>
    )
}
