import { ApiError } from "next/dist/server/api-utils";

export class NotLinkedWithError extends ApiError {
  constructor(linkedIn: string) {
    super(400, `Not linked with ${linkedIn}.`);
  };
};