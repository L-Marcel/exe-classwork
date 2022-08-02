import { ApiError } from "next/dist/server/api-utils";

export class AuthUserNotFoundError extends ApiError {
  user: GithubUser;

  constructor(user?: GithubUser) {
    super(401, "Authenticated user not found.");
    this.user = user;
  };
};