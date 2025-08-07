import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define routes and roles
const roleRoutes: { [key: string]: string[] } = {
  admin: ["/admin"],
  agent: ["/agent"],
  merchant: ["/merchant"],
};

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const userRole = req.nextauth?.token?.role ;

    if (!userRole) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Check if the path matches a restricted role route
    for (const [role, paths] of Object.entries(roleRoutes)) {
      if (paths.some(path => pathname.startsWith(path))) {
        if (userRole !== role) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*", "/merchant/:path*"],
};
