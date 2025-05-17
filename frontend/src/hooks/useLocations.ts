import { getLocations } from '@/lib/api/monkeys.api';
import { useQuery } from '@tanstack/react-query';

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });
};
