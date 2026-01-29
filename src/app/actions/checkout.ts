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

// --- Mpesa (Safaricom) payment integration ---

function getMpesaBaseUrl() {
    // Allow overriding via env, default to sandbox URL
    return process.env.MPESA_BASE_URL || "https://sandbox.safaricom.co.ke"
}

async function getMpesaAccessToken() {
    const consumerKey = process.env.MPESA_CONSUMER_KEY
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET

    if (!consumerKey || !consumerSecret) {
        throw new Error("Mpesa consumer key/secret not configured")
    }

    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")
    const url = `${getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`

    const res = await fetch(url, {
        headers: {
            Authorization: `Basic ${credentials}`,
        },
    })

    if (!res.ok) {
        throw new Error(`Mpesa auth failed with status ${res.status}`)
    }

    const data = await res.json() as { access_token?: string }
    if (!data.access_token) {
        throw new Error("Mpesa auth response missing access_token")
    }

    return data.access_token
}

function buildMpesaTimestamp() {
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, "0")
    const year = now.getFullYear()
    const month = pad(now.getMonth() + 1)
    const day = pad(now.getDate())
    const hours = pad(now.getHours())
    const minutes = pad(now.getMinutes())
    const seconds = pad(now.getSeconds())
    return `${year}${month}${day}${hours}${minutes}${seconds}`
}

export async function initiateMpesaPayment(address: any, phoneNumber: string) {
    const session = await auth()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    try {
        const businessShortCode = process.env.MPESA_SHORTCODE
        const passkey = process.env.MPESA_PASSKEY
        const callbackUrl = process.env.MPESA_CALLBACK_URL

        if (!businessShortCode || !passkey || !callbackUrl) {
            return { error: "Mpesa configuration missing. Please set MPESA_SHORTCODE, MPESA_PASSKEY and MPESA_CALLBACK_URL." }
        }

        // Fetch cart and compute total (amount in KES)
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

        const timestamp = buildMpesaTimestamp()
        const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString("base64")

        const accessToken = await getMpesaAccessToken()

        const stkUrl = `${getMpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`

        const stkRes = await fetch(stkUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                BusinessShortCode: businessShortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: Math.round(total),
                PartyA: phoneNumber,
                PartyB: businessShortCode,
                PhoneNumber: phoneNumber,
                CallBackURL: callbackUrl,
                AccountReference: session.user.id,
                TransactionDesc: "Retail Realm Mpesa Payment",
            }),
        })

        if (!stkRes.ok) {
            const text = await stkRes.text()
            console.error("Mpesa STK error:", text)
            return { error: "Failed to initiate Mpesa payment" }
        }

        const stkData = await stkRes.json() as { ResponseCode?: string; CustomerMessage?: string }

        if (stkData.ResponseCode !== "0") {
            return { error: stkData.CustomerMessage || "Mpesa payment request was not accepted" }
        }

        // Create order immediately with status PENDING (could be updated later on callback)
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                total,
                status: "PENDING", // Will be updated when Mpesa confirms via callback in a full implementation
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
        })

        // Clear cart after placing order
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        })

        revalidatePath("/profile")

        return {
            success: true,
            orderId: order.id,
            message: stkData.CustomerMessage || "Mpesa payment request sent. Check your phone to complete payment.",
        }
    } catch (error) {
        console.error("Mpesa payment error:", error)
        return { error: "Failed to process Mpesa payment" }
    }
}
