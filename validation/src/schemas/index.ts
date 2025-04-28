import { z } from 'zod';

export const monkeySchema = z.object({
  name: z.string().min(2).max(50),
  location: z.string(),
  ip: z.string().ip(),
  active: z.boolean(),
  test: z.string(),
});
