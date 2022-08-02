import { ApiError } from "next/dist/server/api-utils";

export class CannotGetCommitsError extends ApiError {
  constructor(fullname: string) {
    super(403, `Can't get commits of: ${fullname?.toLowerCase()}.`);
  };
};