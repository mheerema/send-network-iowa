import { NextRequest, NextResponse } from "next/server";

const HSTS = "max-age=63072000; includeSubDomains; preload";

/**
 * Apex -> www canonical redirect for sendnetworkiowa.com.
 *
 * This redirect lives in the app (not as a Vercel domain-level redirect) so the
 * response carries the full Strict-Transport-Security header, including
 * `includeSubDomains` and `preload`. Vercel's edge redirects are served before
 * the app runs and stamp only a bare `max-age` HSTS header, which fails the
 * hstspreload.org eligibility check. Keeping the redirect here is what makes
 * sendnetworkiowa.com eligible for the browser preload list.
 *
 * The .org / .net apex domains keep their Vercel-level redirects — they are not
 * being submitted to the preload list, so their bare HSTS header is fine.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";

  if (host === "sendnetworkiowa.com") {
    const url = req.nextUrl.clone();
    url.host = "www.sendnetworkiowa.com";
    const res = NextResponse.redirect(url, 308);
    res.headers.set("Strict-Transport-Security", HSTS);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
