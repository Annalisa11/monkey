import { NextFunction, Request, Response } from 'express';
import logger from '../logger.js'; // Add this import

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`${req.method} ${req.path} - ${message} (Status: ${status})`);

  if (status === 500) {
    logger.error(`Stack trace: ${err.stack}`);
  }

  res.status(status).json({ error: message });
}

export default errorHandler;
