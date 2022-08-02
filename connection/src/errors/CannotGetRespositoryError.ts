
export class CannotGetRepositoryError extends Error {
  constructor(fullname: string) {
    super(`Can't get repository: ${fullname?.toLowerCase()}.`);
  };
};