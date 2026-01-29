import { getCart } from "@/app/actions/cart"
import { CartItem } from "@/components/cart/cart-item"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Layout } from "@/components/layout/Layout"

export default async function CartPage() {
    const cart = await getCart()

    const itemCount = cart?.items.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0
    const total = cart?.items.reduce((acc: number, item: any) => acc + (Number(item.product.price) * item.quantity), 0) || 0

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {cart?.items.length > 0 ? (
                    <div className="grid gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-8">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="p-6">
                                    {cart.items.map((item: any) => (
                                        <div key={item.id} className="border-b last:border-0 last:pb-0 first:pt-0 py-6">
                                            <CartItem item={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-4">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 sticky top-24">
                                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <Button className="w-full" size="lg" asChild>
                                        <Link href="/checkout">
                                            Proceed to Checkout
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                        <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
                        <Button asChild className="mt-4">
                            <Link href="/products">
                                Start Shopping
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </Layout>
    )
}
