import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/", "/home", "/concursos/:path*", "/api/webhooks(.*)"],
  // Routes that can be accessed by authenticated users with specific roles
  afterAuth(auth, req, evt) {
    // Handle route protection for dashboard
    if (req.nextUrl.pathname.startsWith("/dashboard") && !auth.userId) {
      const redirectUrl = new URL("/sign-in", req.url)
      redirectUrl.searchParams.set("redirect_url", req.url)
      return Response.redirect(redirectUrl)
    }

    // Check for admin role on dashboard access
    if (
      req.nextUrl.pathname.startsWith("/dashboard") &&
      auth.userId &&
      auth.sessionClaims?.metadata?.role !== "ADMIN"
    ) {
      return Response.redirect(new URL("/home", req.url))
    }
  },
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

