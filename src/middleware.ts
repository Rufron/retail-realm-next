import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname.startsWith("/profile") || req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/checkout")
    const isOnAuth = req.nextUrl.pathname.startsWith("/auth")

    if (isOnDashboard) {
        if (isLoggedIn) return void 0
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl))
    }

    if (isOnAuth) {
        if (!isLoggedIn) return void 0
        return NextResponse.redirect(new URL("/profile", req.nextUrl))
    }

    return void 0
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
