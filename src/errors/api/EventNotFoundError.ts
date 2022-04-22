import { ApiError } from "next/dist/server/api-utils";

export class EventNotFoundError extends ApiError {
  constructor() {
    super(404, "Event not found.");
  };
};