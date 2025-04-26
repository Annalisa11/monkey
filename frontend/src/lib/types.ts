import { z } from 'zod';
import { monkeySchema } from './schemas';

export type Monkey = {
  id: number;
  name: string;
  location: Location;
  address: string;
  active: boolean;
};

export type Location = {
  name: string;
  id: number;
};

export type MonkeyForm = z.infer<typeof monkeySchema>;
