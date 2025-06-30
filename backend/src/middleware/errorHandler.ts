import { NextFunction, Request, Response } from 'express';

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`Error occurred: ${message}`);
  res.status(status).json({ error: message });
}

export default errorHandler;
