import { z } from 'zod';
import { monkeySchema } from '../schemas/index.js';

export type Monkey = {
  id: number;
  name: string;
  location: Location;
  address: string;
  active: boolean;
  test: string;
};

export type Location = {
  name: string;
  id: number;
};

export type MonkeyForm = z.infer<typeof monkeySchema>;
