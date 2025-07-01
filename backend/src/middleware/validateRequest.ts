import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import logger from '../logger.js';

export function validateRequest<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    logger.info(`Validating ${req.method} ${req.path} request body`);
    if (!result.success) {
      const errors = result.error.errors.map(
        (e) => `${e.path.join('.')}: ${e.message}`
      );

      const errorMessage = errors.join(', ');

      logger.warn(
        `Validation failed for ${req.method} ${req.path}: ${errorMessage}`
      );
      logger.warn(`Invalid request body: ${JSON.stringify(req.body)}`);
      res
        .status(400)
        .json({ message: 'failed validation', error: errorMessage });
      return;
    }

    logger.info(`Validation successful for ${req.method} ${req.path}`);
    req.body = result.data;
    next();
  };
}
