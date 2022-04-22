import { ApiError } from "next/dist/server/api-utils";

export class InvalidRequestError<T = any> extends ApiError {
  details: T;

  constructor(details: T) {
    super(400, "Invalid request.");
    this.details = details;
  };
};