import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validateRequest<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map(
        (e) => `${e.path.join('.')}: ${e.message}`
      );
      res.status(400).json({ error: errors.join(', ') });
      return;
    }

    req.body = result.data;
    next();
  };
}
