"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

interface OrderSummaryProps {
    items: any[]
    total: number
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded border bg-muted">
                                {item.product.images[0] && (
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                                <span className="font-medium text-sm line-clamp-1">{item.product.name}</span>
                                <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                            </div>
                            <div className="flex flex-col justify-center items-end">
                                <span className="font-medium text-sm">
                                    {formatPrice(Number(item.product.price) * item.quantity)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
