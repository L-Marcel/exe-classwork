import { NextRequest, NextResponse } from "next/server";

function getMiddlewareRedirect(req: NextRequest, path: string) {
  const url = req.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
};

export { getMiddlewareRedirect };