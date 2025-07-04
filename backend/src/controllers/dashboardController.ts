import { RequestHandler } from 'express';
import { statsService } from '../services/statsService.js';

const getOverviewMetrics: RequestHandler = async (req, res) => {
  try {
    const metrics = await statsService.getOverviewMetrics();

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching overview metrics:', error);
    res.status(500);
  }
};

const test: RequestHandler = async (req, res) => {
  try {
    const pichart = await statsService.getJourneyCompletionFunnel();
    const barchart = await statsService.getPopularRoutesByQRGenerated();
    const efficiencyTable = await statsService.getRouteEfficiencyMetrics();
    const dailyTrends = await statsService.getDailyTrends();
    const weeklyTrends = await statsService.getWeeklyTrends();
    const peakHours = await statsService.getPeakHoursAnalysis();
    const weekPeakHours = await statsService.getWeekdayPeakHours();
    const monkeyTableStats = await statsService.getMonkeyOverviewData();

    res.status(200).json({
      pi: pichart,
      bar: barchart,
      efficiencyTable,
      dailyTrends,
      weeklyTrends,
      peakHours,
      weekPeakHours,
      monkeysTable: monkeyTableStats,
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500);
  }
};
export { getOverviewMetrics, test };
