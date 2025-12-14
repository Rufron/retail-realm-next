"use client"

import { useState, useEffect } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createOrder } from "@/app/actions/checkout"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function CheckoutForm({ clientSecret }: { clientSecret: string }) {
    const stripe = useStripe()
    const elements = useElements()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [address, setAddress] = useState({
        name: "",
        line1: "",
        city: "",
        postal_code: "",
        country: "US",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsLoading(true)

        try {
            const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/success`,
                },
                redirect: "if_required",
            })

            if (paymentError) {
                toast.error(paymentError.message || "Payment failed")
                setIsLoading(false)
                return
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                const result = await createOrder(address, paymentIntent.id)
                if (result.error) {
                    toast.error(result.error)
                } else {
                    router.push("/checkout/success")
                }
            }
        } catch (error) {
            console.error(error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={address.name}
                            onChange={(e) => setAddress({ ...address, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={address.line1}
                            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input
                                id="zip"
                                value={address.postal_code}
                                onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PaymentElement />
                    <Button className="w-full mt-6" type="submit" disabled={isLoading || !stripe || !elements}>
                        {isLoading ? "Processing..." : "Pay Now"}
                    </Button>
                </CardContent>
            </Card>
        </form>
    )
}
