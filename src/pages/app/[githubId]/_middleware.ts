import { NextRequest, NextResponse } from "next/server";
import { getMiddlewareRedirect } from "../../../utils/middlewares/getMiddlewareRedirect";

export default async function middleware(req: NextRequest) {
  const token = req.cookies["token"];
  const { githubId } = req.page.params;
  
  const user = await fetch(`${process.env.NEXT_PUBLIC_URL}/user/${githubId}?token=${token}`, {
    method: "GET"
  }).then(res => res.json())
  .catch(() => false);

  if(user?.githubId && !user?.installationId) {
    return getMiddlewareRedirect(req, "/api/login");
  } else if(!user?.githubId || githubId !== user?.githubId || !githubId) {
    return getMiddlewareRedirect(req, "/");
  };

  return NextResponse.next();
};