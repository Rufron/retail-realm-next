"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateProfileSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
})

export async function updateProfileAction(data: z.infer<typeof updateProfileSchema>) {
    const session = await auth()

    if (!session || !session.user) {
        return { error: "Unauthorized" }
    }

    const result = updateProfileSchema.safeParse(data)

    if (!result.success) {
        return { error: "Invalid fields" }
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: result.data.name,
                email: result.data.email,
            },
        })

        revalidatePath("/profile")
        return { success: "Profile updated!" }
    } catch (error) {
        return { error: "Something went wrong!" }
    }
}
