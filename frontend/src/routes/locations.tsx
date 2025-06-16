import { LocationDialog } from '@/components/features/locations/LocationDialog';
import LocationItem from '@/components/features/locations/LocationItem';
import { useLocations } from '@/hooks/useLocations';
import { deleteLocation } from '@/lib/api/monkeys.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/locations')({
  component: Locations,
});

function Locations() {
  const queryClient = useQueryClient();

  const { data: locations = [], isLoading, isError } = useLocations();

  const deleteMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Location deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className='bg-background p-6 rounded-3xl w-full'>
      <h1 className='text-4xl font-bold mb-4'>Locations</h1>
      <LocationDialog />
      <div className='flex flex-col gap-2 mt-6'>
        {isLoading && (
          <div className='p-4 text-muted-foreground'>Loading locations...</div>
        )}
        {isError && (
          <div className='p-4 text-red-500'>
            Error loading locations. Please try again.
          </div>
        )}
        {locations.map((location) => (
          <LocationItem
            location={location}
            key={location.id}
            onDelete={() => deleteMutation.mutate(location.id)}
          />
        ))}
      </div>
    </div>
  );
}
