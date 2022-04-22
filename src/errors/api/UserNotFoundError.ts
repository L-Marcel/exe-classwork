import { ApiError } from "next/dist/server/api-utils";

export class AuthUserNotFoundError extends ApiError {
  constructor() {
    super(401, "Authenticated user not found.");
  };
};