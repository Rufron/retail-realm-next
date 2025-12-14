"use client"

import { Button } from "@/components/ui/button"
import { addToCart } from "@/app/actions/cart"
import { useTransition } from "react"
import { toast } from "sonner"
import { ShoppingCart } from "lucide-react"

interface AddToCartButtonProps {
    productId: string
    className?: string
}

export function AddToCartButton({ productId, className }: AddToCartButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleAddToCart = () => {
        startTransition(async () => {
            const result = await addToCart(productId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Added to cart")
            }
        })
    }

    return (
        <Button
            onClick={handleAddToCart}
            disabled={isPending}
            className={className}
        >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isPending ? "Adding..." : "Add to Cart"}
        </Button>
    )
}
