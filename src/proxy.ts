import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/tokenAndCookies";

/** Return the Next.js built-in not-found page without changing the URL */
function notFound(request: NextRequest) {
  return NextResponse.rewrite(new URL("/_not-found", request.url));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Only care about /admin routes ──────────────────────────────────────
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const user = verifyToken(request);

  // No token at all → show 404
  if (!user) {
    return notFound(request);
  }


  // Can't decode OR isAdmin is not true → show 404
  if (!user || user.isAdmin !== true) {
    return notFound(request);
  }

  // ✅ Verified admin → allow the request through
  return NextResponse.next();
}

/** Only run this proxy on /admin and its sub-routes */
export const config = {
  matcher: ["/admin/:path*"],
};
