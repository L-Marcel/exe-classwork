import { ApiError } from "next/dist/server/api-utils";

export class NotFoundError extends ApiError {
  constructor() {
    super(404, "Not found.");
  };
};