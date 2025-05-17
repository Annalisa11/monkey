import { z } from 'zod';
import {
  createMonkeySchema,
  CreateNavigationSchema,
  journeyStatsSchema,
  locationFormSchema,
  locationSchema,
  monkeySchema,
  monkeyStatsSchema,
  overviewStatsSchema,
  routeFormSchema,
  routeSchema,
  StoreButtonPressDataSchema,
  trendsStatsSchema,
  VerifyQRCodeSchema,
} from '../schemas/index.js';

export type Monkey = z.infer<typeof monkeySchema>;
export type CreateMonkey = z.infer<typeof createMonkeySchema>;

export type Location = z.infer<typeof locationSchema>;
export type LocationForm = z.infer<typeof locationFormSchema>;

export type StoreButtonPressData = z.infer<typeof StoreButtonPressDataSchema>;
export type CreateNavigationData = z.infer<typeof CreateNavigationSchema>;
export type VerifyQRCodeData = z.infer<typeof VerifyQRCodeSchema>;

export type RouteForm = z.infer<typeof routeFormSchema>;
export type Route = z.infer<typeof routeSchema>;

export type OverviewStats = z.infer<typeof overviewStatsSchema>;
export type JourneysStats = z.infer<typeof journeyStatsSchema>;
export type MonkeysStats = z.infer<typeof monkeyStatsSchema>;
export type TrendsStats = z.infer<typeof trendsStatsSchema>;
