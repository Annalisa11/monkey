import { Button } from '@/components/ui/button';
import { deleteRoute, getRoutes } from '@/lib/api/monkeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Location } from '@validation';
import { toast } from 'sonner';
import RouteDialog from '../paths/RouteDialog';
import RouteItem from '../paths/RouteItem';
import { LocationDialog } from './LocationDialog';

type MonkeyItemProps = {
  location: Location;
  onDelete: () => void;
};

const LocationItem = ({ location, onDelete }: MonkeyItemProps) => {
  const { name, id } = location;
  const queryClient = useQueryClient();

  const {
    data: routes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['routes', id, 'locations'],
    queryFn: () => getRoutes(id),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className='flex justify-between border-2 border-gray-200 min-w-xl rounded-xl p-4 bg-background flex-col'>
      <div className='flex flex-row w-full justify-between items-end '>
        <div className='flex gap-2 '>
          <h2 className='font-bold text-lg'>{name}</h2>
          <span className='text-gray-400'>{`id: ${id}`}</span>
        </div>

        <div className='flex gap-2 '>
          <LocationDialog isEdit location={location} />
          <Button variant='destructive' onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div>
        <RouteDialog startLocation={location} existingRoutes={routes} />
        <div className='flex flex-col gap-2 mt-6'>
          {isLoading && (
            <div className='p-4 text-muted-foreground'>Loading routes...</div>
          )}
          {isError && (
            <div className='p-4 text-red-500'>
              Error loading routes. Please try again.
            </div>
          )}
          {routes.map((route) => (
            <RouteItem
              routes={routes}
              route={route}
              key={`${route.sourceLocation.id}-${route.destinationLocation.id}`}
              onDelete={() =>
                deleteMutation.mutate({
                  startId: route.sourceLocation.id,
                  destinationId: route.destinationLocation.id,
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationItem;
