import { Button } from '@/components/ui/button';
import { Location } from '@validation';
import { LocationDialog } from './LocationDialog';

type MonkeyItemProps = {
  location: Location;
  onDelete: () => void;
};

const LocationItem = ({ location, onDelete }: MonkeyItemProps) => {
  const { name, id } = location;

  return (
    <div className='flex justify-between border-2 border-gray-200 min-w-xl rounded-xl p-4 bg-[hsl(var(--card))]'>
      <div className='flex gap-2 '>
        <h2 className='font-bold text-lg'>{name}</h2>
        <span className='text-gray-400'>{`id: ${id}`}</span>
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
