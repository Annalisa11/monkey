import { InferSelectModel } from 'drizzle-orm';
import { Location } from 'validation';
import { locations, monkeys, navigationQrCodes, routes } from '../db/schema.js';

// ---------------------------
// Database models infered from drizzle
// ---------------------------

export type DBMonkey = InferSelectModel<typeof monkeys>;
export type DBLocation = InferSelectModel<typeof locations>;
export type DBRoute = InferSelectModel<typeof routes>;
export type DBNavigationQrCode = InferSelectModel<typeof navigationQrCodes>;

// ---------------------------
// Enums / constants
// ---------------------------

export type Emotion = 'concentrate' | 'smile' | 'laugh' | 'star';

export interface NavigationData {
  routeDescription: string;
  qrCode: string;
}

export interface NavigationRequest {
  currentLocation: Location;
  destinationLocationName: string;
  monkeyId: number;
}
