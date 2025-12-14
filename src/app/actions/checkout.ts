"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia", // Use latest API version or what's available
})

export async function createPaymentIntent(amount: number) {
    const session = await auth()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: session.user.id,
            },
        })

        return { clientSecret: paymentIntent.client_secret }
    } catch (error) {
        console.error("Stripe error:", error)
        return { error: "Failed to create payment intent" }
    }
}

export async function createOrder(address: any, paymentIntentId: string) {
    const session = await auth()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    try {
        // Get cart
        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        })

        if (!cart || cart.items.length === 0) {
            return { error: "Cart is empty" }
        }

        const total = cart.items.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0)

        // Create Order
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                total: total,
                status: "PAID", // In a real app, verify webhook first
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
        })

        // Clear Cart
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        })

        revalidatePath("/profile")
        return { success: true, orderId: order.id }
    } catch (error) {
        console.error("Order creation error:", error)
        return { error: "Failed to create order" }
    }
}
