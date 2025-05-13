import { InferSelectModel } from 'drizzle-orm';
import { locations, monkeys, routes } from '../db/schema.js';

// ---------------------------
// Database models infered from drizzle
// ---------------------------

export type DBMonkey = InferSelectModel<typeof monkeys>;
export type DBLocation = InferSelectModel<typeof locations>;
export type DBRoute = InferSelectModel<typeof routes>;

// ---------------------------
// Enums / constants
// ---------------------------

export type Emotion = 'concentrate' | 'smile' | 'laugh' | 'star';

export interface NavigationData {
  routeDescription: string;
  qrCode: string;
}

export interface NavigationRequest {
  destinationLocationName: string;
  journeyId: number;
  monkeyId: number;
}
