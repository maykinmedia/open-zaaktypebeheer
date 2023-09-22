// See https://stackoverflow.com/a/43595110 and https://stackoverflow.com/a/32749533
class ExtendableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.stack = new Error(message).stack;
  }
}

export class APIError extends ExtendableError {
  statusCode: number;
  detail: string;

  constructor(message: string, statusCode: number, detail: string) {
    super(message);
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

export class BadRequest extends APIError {}
export class NotAuthenticated extends APIError {}
export class PermissionDenied extends APIError {}
export class NotFound extends APIError {}
