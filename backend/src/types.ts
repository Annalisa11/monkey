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

export type QRCodeData = {
  token: string;
  destinationId: number;
  journeyId: number;
};
export interface NavigationData {
  routeDescription: string;
  qrCode: QRCodeData;
}

export interface NavigationRequest {
  destinationLocationName: string;
  journeyId: number;
  monkeyId: number;
}
