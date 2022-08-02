import { ApiError } from "next/dist/server/api-utils";

export class ConflitLimitError extends ApiError {
  constructor(conflit: string) {
    super(409, "Many conflits on " + conflit);
  };
};