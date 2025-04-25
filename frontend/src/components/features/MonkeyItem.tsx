import { Button } from '@/components/ui/button';
import clsx from 'clsx';

type MonkeyItemProps = {
  name: string;
  location: string;
  ip: string;
  active: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

const MonkeyItem = ({
  name,
  location,
  ip,
  active,
  onEdit,
  onDelete,
}: MonkeyItemProps) => {
  return (
    <div className='flex justify-between border-2 border-amber-300 min-w-xl rounded-xl p-4 bg-[hsl(var(--card))]'>
      <div>
        <h2 className='font-bold text-lg'>{name}</h2>
        <h3 className='text-sm'>{location}</h3>
        <div className='flex gap-2 items-center mt-1'>
          <div
            className={clsx(
              'w-3 h-3 rounded-full',
              active ? 'bg-green-400' : 'bg-red-400'
            )}
          />
          <small
            className={clsx(
              'uppercase text-xs font-medium',
              active ? 'text-green-500' : 'text-red-400'
            )}
          >
            {active ? 'active' : 'not active'}
          </small>
        </div>
        <p className='text-xs text-muted-foreground mt-2'>{ip}</p>
      </div>

      <div className='flex justify-between items-end gap-2'>
        <Button variant='secondary' onClick={onEdit}>
          Edit
        </Button>
        <Button variant='destructive' onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default MonkeyItem;
