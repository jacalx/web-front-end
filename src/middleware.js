import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Pages that require a signed-in user. Marketplace/browse/product pages
// stay public so anyone can look around before creating an account.
const isProtectedRoute = createRouteMatcher([
  "/sell(.*)",
  "/my-products(.*)",
  "/admin(.*)",
  "/profile(.*)",
  "/wishlist(.*)",
  "/notifications(.*)",
  "/chat(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
