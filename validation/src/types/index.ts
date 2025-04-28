import { z } from 'zod';
import {
  createMonkeySchema,
  CreateNavigationSchema,
  locationSchema,
  monkeySchema,
  StoreButtonPressDataSchema,
  updateMonkeySchema,
  VerifyQRCodeSchema,
} from '../schemas/index.js';

export type Monkey = z.infer<typeof monkeySchema>;
export type CreateMonkey = z.infer<typeof createMonkeySchema>;
export type UpdateMonkey = z.infer<typeof updateMonkeySchema>;

export type Location = z.infer<typeof locationSchema>;

export type StoreButtonPressData = z.infer<typeof StoreButtonPressDataSchema>;
export type CreateNavigationData = z.infer<typeof CreateNavigationSchema>;
export type VerifyQRCodeData = z.infer<typeof VerifyQRCodeSchema>;
