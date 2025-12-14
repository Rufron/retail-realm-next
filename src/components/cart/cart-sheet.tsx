"use client"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ShoppingCart } from "lucide-react"
import { CartItem } from "./cart-item"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { getCart } from "@/app/actions/cart"

export function CartSheet() {
    const [isOpen, setIsOpen] = useState(false)
    const [cart, setCart] = useState<any>(null)

    // Poll for cart updates or use a more sophisticated state management in real app
    // For now, we'll fetch on open
    useEffect(() => {
        if (isOpen) {
            getCart().then(setCart)
        }
    }, [isOpen])

    const itemCount = cart?.items.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0
    const total = cart?.items.reduce((acc: number, item: any) => acc + (Number(item.product.price) * item.quantity), 0) || 0

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs">
                            {itemCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="px-1">
                    <SheetTitle>My Cart ({itemCount})</SheetTitle>
                </SheetHeader>
                {cart?.items.length > 0 ? (
                    <>
                        <div className="flex-1 overflow-y-auto pr-6">
                            {cart.items.map((item: any) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                        <div className="space-y-4 pr-6 pt-4">
                            <div className="flex items-center justify-between text-lg font-medium">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
                                <Link href="/cart">
                                    Checkout
                                </Link>
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center space-y-2">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                        <span className="text-lg font-medium text-muted-foreground">
                            Your cart is empty
                        </span>
                        <Button variant="link" onClick={() => setIsOpen(false)} asChild>
                            <Link href="/products">
                                Start Shopping
                            </Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
