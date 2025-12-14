import { getCart } from "@/app/actions/cart"
import { createPaymentIntent } from "@/app/actions/checkout"
import { CheckoutClient } from "./checkout-client"
import { redirect } from "next/navigation"

export default async function CheckoutPage() {
    const cart = await getCart()

    if (!cart || cart.items.length === 0) {
        redirect("/cart")
    }

    const total = cart.items.reduce((acc: number, item: any) => acc + (Number(item.product.price) * item.quantity), 0)

    const { clientSecret, error } = await createPaymentIntent(total)

    if (error || !clientSecret) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">
                    Error initializing checkout: {error}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <CheckoutClient clientSecret={clientSecret} cart={cart} total={total} />
        </div>
    )
}
