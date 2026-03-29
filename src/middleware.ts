import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/server-offline"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasCookie = request.cookies.has("AUTH");
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (!hasCookie && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasCookie && (pathname === "/login" || pathname === "/register")) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/auth`,
      {
        headers: { cookie: request.headers.get("cookie") ?? "" },
      },
    );

    if (res.ok) {
      return NextResponse.redirect(new URL("/rooms", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)" ],
};
