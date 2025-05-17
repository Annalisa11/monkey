import { API_URL } from '@/constants';
import type { OverviewStats } from '@validation';

export const getOverviewStats = async (): Promise<OverviewStats> => {
  const response = await fetch(`${API_URL}/v1/dashboard/overview`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get overview stats');
  }

  return response.json();
};
