import { ApiError } from "next/dist/server/api-utils";

export class AlreadyLinkedError extends ApiError {
  constructor(linkedIn: string) {
    super(404, `Already linked in ${linkedIn}.`);
  };
};