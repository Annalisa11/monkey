import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validateRequest<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    console.log('Validating request body:', req.body);
    if (!result.success) {
      const errors = result.error.errors.map(
        (e) => `${e.path.join('.')}: ${e.message}`
      );
      res
        .status(400)
        .json({ message: 'failed validation', error: errors.join(', ') });
      return;
    }

    req.body = result.data;
    next();
  };
}
