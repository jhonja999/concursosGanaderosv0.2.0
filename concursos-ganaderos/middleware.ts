import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Función para identificar rutas protegidas
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Si la ruta es protegida, verifica la autenticación del usuario
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Ignora archivos estáticos y rutas internas de Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre ejecuta el middleware para rutas API
    '/(api|trpc)(.*)',
  ],
};