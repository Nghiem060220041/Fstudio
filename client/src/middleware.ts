import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(request) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isIndexpage = request.nextUrl.pathname === "/";
    const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
    const isGuestRoute = guestRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

    if (!token && isAuthRoute) {
      const redirectUrl = new URL("/sign-in", request.url);
      redirectUrl.searchParams.set("callbackUrl", request.nextUrl.href);
      return NextResponse.redirect(redirectUrl);
    }

    if (token) {
      if (isGuestRoute) {
        return NextResponse.redirect(new URL("/admin/dashboards", request.url));
      }
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  },
);

const authRoutes = ["/admin"];
const guestRoutes = ["/forgot", "/reset", "/sign-in", "/sign-up"];
const publicRoutes = ["/", "/category", "/product"];