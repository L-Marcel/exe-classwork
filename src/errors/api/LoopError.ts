import { ApiError } from "next/dist/server/api-utils";

export class LoopError extends ApiError {
  constructor() {
    super(508, "Loop detected.");
  };
};