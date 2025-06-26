import { z } from 'zod';

export const locationSchema = z.object({
  id: z.number().int().positive(),
  name: z
    .string({
      required_error: 'Location name is required',
      invalid_type_error: 'Location name must be a string',
    })
    .min(1, { message: 'Location name must be at least 1 character' })
    .max(50, { message: 'Location name must not exceed 50 characters' }),
});

export const monkeySchema = z.object({
  id: z.number().int().positive(),
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, { message: 'Name must be at least 1 character long' })
    .max(50, { message: 'Name must not exceed 50 characters' }),
  isActive: z.boolean(),
  location: locationSchema,
});

export const monkeyFormSchema = monkeySchema.omit({ id: true });

export const locationFormSchema = locationSchema.omit({ id: true });

export const StoreButtonPressDataSchema = z.object({
  monkeyId: z.number().int().min(1),
  location: z.string().min(1),
});

export const CreateNavigationSchema = z.object({
  destinationLocationId: z.string().min(1),
});

export const VerifyQRCodeSchema = z.object({
  token: z.string().length(32),
  destinationId: z.number().int().min(1),
});

const baseRouteObject = z.object({
  id: z.number().int().positive(),
  sourceLocation: locationSchema,
  destinationLocation: locationSchema,
  description: z
    .string({ required_error: 'Description is required' })
    .min(1, { message: 'Description must be at least 1 character long' }),
  isAccessible: z.boolean().nullable(),
});

const routeRefinementFn = (data: {
  sourceLocation: { id: number };
  destinationLocation: { id: number };
}) => {
  return data.sourceLocation.id !== data.destinationLocation.id;
};

const routeRefinementOptions = {
  message: 'Source and destination must be different',
  path: ['destinationLocation.id'],
};

export const routeSchema = baseRouteObject.refine(
  routeRefinementFn,
  routeRefinementOptions
);

export const routeFormSchema = baseRouteObject
  .omit({ id: true })
  .refine(routeRefinementFn, routeRefinementOptions);

////////////// STATS TYPES //////////////

const abandonedInteractionsStatsSchema = z.object({
  total: z.number(),
  abandonedBeforeQR: z.number(),
  abandonmentRateBeforeQR: z.number(),
  abandonedBeforeScan: z.number(),
  abandonmentRateBeforeScan: z.number(),
  scannedRate: z.number(),
  qrPrintedPercentage: z.number(),
  completedJourneys: z.number(),
  completionRate: z.number(),
});

export const overviewStatsSchema = z.object({
  qrCodesPrinted: z.number(),
  qrCodesScanned: z.number(),
  bananasReturned: z.number(),
  monkeyInteractions: z.number(),
  activeMonkeys: z.number(),
  totalMonkeys: z.number(),
  abandonedInteractionsStats: abandonedInteractionsStatsSchema,
});

export const journeyStatsSchema = z.object({});
export const monkeyStatsSchema = z.object({});
export const trendsStatsSchema = z.object({});

const PiSchema = z.object({
  segments: z.object({
    returnedJourneys: z.number(),
    scannedOnly: z.number(),
    printedOnly: z.number(),
    interactionsWithoutPrint: z.number(),
  }),
  percentages: z.object({
    returnedPercentage: z.number(),
    scannedOnlyPercentage: z.number(),
    printedOnlyPercentage: z.number(),
    interactionsWithoutPrintPercentage: z.number(),
  }),
  stats: z.object({
    totalInteractions: z.number(),
    totalPrinted: z.number(),
    scanRate: z.number(),
    bananasReturnedRate: z.number(),
  }),
});

const BarSchema = z.object({
  routeId: z.number(),
  qrGenerated: z.number(),
  sourceLocation: locationSchema,
  destinationLocation: locationSchema,
});

const EfficiencyTableSchema = z.object({
  routeId: z.number(),
  qrGeneratedCount: z.number(),
  qrScannedCount: z.number(),
  avgScanTime: z.string(),
  avgCompletionTime: z.string(),
  sourceLocation: locationSchema,
  destinationLocation: locationSchema,
  scanRate: z.number(),
});

const DailyTrendsSchema = z.object({
  date: z.string(),
  buttonPresses: z.number(),
  qrCodesGenerated: z.number(),
  journeysCompleted: z.number(),
});

const WeeklyTrendsSchema = z.object({
  weekStartDate: z.string(),
  weekEndDate: z.string(),
  buttonPresses: z.number(),
  qrCodesGenerated: z.number(),
  journeysCompleted: z.number(),
});

const PeakHourSchema = z.object({
  hourRange: z.string(),
  buttonPresses: z.number(),
  qrCodesGenerated: z.number(),
  percentageOfDailyTotal: z.number(),
});

const WeekPeakHourSchema = z.object({
  weekday: z.string(),
  peakHourRange: z.string(),
  percentageOfDailyTotalInteractions: z.string(),
  percentageOfDailyTotalQrGenerated: z.string(),
});

const MonkeyOverviewDataSchema = z.object({
  monkey: monkeySchema,
  stats: z.object({
    totalInteractions: z.number(),
    qrCodesPrinted: z.number(),
    qrCodesScanned: z.number(),
  }),
});

export const StatsSchema = z.object({
  pi: PiSchema,
  bar: z.array(BarSchema),
  efficiencyTable: z.array(EfficiencyTableSchema),
  dailyTrends: z.array(DailyTrendsSchema),
  weeklyTrends: z.array(WeeklyTrendsSchema),
  peakHours: z.array(PeakHourSchema),
  weekPeakHours: z.array(WeekPeakHourSchema),
  monkeysTable: z.array(MonkeyOverviewDataSchema),
});
