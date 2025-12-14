import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground max-w-md">
                Thank you for your purchase. Your order has been received and is being processed. You can view your order details in your profile.
            </p>
            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/profile">
                        View Orders
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/products">
                        Continue Shopping
                    </Link>
                </Button>
            </div>
        </div>
    )
}
