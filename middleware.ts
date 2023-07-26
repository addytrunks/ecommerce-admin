import { authMiddleware } from "@clerk/nextjs";

// Allows users to access GET requests
export default authMiddleware({
  publicRoutes:['/api/:path*']
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
