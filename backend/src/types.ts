import { InferSelectModel } from 'drizzle-orm';
import { locations, monkeys, navigationQrCodes, routes } from '../db/schema.js';

// ---------------------------
// Base models from schema
// ---------------------------

export type MonkeyBase = InferSelectModel<typeof monkeys>;
export type Location = InferSelectModel<typeof locations>;
export type Route = InferSelectModel<typeof routes>;
export type NavigationQrCode = InferSelectModel<typeof navigationQrCodes>;

// ---------------------------
// Enums / constants
// ---------------------------

export type Emotion = 'concentrate' | 'smile' | 'laugh' | 'star';

// ---------------------------
// App-level domain models
// ---------------------------

export type Monkey = Omit<MonkeyBase, 'locationId'> & {
  location: Location;
};

// ---------------------------
// Service interfaces
// ---------------------------

export interface NavigationData {
  routeDescription: string;
  qrCode: string;
}

export interface NavigationRequest {
  currentLocation: Location;
  destinationLocationName: string;
  monkeyId: number;
}
