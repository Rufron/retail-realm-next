"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createOrder, initiateMpesaPayment } from "@/app/actions/checkout"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type PaymentMethod = "card" | "mpesa"

export function CheckoutForm({ clientSecret }: { clientSecret: string }) {
    const stripe = useStripe()
    const elements = useElements()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
    const [address, setAddress] = useState({
        name: "",
        line1: "",
        city: "",
        postal_code: "",
        country: "KE",
    })
    const [mpesaPhone, setMpesaPhone] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setIsLoading(true)

        try {
            if (paymentMethod === "card") {
                if (!stripe || !elements) {
                    toast.error("Payment system not ready. Please try again.")
                    setIsLoading(false)
                    return
                }

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
            } else if (paymentMethod === "mpesa") {
                if (!mpesaPhone) {
                    toast.error("Please enter your Mpesa phone number")
                    setIsLoading(false)
                    return
                }

                const result = await initiateMpesaPayment(address, mpesaPhone)

                if (result.error) {
                    toast.error(result.error)
                } else {
                    toast.success(result.message || "Mpesa payment request sent. Check your phone.")
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
                            <Label htmlFor="zip">ZIP / Postal Code</Label>
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
                    <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RadioGroup
                        value={paymentMethod}
                        onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                        className="flex flex-col gap-3"
                    >
                        <div className="flex items-center space-x-3">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card">Card (Stripe)</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                            <RadioGroupItem value="mpesa" id="mpesa" />
                            <Label htmlFor="mpesa">Mpesa (Safaricom)</Label>
                        </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                        <div className="space-y-4">
                            <Label>Card Details</Label>
                            <PaymentElement />
                        </div>
                    )}

                    {paymentMethod === "mpesa" && (
                        <div className="space-y-2">
                            <Label htmlFor="mpesaPhone">Mpesa Phone Number (e.g. 2547XXXXXXXX)</Label>
                            <Input
                                id="mpesaPhone"
                                value={mpesaPhone}
                                onChange={(e) => setMpesaPhone(e.target.value)}
                                placeholder="2547XXXXXXXX"
                                required
                            />
                        </div>
                    )}

                    <Button
                        className="w-full mt-6"
                        type="submit"
                        disabled={isLoading || (paymentMethod === "card" && (!stripe || !elements))}
                    >
                        {isLoading ? "Processing..." : paymentMethod === "card" ? "Pay Now" : "Pay with Mpesa"}
                    </Button>
                </CardContent>
            </Card>
        </form>
    )
}
