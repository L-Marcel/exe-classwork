import { ApiError } from "next/dist/server/api-utils";

export class CannotGetRepository extends ApiError {
  constructor(fullname: string) {
    super(400, `Can't get repository: ${fullname?.toLowerCase()}.`);
  };
};