export class CvDataNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CvDataNotFoundError";
  }
}

export function isCvDataNotFoundError(error: unknown): error is CvDataNotFoundError {
  return error instanceof CvDataNotFoundError;
}
