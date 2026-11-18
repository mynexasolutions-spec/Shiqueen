import { NextResponse, type NextRequest } from "next/server";

// Optimistic check only: bounce visitors without a session cookie straight to
// sign-in. Real authorization (valid session + admin role) is enforced on the
// server in every admin/account page, data function and Server Action.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("sq_session")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
