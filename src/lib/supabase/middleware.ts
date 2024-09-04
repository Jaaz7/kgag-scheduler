import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function updateSession(request: NextRequest) {
  const supabase = createMiddlewareClient({
    req: request,
    res: NextResponse.next(),
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = request.nextUrl.clone();

  if (session) {
    return NextResponse.next();
  } else if (url.pathname !== "/") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
