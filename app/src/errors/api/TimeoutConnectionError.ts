import { ApiError } from "next/dist/server/api-utils";

export class TimeoutConnectionError extends ApiError {
  constructor() {
    super(408,  `Can't connect...`);
  };
};