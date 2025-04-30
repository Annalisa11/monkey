import { Button } from '@/components/ui/button';
import { Route } from '@validation';
import clsx from 'clsx';
import RouteDialog from './RouteDialog';

type RouteItemProps = {
  route: Route;
  onDelete: () => void;
};

const RouteItem = ({ route, onDelete }: RouteItemProps) => {
  const { sourceLocation, destinationLocation, description, isAccessible } =
    route;

  return (
    <div className='flex justify-between border-2 border-gray-200  min-w-xl rounded-xl p-4 bg-background'>
      <div>
        <div className='flex gap-2'>
          {`${sourceLocation.name} -> ${destinationLocation.name}`}{' '}
        </div>
        <div className='flex gap-2 items-center mt-1'>
          <div
            className={clsx(
              'w-3 h-3 rounded-full',
              isAccessible
                ? 'bg-green-400 text-green-500'
                : 'bg-red-400 text-red-400'
            )}
          />
          <small>{isAccessible ? 'accessible' : 'not accessible'}</small>
        </div>
        <p className='text-xs text-muted-foreground mt-2'>{description}</p>
      </div>

      <div className='flex justify-between items-end gap-2'>
        <RouteDialog
          isEdit
          route={route}
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
