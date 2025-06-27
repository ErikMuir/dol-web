import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: "/api/(.*)",
};

export function middleware(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  const referer = request.headers.get("referer") || request.headers.get("origin") || "";

  if (apiKey !== `${process.env.NEXT_PUBLIC_API_TOKEN}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!referer.startsWith(`${process.env.NEXT_PUBLIC_APP_URL}`)) {
    return new NextResponse(`Forbidden: ORIGIN=${referer}`, { status: 403 });
  }

  return NextResponse.next();
}
