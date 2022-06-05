import { NextRequest, NextResponse } from "next/server";
import { getMiddlewareRedirect } from "../../utils/middlewares/getMiddlewareRedirect";

export default async function middleware(req: NextRequest) {
  const token = req.cookies["token"];

  if(!req?.page) {
    return getMiddlewareRedirect(req, "/404");
  };
  
  const user = await fetch(`${process.env.NEXT_PUBLIC_URL}/user?token=${token}`, {
    method: "GET"
  }).then(res => res.json())
  .catch(() => false);

  if(user?.githubId && !user?.installationId) {
    return getMiddlewareRedirect(req, "/api/login");
  } else if(!token) {
    return getMiddlewareRedirect(req, "/");
  };

  return NextResponse.next();
};