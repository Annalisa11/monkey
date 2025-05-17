import {
  and,
  avg,
  count,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  lte,
  sql,
} from 'drizzle-orm';
import {
  events,
  journeys,
  locations,
  monkeys,
  routes,
} from '../../db/schema.js';

import { alias } from 'drizzle-orm/sqlite-core';
import { calculatePercentage } from 'src/utils/calculations.js';
import {
  formatDate,
  formatDateToUnix,
  formatHourRange,
  formatTime,
  generateDateRange,
  generateWeekIntervals,
} from 'src/utils/datetime.js';
import { Monkey } from 'validation';
import db from '../../db/db.js';
import monkeyService from './monkeyService.js';

export interface OverviewMetrics {
  qrCodesPrinted: number;
  qrCodesScanned: number;
  bananasReturned: number;
  monkeyInteractions: number;
  activeMonkeys: number;
  totalMonkeys: number;
  abandonedInteractionsStats: AbandonedInteractionsStats;
}

export interface AbandonedInteractionsStats {
  total: number;
  abandonedBeforeQR: number;
  abandonmentRateBeforeQR: number;
  abandonedBeforeScan: number;
  abandonmentRateBeforeScan: number;
  scannedRate: number;
  qrPrintedPercentage: number;
  completedJourneys: number;
  completionRate: number;
}

export interface ActiveMonkeysStats {
  totalMonkeys: number;
  activeMonkeys: number;
  percentActive: number;
}

export interface JourneyCompletionFunnel {
  segments: {
    returnedJourneys: number;
    scannedOnly: number;
    printedOnly: number;
    interactionsWithoutPrint: number;
  };
  percentages: {
    returnedPercentage: number;
    scannedOnlyPercentage: number;
    printedOnlyPercentage: number;
    interactionsWithoutPrintPercentage: number;
  };
  stats: {
    totalInteractions: number;
    totalPrinted: number;
    scanRate: number;
    bananasReturnedRate: number;
  };
}

export interface RouteLocation {
  id: number;
  name: string;
}

export interface PopularRoute {
  routeId: number;
  qrGenerated: number;
  sourceLocation: RouteLocation;
  destinationLocation: RouteLocation;
}

export interface RouteEfficiencyMetric {
  routeId: number;
  qrGeneratedCount: number;
  qrScannedCount: number;
  avgScanTime: string;
  avgCompletionTime: string;
  scanRate: number;
  sourceLocation: RouteLocation;
  destinationLocation: RouteLocation;
}

export interface DailyTrend {
  date: string;
  buttonPresses: number;
  qrCodesGenerated: number;
  journeysCompleted: number;
}

export interface WeeklyTrend {
  weekStartDate: string;
  weekEndDate: string;
  buttonPresses: number;
  qrCodesGenerated: number;
  journeysCompleted: number;
}

export interface PeakHourAnalysis {
  hourRange: string;
  buttonPresses: number;
  qrCodesGenerated: number;
  percentageOfDailyTotal: number;
}

// TODO: match these types with the zod schemas in validation
export interface MonkeyOverviewData {
  monkey: Monkey;
  stats: {
    totalInteractions: number;
    qrCodesPrinted: number;
    qrCodesScanned: number;
  };
}
export interface StatsService {
  getOverviewMetrics(): Promise<OverviewMetrics>;
  getJourneyCompletionFunnel(): Promise<JourneyCompletionFunnel>;
  getPopularRoutesByQRGenerated(): Promise<PopularRoute[]>;
  getRouteEfficiencyMetrics(): Promise<RouteEfficiencyMetric[]>;
  getQrCodesPrintedCount(monkeyId?: number): Promise<number>;
  getQrCodesScannedCount(monkeyId?: number): Promise<number>;
  getBananasReturnedCount(): Promise<number>;
  getMonkeyInteractionsCount(monkeyId?: number): Promise<number>;
  getCompletedJourneysCount(): Promise<number>;
  getAbandonedInteractionsStats(): Promise<AbandonedInteractionsStats>;
  getActiveMonkeysStats(): Promise<ActiveMonkeysStats>;
  getDailyTrends(): Promise<DailyTrend[]>;
  getWeeklyTrends(): Promise<WeeklyTrend[]>;
  getPeakHoursAnalysis(): Promise<PeakHourAnalysis[]>;
  getWeekdayPeakHours(): Promise<any[]>;
  getMonkeyOverviewData(): Promise<MonkeyOverviewData[]>;
}

