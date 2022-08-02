import { ApiError } from "next/dist/server/api-utils";

export class GithubUnauthorizedError extends ApiError {
  constructor() {
    super(404, "Github server denied authorization.");
  };
};