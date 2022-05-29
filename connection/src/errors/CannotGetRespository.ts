
export class CannotGetRepository extends Error {
  constructor(fullname: string) {
    super(`Can't get repository: ${fullname?.toLowerCase()}.`);
  };
};