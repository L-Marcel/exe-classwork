import { ApiError } from "next/dist/server/api-utils";

export class CannotGetFileError extends ApiError {
  constructor(fullname: string) {
    super(403, `Can't get file of: ${fullname?.toLowerCase()}.`);
  };
};