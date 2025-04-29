import { Button } from '@/components/ui/button';
import { Location } from '@validation';
import { LocationDialog } from './LocationDialog';

type MonkeyItemProps = {
  location: Location;
  onDelete: () => void;
};

const LocationItem = ({ location, onDelete }: MonkeyItemProps) => {
  const { name } = location;

  return (
    <div className='flex justify-between border-2 border-amber-300 min-w-xl rounded-xl p-4 bg-[hsl(var(--card))]'>
      <div>
        <h2 className='font-bold text-lg'>{name}</h2>
      </div>

      <div className='flex justify-between items-end gap-2'>
        <LocationDialog isEdit location={location} />
        <Button variant='destructive' onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default LocationItem;
