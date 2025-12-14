"use server"

import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/lib/validations/auth"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

export async function loginAction(data: LoginInput) {
    const result = loginSchema.safeParse(data)

    if (!result.success) {
        return { error: "Invalid fields" }
    }

    const { email, password } = result.data

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/profile",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error
    }
}

export async function registerAction(data: RegisterInput) {
    const result = registerSchema.safeParse(data)

    if (!result.success) {
        return { error: "Invalid fields" }
    }

    const { email, password, name } = result.data

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { error: "Email already in use!" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    })

    // TODO: Send verification email

    return { success: "User created!" }
}
