"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getCart() {
    const session = await auth()

    if (!session?.user) {
        return null
    }

    const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: {
            items: {
                include: {
                    product: true,
                },
                orderBy: {
                    product: {
                        name: 'asc'
                    }
                }
            },
        },
    })

    if (!cart) {
        return null
    }

    // Convert Decimal to number for client components
    return {
        ...cart,
        items: cart.items.map((item) => ({
            ...item,
            product: {
                ...item.product,
                price: Number(item.product.price),
            },
        })),
    }
}

export async function addToCart(productId: string, quantity: number = 1) {
    const session = await auth()

    if (!session?.user) {
        return { error: "You must be logged in to add items to the cart" }
    }

    try {
        let cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
        })

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: session.user.id },
            })
        }

        // Check if product exists in local DB, if not sync it
        let product = await prisma.product.findUnique({
            where: { id: productId },
        })

        if (!product) {
            try {
                // Fetch from external API
                const response = await fetch(`https://dummyjson.com/products/${productId}`)
                if (!response.ok) throw new Error("Product not found in external API")
                const apiProduct = await response.json()

                // Create in local DB
                product = await prisma.product.create({
                    data: {
                        id: productId, // Use the same ID as API
                        name: apiProduct.title,
                        description: apiProduct.description,
                        price: apiProduct.price,
                        stock: apiProduct.stock,
                        images: apiProduct.images,
                        category: apiProduct.category,
                    },
                })
            } catch (error) {
                console.error("Failed to sync product:", error)
                return { error: "Failed to sync product data" }
            }
        }

        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: productId,
            },
        })

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            })
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: productId,
                    quantity: quantity,
                },
            })
        }

        revalidatePath("/cart")
        revalidatePath("/products")
        return { success: true }
    } catch (error) {
        console.error("Failed to add to cart:", error)
        return { error: "Failed to add item to cart" }
    }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
    const session = await auth()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    try {
        if (quantity <= 0) {
            await prisma.cartItem.delete({
                where: { id: itemId },
            })
        } else {
            await prisma.cartItem.update({
                where: { id: itemId },
                data: { quantity },
            })
        }

        revalidatePath("/cart")
        return { success: true }
    } catch (error) {
        return { error: "Failed to update cart" }
    }
}

export async function removeFromCart(itemId: string) {
    const session = await auth()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    try {
        await prisma.cartItem.delete({
            where: { id: itemId },
        })

        revalidatePath("/cart")
        return { success: true }
    } catch (error) {
        return { error: "Failed to remove item" }
    }
}
