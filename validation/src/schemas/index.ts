import { z } from 'zod';

export const locationSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
});

export const monkeySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  isActive: z.boolean(),
  address: z.string().ip(),
  location: locationSchema,
});

export const createMonkeySchema = monkeySchema.omit({ id: true });

export const locationFormSchema = locationSchema.omit({ id: true });

export const StoreButtonPressDataSchema = z.object({
  monkeyId: z.number().int().min(1),
  location: z.string().min(1),
});

export const CreateNavigationSchema = z.object({
  destinationLocationName: z.string().min(1),
});

export const VerifyQRCodeSchema = z.object({
  token: z.string().length(32),
  destinationId: z.number().int().min(1),
});
