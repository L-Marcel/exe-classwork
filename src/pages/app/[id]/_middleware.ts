import { NextRequest, NextResponse } from "next/server";
import { getMiddlewareRedirect } from "../../../utils/middlewares/getMiddlewareRedirect";

export default async function middleware(req: NextRequest) {
  const { id } = req.page.params;
  const token = req.cookies["token"];
  const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/auth?token=${token}`, {
    method: "GET"
  }).then(res => res.json())
  .catch(() => false);

  if(data?.user?.githubId && !data?.user?.installationId) {
    return getMiddlewareRedirect(req, "/api/login");
  } else if(!data?.user?.githubId || id !== data?.user?.githubId || !id) {
    return getMiddlewareRedirect(req, "/");
  };

  return NextResponse.next();
};