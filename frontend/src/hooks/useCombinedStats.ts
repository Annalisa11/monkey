import { getMainStats, getOverviewStats } from '@/lib/api/stats.api';
import { useQuery } from '@tanstack/react-query';
import { OverviewStats, Stats, StatsObject } from '@validation';

export const useCombinedStats = () => {
  const {
    data: mainStats,
    error: mainStatsError,
    isLoading: mainStatsLoading,
  } = useQuery<StatsObject>({
    queryKey: ['mainStats'],
    queryFn: getMainStats,
  });

  const {
    data: monkeysOverview,
    error: monkeysOverviewError,
    isLoading: monkeysOverviewLoading,
  } = useQuery<OverviewStats>({
    queryKey: ['stats'],
    queryFn: getOverviewStats,
  });

  const isLoading = mainStatsLoading || monkeysOverviewLoading;
  const error = mainStatsError || monkeysOverviewError;

  const combinedData: Stats | null =
    isLoading || error || !mainStats || !monkeysOverview
      ? null
      : {
          ...mainStats,
          ...monkeysOverview,
        };

  console.log('Combined data:', combinedData);
  console.log('Combined data - overview:', monkeysOverview);
  console.log('Combined data - all:', mainStats);
  return { data: combinedData, isLoading, error };
};
