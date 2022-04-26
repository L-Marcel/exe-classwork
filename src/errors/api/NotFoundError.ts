import { ApiError } from "next/dist/server/api-utils";

export class NotFoundError extends ApiError {
  constructor(instance?: string) {
    super(404, instance? `${instance} not found.`:"Not found.");
  };
};