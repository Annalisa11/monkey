import { Button } from '@/components/ui/button';
import { Route } from '@validation';
import { MoveRight } from 'lucide-react';
import RouteDialog from './RouteDialog';

type RouteItemProps = {
  route: Route;
  routes: Route[];
  onDelete: () => void;
};

const RouteItem = ({ route, routes, onDelete }: RouteItemProps) => {
  const { sourceLocation, destinationLocation, description } = route;
  return (
    <div className='flex justify-between  min-w-xl  p-4 bg-background'>
      <div>
        <div className='flex gap-2'>
          {`${sourceLocation.name}`}
          <MoveRight />
          {destinationLocation.name}
        </div>

        <p className='text-xs text-muted-foreground mt-2'>{description}</p>
      </div>

      <div className='flex justify-between items-end gap-2'>
        <RouteDialog
          isEdit
          route={route}
          existingRoutes={routes}
          startLocation={route.sourceLocation}
        />
        <Button variant='destructive' onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default RouteItem;
