import { NextRequest, NextResponse } from "next/server";

function getMiddlewareRedirect(req: NextRequest, path: string) {
  const redirectTo = new URL(path, req.url);
  return NextResponse.redirect(redirectTo);
};

export { getMiddlewareRedirect };
