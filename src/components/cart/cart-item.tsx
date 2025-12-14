"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { updateCartItemQuantity, removeFromCart } from "@/app/actions/cart"
import { useTransition } from "react"
import { toast } from "sonner"
import { formatPrice } from "@/lib/utils"

interface CartItemProps {
    item: {
        id: string
        quantity: number
        product: {
            id: string
            name: string
            price: any // Decimal
            images: string[]
        }
    }
}

export function CartItem({ item }: CartItemProps) {
    const [isPending, startTransition] = useTransition()

    const handleUpdateQuantity = (newQuantity: number) => {
        startTransition(async () => {
            const result = await updateCartItemQuantity(item.id, newQuantity)
            if (result.error) {
                toast.error(result.error)
            }
        })
    }

    const handleRemove = () => {
        startTransition(async () => {
            const result = await removeFromCart(item.id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Item removed from cart")
            }
        })
    }

    return (
        <div className="flex gap-4 py-4">
            <div className="relative aspect-square h-20 w-20 min-w-fit overflow-hidden rounded-lg border bg-muted">
                {item.product.images[0] && (
                    <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                    />
                )}
            </div>
            <div className="flex flex-1 flex-col gap-1">
                <span className="font-medium">{item.product.name}</span>
                <span className="text-sm text-muted-foreground">
                    {formatPrice(Number(item.product.price))}
                </span>
                <div className="flex items-center gap-2 mt-auto">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.quantity - 1)}
                        disabled={isPending || item.quantity <= 1}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.quantity + 1)}
                        disabled={isPending}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto text-destructive hover:text-destructive"
                        onClick={handleRemove}
                        disabled={isPending}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
