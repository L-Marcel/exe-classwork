import { ApiError } from "next/dist/server/api-utils";

export class UnauthorizedError extends ApiError {
  constructor() {
    super(401, "Unauthorized.");
  };
};