import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = Boolean(req.auth);
  const isLocalBypass =
    process.env.NODE_ENV === "development" &&
    process.env.AUTH_BYPASS_LOCAL === "true";

  if (!isLoggedIn && !isLocalBypass) {
    const forwardedProto = req.headers.get("x-forwarded-proto");
    const forwardedHost =
      req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    const origin =
      forwardedProto && forwardedHost
        ? `${forwardedProto}://${forwardedHost}`
        : req.nextUrl.origin;

    const signInUrl = new URL("/api/auth/signin", origin);
    const callbackUrl = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    signInUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon\\.ico).*)"],
};