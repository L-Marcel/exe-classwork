import { ApiError } from "next/dist/server/api-utils";

export class PermissionsNotMatchError extends ApiError {
  constructor() {
    super(401, "Permissions or events do not match what is needed.");
  };
};