export const statsService: StatsService = {
  getMonkeyOverviewData: async (): Promise<MonkeyOverviewData[]> => {
    const monkeys = await monkeyService.getAllMonkeys();

    //TODO: think about the definition of interactions and if it's relevant to store the location of actions like scanned and printed.
    const overviewData = await Promise.all(
      monkeys.map(async (monkey) => {
        return {
          monkey: monkey,
          stats: {
            totalInteractions: await statsService.getMonkeyInteractionsCount(
              monkey.id
            ),
            qrCodesPrinted: await statsService.getQrCodesPrintedCount(
              monkey.id
            ),
            qrCodesScanned: await statsService.getQrCodesScannedCount(
              monkey.id
            ),
          },
        };
      })
    );

    return overviewData;
  },
  getOverviewMetrics: async (): Promise<OverviewMetrics> => {
    const qrCodesPrinted = await statsService.getQrCodesPrintedCount();
    const qrCodesScanned = await statsService.getQrCodesScannedCount();
    const bananasReturned = await statsService.getBananasReturnedCount();
    const monkeyInteractions = await statsService.getMonkeyInteractionsCount();
    const abandonedInteractionsStats =
      await statsService.getAbandonedInteractionsStats();
    const activeMonkeysStats = await statsService.getActiveMonkeysStats();

    return {
      qrCodesPrinted,
      qrCodesScanned,
      bananasReturned,
      monkeyInteractions,
      activeMonkeys: activeMonkeysStats.activeMonkeys,
      totalMonkeys: activeMonkeysStats.totalMonkeys,
      abandonedInteractionsStats,
    };
  },

  getJourneyCompletionFunnel: async (): Promise<JourneyCompletionFunnel> => {
    const totalInteractions = await statsService.getMonkeyInteractionsCount();
    const printed = await statsService.getQrCodesPrintedCount();
    const scanned = await statsService.getQrCodesScannedCount();
    const returned = await statsService.getBananasReturnedCount();

    const returnedJourneys = returned;
    const scannedOnly = scanned - returned;
    const printedOnly = printed - scanned;
    const interactionsWithoutPrint = totalInteractions - printed;

    const returnedPercentage = calculatePercentage(
      returnedJourneys,
      totalInteractions
    );
    const scannedOnlyPercentage = calculatePercentage(
      scannedOnly,
      totalInteractions
    );
    const printedOnlyPercentage = calculatePercentage(
      printedOnly,
      totalInteractions
    );
    const interactionsWithoutPrintPercentage = calculatePercentage(
      interactionsWithoutPrint,
      totalInteractions
    );

    const scanRate = calculatePercentage(scanned, printed);
    const bananasReturnedRate = calculatePercentage(returned, scanned);

    return {
      segments: {
        returnedJourneys,
        scannedOnly,
        printedOnly,
        interactionsWithoutPrint,
      },
      percentages: {
        returnedPercentage,
        scannedOnlyPercentage,
        printedOnlyPercentage,
        interactionsWithoutPrintPercentage,
      },
      stats: {
        totalInteractions,
        totalPrinted: printed,
        scanRate,
        bananasReturnedRate,
      },
    };
  },

  getPopularRoutesByQRGenerated: async (): Promise<PopularRoute[]> => {
    const sourceLocations = alias(locations, 'sourceLocations');
    const destinationLocations = alias(locations, 'destinationLocations');

    const qrGeneratedCountByRouteResult = await db
      .select({
        routeId: journeys.routeId,
        qrGenerated: count(journeys.qrToken),
        sourceLocation: {
          id: sourceLocations.id,
          name: sourceLocations.name,
        },
        destinationLocation: {
          id: destinationLocations.id,
          name: destinationLocations.name,
        },
      })
      .from(journeys)
      .leftJoin(routes, eq(routes.id, journeys.routeId))
      .leftJoin(
        sourceLocations,
        eq(sourceLocations.id, routes.sourceLocationId)
      )
      .leftJoin(
        destinationLocations,
        eq(destinationLocations.id, routes.destinationLocationId)
      )
      .where(isNotNull(journeys.qrGeneratedAt))
      .groupBy(
        journeys.routeId,
        routes.sourceLocationId,
        routes.destinationLocationId,
        sourceLocations.name,
        destinationLocations.name
      )
      .orderBy(desc(count(journeys.qrToken)))
      .execute();

    // TODO: look at this mess here
    const isValidRoute = (item: any): item is PopularRoute =>
      item.routeId !== null &&
      item.sourceLocation !== null &&
      item.destinationLocation !== null;

    const filteredItems: PopularRoute[] =
      qrGeneratedCountByRouteResult.filter(isValidRoute);

    return filteredItems;
  },

  getRouteEfficiencyMetrics: async (): Promise<RouteEfficiencyMetric[]> => {
    const sourceLocations = alias(locations, 'sourceLocations');
    const destinationLocations = alias(locations, 'destinationLocations');

    const metricsResult = await db
      .select({
        routeId: journeys.routeId,
        qrGeneratedCount: count(journeys.qrToken),
        qrScannedCount: count(journeys.qrScannedAt),
        avgScanTime: avg(
          sql`${journeys.qrScannedAt} - ${journeys.qrGeneratedAt}`
        ),
        avgCompletionTime: avg(
          sql`${journeys.endTime} - ${journeys.startTime}`
        ),
        sourceLocation: {
          id: sourceLocations.id,
          name: sourceLocations.name,
        },
        destinationLocation: {
          id: destinationLocations.id,
          name: destinationLocations.name,
        },
      })
      .from(journeys)
      .leftJoin(routes, eq(routes.id, journeys.routeId))
      .leftJoin(
        sourceLocations,
        eq(sourceLocations.id, routes.sourceLocationId)
      )
      .leftJoin(
        destinationLocations,
        eq(destinationLocations.id, routes.destinationLocationId)
      )
      .where(
        and(
          isNotNull(journeys.qrToken),
          isNotNull(journeys.qrScannedAt),
          eq(journeys.status, 'completed')
        )
      )
      .groupBy(journeys.routeId, sourceLocations.id, destinationLocations.id)
      .execute();

    console.log('Journeys time result: ', metricsResult);

    if (!metricsResult.length) return [];

    // TODO: same here. Check the typing
    const isValidMetric = (item: any): item is RouteEfficiencyMetric =>
      item.routeId !== null &&
      item.sourceLocation !== null &&
      item.destinationLocation !== null;

    const filteredItems: RouteEfficiencyMetric[] =
      metricsResult.filter(isValidMetric);

    return filteredItems.map((dataItem) => {
      const {
        qrGeneratedCount,
        qrScannedCount,
        avgScanTime,
        avgCompletionTime,
      } = dataItem;

      const scanRate = calculatePercentage(qrScannedCount, qrGeneratedCount);

      const formattedScanTime = formatTime(
        avgScanTime ? parseFloat(avgScanTime) : 0
      );
      const formattedCompletionTime = formatTime(
        avgCompletionTime ? parseFloat(avgCompletionTime) : 0
      );

      return {
        ...dataItem,
        scanRate,
        avgScanTime: formattedScanTime,
        avgCompletionTime: formattedCompletionTime,
      };
    });
  },

  getQrCodesPrintedCount: async (monkeyId?: number): Promise<number> => {
    const getQrCodesPrintedCountByMonkeyId = async (
      id: number
    ): Promise<number> => {
      const monkey = await monkeyService.getMonkeyById(id);

      if (!monkey) {
        throw new Error(`Monkey with ID ${id} not found`);
      }

      const result = await db
        .select({ count: count() })
        .from(journeys)
        .where(
          and(
            isNotNull(journeys.qrGeneratedAt),
            eq(journeys.startLocationId, monkey.location.id)
          )
        );

      return result[0].count;
    };

    if (monkeyId !== undefined) {
      return await getQrCodesPrintedCountByMonkeyId(monkeyId);
    }

    const result = await db
      .select({ count: count() })
      .from(journeys)
      .where(isNotNull(journeys.qrGeneratedAt));

    return result[0].count;
  },

  getQrCodesScannedCount: async (monkeyId?: number): Promise<number> => {
    const getQrCodesScannedCountByMonkeyId = async (
      id: number
    ): Promise<number> => {
      const monkey = await monkeyService.getMonkeyById(id);

      if (!monkey) {
        throw new Error(`Monkey with ID ${id} not found`);
      }

      const result = await db
        .select({ count: count() })
        .from(journeys)
        .where(
          and(
            isNotNull(journeys.qrScannedAt),
            eq(journeys.startLocationId, monkey.location.id)
          )
        );

      return result[0].count;
    };

    if (monkeyId !== undefined) {
      return await getQrCodesScannedCountByMonkeyId(monkeyId);
    }

    const result = await db
      .select({ count: count() })
      .from(journeys)
      .where(isNotNull(journeys.qrScannedAt));

    return result[0].count;
  },

  getBananasReturnedCount: async (): Promise<number> => {
    const result = await db
      .select({ count: count() })
      .from(events)
      .where(eq(events.eventType, 'banana_return'));

    return result[0].count;
  },

  getMonkeyInteractionsCount: async (monkeyId?: number): Promise<number> => {
    const getMonkeyInteractionsCountByMonkeyId = async (
      id: number
    ): Promise<number> => {
      const monkey = await monkeyService.getMonkeyById(id);

      if (!monkey) {
        throw new Error(`Monkey with ID ${id} not found`);
      }

      const result = await db
        .select({ count: count() })
        .from(journeys)
        .where(eq(journeys.startLocationId, monkey.location.id));

      return result[0].count;
    };

    if (monkeyId !== undefined) {
      return await getMonkeyInteractionsCountByMonkeyId(monkeyId);
    }

    const result = await db.select({ count: count() }).from(journeys);

    return result[0].count;
  },

  getCompletedJourneysCount: async (): Promise<number> => {
    const result = await db
      .select({ count: count() })
      .from(journeys)
      .where(eq(journeys.status, 'completed'));

    return result[0].count;
  },

  getAbandonedInteractionsStats:
    async (): Promise<AbandonedInteractionsStats> => {
      const [
        buttonPressesCount,
        printed,
        scanned,
        completedJourneysCount,
        totalJourneys,
      ] = await Promise.all([
        statsService.getMonkeyInteractionsCount(),
        statsService.getQrCodesPrintedCount(),
        statsService.getQrCodesScannedCount(),
        statsService.getCompletedJourneysCount(),
        db.select({ count: count() }).from(journeys),
      ]);

      const totalJourneysCount = totalJourneys[0].count;

      const qrPrintedPercentage = calculatePercentage(
        printed,
        totalJourneysCount
      );
      const scannedRate = calculatePercentage(scanned, printed);
      const abandonedBeforeScan = printed - scanned;
      const abandonmentRateBeforeScan = calculatePercentage(
        abandonedBeforeScan,
        printed
      );
      const abandonedBeforeQR = buttonPressesCount - printed;
      const abandonmentRateBeforeQR = calculatePercentage(
        abandonedBeforeQR,
        buttonPressesCount
      );
      const completionRate = calculatePercentage(
        completedJourneysCount,
        totalJourneysCount
      );

      return {
        total: totalJourneysCount,
        abandonedBeforeQR,
        abandonmentRateBeforeQR,
        abandonedBeforeScan,
        abandonmentRateBeforeScan,
        scannedRate,
        qrPrintedPercentage,
        completedJourneys: completedJourneysCount,
        completionRate,
      };
    },

  getActiveMonkeysStats: async (): Promise<ActiveMonkeysStats> => {
    const [total] = await db.select({ count: count() }).from(monkeys);

    const [active] = await db
      .select({ count: count() })
      .from(monkeys)
      .where(eq(monkeys.isActive, true));

    const percentActive = calculatePercentage(active.count, total.count);

    return {
      totalMonkeys: total.count,
      activeMonkeys: active.count,
      percentActive,
    };
  },

  getDailyTrends: async (): Promise<DailyTrend[]> => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      const formattedStartDate = formatDateToUnix(startDate);
      const formattedEndDate = formatDateToUnix(endDate);

      const buttonPressesQuery = db
        .select({
          date: sql`strftime('%Y-%m-%d', ${journeys.startTime}, 'unixepoch')`,
          count: count(),
        })
        .from(journeys)
        .where(
          and(
            gte(journeys.startTime, sql`${formattedStartDate}`),
            lte(journeys.startTime, sql`${formattedEndDate}`)
          )
        )
        .groupBy(sql`strftime('%Y-%m-%d', ${journeys.startTime}, 'unixepoch')`)
        .orderBy(sql`strftime('%Y-%m-%d', ${journeys.startTime}, 'unixepoch')`);

      const qrGeneratedQuery = db
        .select({
          date: sql`strftime('%Y-%m-%d', ${journeys.qrGeneratedAt}, 'unixepoch')`,
          count: count(),
        })
        .from(journeys)
        .where(
          and(
            isNotNull(journeys.qrGeneratedAt),
            gte(journeys.qrGeneratedAt, sql`${formattedStartDate}`),
            lte(journeys.qrGeneratedAt, sql`${formattedEndDate}`)
          )
        )
        .groupBy(
          sql`strftime('%Y-%m-%d', ${journeys.qrGeneratedAt}, 'unixepoch')`
        )
        .orderBy(
          sql`strftime('%Y-%m-%d', ${journeys.qrGeneratedAt}, 'unixepoch')`
        );

      const completedJourneysQuery = db
        .select({
          date: sql`strftime('%Y-%m-%d', ${journeys.endTime}, 'unixepoch')`,
          count: count(),
        })
        .from(journeys)
        .where(
          and(
            eq(journeys.status, 'completed'),
            isNotNull(journeys.endTime),
            gte(journeys.endTime, sql`${formattedStartDate}`),
            lte(journeys.endTime, sql`${formattedEndDate}`)
          )
        )
        .groupBy(sql`strftime('%Y-%m-%d', ${journeys.endTime}, 'unixepoch')`)
        .orderBy(sql`strftime('%Y-%m-%d', ${journeys.endTime}, 'unixepoch')`);

      const [buttonPressesResult, qrGeneratedResult, completedJourneysResult] =
        await Promise.all([
          buttonPressesQuery.execute(),
          qrGeneratedQuery.execute(),
          completedJourneysQuery.execute(),
        ]);

      console.log('Daily trends - button presses', buttonPressesResult);
      console.log('Daily trends - QR generated', qrGeneratedResult);
      console.log('Daily trends - completed journeys', completedJourneysResult);

      const dateRange = generateDateRange(startDate, endDate);

      return dateRange.map((date) => {
        const formattedDate = formatDate(date);

        const buttonPresses =
          buttonPressesResult.find((item) => item.date === formattedDate)
            ?.count || 0;

        const qrCodesGenerated =
          qrGeneratedResult.find((item) => item.date === formattedDate)
            ?.count || 0;

        const journeysCompleted =
          completedJourneysResult.find((item) => item.date === formattedDate)
            ?.count || 0;

        return {
          date: formattedDate,
          buttonPresses,
          qrCodesGenerated,
          journeysCompleted,
        };
      });
    } catch (error) {
      console.error('Error getting daily trends', error);
      throw new Error('Failed to retrieve daily trends data');
    }
  },

  getWeeklyTrends: async (): Promise<WeeklyTrend[]> => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 4 * 7);

      const formattedStartDate = formatDateToUnix(startDate);
      const formattedEndDate = formatDateToUnix(endDate);

      const buttonPressesQuery = db
        .select({
          week: sql`strftime('%Y-%W', ${journeys.startTime}, 'unixepoch')`,
          count: count(),
        })
        .from(journeys)
        .where(
          and(
            gte(journeys.startTime, sql`${formattedStartDate}`),
            lte(journeys.startTime, sql`${formattedEndDate}`)
          )
        )
        .groupBy(sql`strftime('%Y-%W', ${journeys.startTime}, 'unixepoch')`)
        .orderBy(sql`strftime('%Y-%W', ${journeys.startTime}, 'unixepoch')`);

      const qrGeneratedQuery = db
        .select({
          week: sql`strftime('%Y-%W', ${journeys.qrGeneratedAt}, 'unixepoch')`,
          count: count(),
        })
        .from(journeys)
        .where(
          and(
            isNotNull(journeys.qrGeneratedAt),
            gte(journeys.qrGeneratedAt, sql`${formattedStartDate}`),
            lte(journeys.qrGeneratedAt, sql`${formattedEndDate}`)
          )
        )
        .groupBy(sql`strftime('%Y-%W', ${journeys.qrGeneratedAt}, 'unixepoch')`)
        .orderBy(
          sql`strftime('%Y-%W', ${journeys.qrGeneratedAt}, 'unixepoch')`
        );

      const completedJourneysQuery = db
        .select({
          week: sql`strftime('%Y-%W', ${journeys.endTime}, 'unixepoch')`,
          count: count(),
        })
        .from(journeys)
        .where(
          and(
            eq(journeys.status, 'completed'),
            gte(journeys.endTime, sql`${formattedStartDate}`),
            lte(journeys.endTime, sql`${formattedEndDate}`)
          )
        )
        .groupBy(sql`strftime('%Y-%W', ${journeys.endTime}, 'unixepoch')`)
        .orderBy(sql`strftime('%Y-%W', ${journeys.endTime}, 'unixepoch')`);

      const [buttonPressesResult, qrGeneratedResult, completedJourneysResult] =
        await Promise.all([
          buttonPressesQuery.execute(),
          qrGeneratedQuery.execute(),
          completedJourneysQuery.execute(),
        ]);

      console.log('Weekly trends - button presses', buttonPressesResult);
      console.log(
        'Weekly trends - completed journeys',
        completedJourneysResult
      );
      console.log('Weekly trends - QR generated', qrGeneratedResult);

      const weekIntervals = generateWeekIntervals(startDate, endDate);

      return weekIntervals.map((weekInterval) => {
        const { startDate, endDate, yearWeek } = weekInterval;

        const buttonPresses =
          buttonPressesResult.find((item) => item.week === yearWeek)?.count ||
          0;

        const qrCodesGenerated =
          qrGeneratedResult.find((item) => item.week === yearWeek)?.count || 0;

        const journeysCompleted =
          completedJourneysResult.find((item) => item.week === yearWeek)
            ?.count || 0;

        return {
          weekStartDate: formatDate(startDate),
          weekEndDate: formatDate(endDate),
          buttonPresses,
          qrCodesGenerated,
          journeysCompleted,
        };
      });
    } catch (error) {
      console.error('Error getting weekly trends', error);
      throw new Error('Failed to retrieve weekly trends data');
    }
  },

  getPeakHoursAnalysis: async (): Promise<PeakHourAnalysis[]> => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const formattedStartDate = formatDateToUnix(thirtyDaysAgo);

      const totalButtonPressesQuery = db
        .select({
          count: count(),
        })
        .from(journeys)
        .where(gte(journeys.startTime, sql`${formattedStartDate}`));

      const hourlyButtonPressesQuery = db
        .select({
          hour: sql`strftime('%H', ${journeys.startTime}, 'unixepoch')`,
          count: count(),
        })
        .from(journeys)
        .where(gte(journeys.startTime, sql`${formattedStartDate}`))
        .groupBy(sql`strftime('%H', ${journeys.startTime}, 'unixepoch')`)
        .orderBy(desc(count()))
        .limit(5);

      const [totalResult, hourlyResult] = await Promise.all([
        totalButtonPressesQuery.execute(),
        hourlyButtonPressesQuery.execute(),
      ]);

      const totalButtonPresses = totalResult[0].count;

      const peakHours = hourlyResult.map((item) => item.hour);

      const qrGeneratedByHourQuery = db
        .select({
          hour: sql`strftime('%H', ${journeys.qrGeneratedAt}, 'unixepoch')`,
          count: count(),
        })
        .from(journeys)
        .where(
          and(
            isNotNull(journeys.qrGeneratedAt),
            gte(journeys.qrGeneratedAt, sql`${formattedStartDate}`),
            inArray(
              sql`strftime('%H', ${journeys.qrGeneratedAt}, 'unixepoch')`,
              peakHours
            )
          )
        )
        .groupBy(sql`strftime('%H', ${journeys.qrGeneratedAt}, 'unixepoch')`)
        .orderBy(desc(count()));

      const qrGeneratedByHourResult = await qrGeneratedByHourQuery.execute();

      console.log('Peak hours analysis - button presses', hourlyResult);
      console.log(
        'Peak hours analysis - QR generated',
        qrGeneratedByHourResult
      );

      return hourlyResult.map((hourData) => {
        const hour = hourData.hour;
        const buttonPresses = hourData.count;

        const qrCodesGenerated =
          qrGeneratedByHourResult.find((item) => item.hour === hour)?.count ||
          0;

        const percentageOfDailyTotal = calculatePercentage(
          buttonPresses,
          totalButtonPresses,
          1
        );

        const hourRange = formatHourRange(hour as string);

        return {
          hourRange,
          buttonPresses,
          qrCodesGenerated,
          percentageOfDailyTotal,
        };
      });
    } catch (error) {
      console.error('Error getting peak hours analysis', error);
      throw new Error('Failed to retrieve peak hours analysis data');
    }
  },

  // TODO: get rid of any type
  getWeekdayPeakHours: async (): Promise<any[]> => {
    try {
      const twelveWeeksAgo = new Date();
      twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 12 * 7);

      const formattedStartDate = formatDateToUnix(twelveWeeksAgo);

      const weekdayPeakHourQuery = db
        .select({
          weekday: sql`strftime('%w', ${journeys.startTime}, 'unixepoch')`,
          hour: sql`strftime('%H', ${journeys.startTime}, 'unixepoch')`,
          buttonPresses: count(),
        })
        .from(journeys)
        .where(gte(journeys.startTime, sql`${formattedStartDate}`))
        .groupBy(
          sql`strftime('%w', ${journeys.startTime}, 'unixepoch')`,
          sql`strftime('%H', ${journeys.startTime}, 'unixepoch')`
        )
        .orderBy(
          sql`strftime('%w', ${journeys.qrGeneratedAt}, 'unixepoch')`,
          desc(count())
        );

      const weekdayInteractionsCountQuery = db
        .select({
          weekday: sql`strftime('%w', ${journeys.startTime}, 'unixepoch')`,
          buttonPresses: count(),
        })
        .from(journeys)
        .where(gte(journeys.startTime, sql`${formattedStartDate}`))
        .groupBy(sql`strftime('%w', ${journeys.startTime}, 'unixepoch')`)
        .orderBy(
          sql`strftime('%w', ${journeys.startTime}, 'unixepoch')`,
          desc(count())
        );

      const weekdayQrGeneratedCountQuery = db
        .select({
          weekday: sql`strftime('%w', ${journeys.startTime}, 'unixepoch')`,
          qrGenerated: count(),
        })
        .from(journeys)
        .where(gte(journeys.startTime, sql`${formattedStartDate}`))
        .groupBy(sql`strftime('%w', ${journeys.qrGeneratedAt}, 'unixepoch')`)
        .orderBy(
          sql`strftime('%w', ${journeys.qrGeneratedAt}, 'unixepoch')`,
          desc(count())
        );

      const weekdayHourlyData = await weekdayPeakHourQuery.execute();
      const weekdayInteractionsCount =
        await weekdayInteractionsCountQuery.execute();
      const weekdayQrGeneratedCount =
        await weekdayQrGeneratedCountQuery.execute();

      console.log('Weekday hourly data', weekdayHourlyData);

      const qrGeneratedByWeekdayHourQuery = db
        .select({
          weekday: sql`strftime('%w', ${journeys.qrGeneratedAt}, 'unixepoch')`,
          hour: sql`strftime('%H', ${journeys.qrGeneratedAt}, 'unixepoch')`,
          count: count(),
        })
        .from(journeys)
        .where(
          and(
            isNotNull(journeys.qrGeneratedAt),
            gte(journeys.qrGeneratedAt, sql`${formattedStartDate}`)
          )
        )
        .groupBy(
          sql`strftime('%w', ${journeys.qrGeneratedAt}, 'unixepoch')`,
          sql`strftime('%H', ${journeys.qrGeneratedAt}, 'unixepoch')`
        )
        .orderBy(
          sql`strftime('%w', ${journeys.qrGeneratedAt}, 'unixepoch')`,
          desc(count())
        );

      const qrGeneratedByWeekdayHour =
        await qrGeneratedByWeekdayHourQuery.execute();

      const weekdays = [
        ...new Set(weekdayHourlyData.map((item) => item.weekday)),
      ];

      return weekdays.map((weekday) => {
        const weekdayData = weekdayHourlyData.filter(
          (item) => item.weekday === weekday
        );

        console.log('-> weekday data', weekdayData);
        weekdayData.sort((a, b) => b.buttonPresses - a.buttonPresses);

        console.log('-> weekday data sorted', weekdayData);

        const peakHourData = weekdayData[0];

        if (!peakHourData) {
          return {
            weekday,
            peakHourRange: 'No data',
            averageButtonPresses: 0,
            averageQrCodesGenerated: 0,
          };
        }

        const qrGeneratedData = qrGeneratedByWeekdayHour.find(
          (item) => item.weekday === weekday && item.hour === peakHourData.hour
        );

        const peakHourRange = formatHourRange(peakHourData.hour as string);

        const totalInteractionsData = weekdayInteractionsCount.find(
          (weekday) => peakHourData.weekday === weekday
        );
        const totalQrGeneratedData = weekdayQrGeneratedCount.find(
          (weekday) => peakHourData.weekday === weekday
        );
        const percentageOfDailyTotalInteractions = (
          peakHourData.buttonPresses /
          (totalInteractionsData?.buttonPresses || peakHourData.buttonPresses)
        ).toFixed(2);

        const averageQrCodesGenerated = Math.round(
          (qrGeneratedData?.count || 0) / 12
        );

        const percentageOfDailyTotalQrGenerated = (
          (qrGeneratedData?.count || 0) /
          (totalQrGeneratedData?.qrGenerated || peakHourData.buttonPresses)
        ).toFixed(2);

        return {
          weekday,
          peakHourRange,
          percentageOfDailyTotalInteractions,
          percentageOfDailyTotalQrGenerated,
        };
      });
    } catch (error) {
      console.error('Error getting weekday peak hours', error);
      throw new Error('Failed to retrieve weekday peak hours data');
    }
  },
};
