export class CustomError extends Error {
  status: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status || 500;
  }
}
export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
  }
}
export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, 409);
  }
}
export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class SemanticError extends CustomError {
  constructor(message: string) {
    super(message, 422);
  }
}
