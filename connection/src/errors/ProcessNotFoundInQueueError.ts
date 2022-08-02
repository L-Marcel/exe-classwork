export class ProcessNotFoundInQueueError extends Error {
  constructor(fullname: string) {
    super(`Process not found in queue: ${fullname?.toLowerCase()}.`);
  };
};