import { z } from 'zod';

export const locationSchema = z.object({
  id: z
    .number({
      required_error: 'Location ID is required',
      invalid_type_error: 'Location ID must be a number',
    })
    .int()
    .positive({ message: 'Location ID must be a positive integer' }),
  name: z
    .string({
      required_error: 'Location name is required',
      invalid_type_error: 'Location name must be a string',
    })
    .min(1, { message: 'Location name must be at least 1 character' })
    .max(100, { message: 'Location name must not exceed 100 characters' }),
});

export const monkeySchema = z.object({
  id: z.number().int().positive(),
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, { message: 'Name must be at least 1 character long' })
    .max(100, { message: 'Name must not exceed 100 characters' }),
  isActive: z.boolean({
    required_error: 'Active status is required',
    invalid_type_error: 'Active must be a boolean',
  }),
  address: z
    .string({
      required_error: 'IP address is required',
      invalid_type_error: 'IP address must be a string',
    })
    .ip({ message: 'Please enter a valid IP address' }),
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
