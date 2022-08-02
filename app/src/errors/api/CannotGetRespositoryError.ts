import { ApiError } from "next/dist/server/api-utils";

export class CannotGetRepositoryError extends ApiError {
  constructor(fullname: string) {
    super(403, `Can't get repository: ${fullname?.toLowerCase()}.`);
  };
};