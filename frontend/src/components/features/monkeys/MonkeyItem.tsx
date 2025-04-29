import { Button } from '@/components/ui/button';
import { Monkey } from '@validation';
import clsx from 'clsx';
import { MonkeyDialog } from './MonkeyDialog';

type MonkeyItemProps = {
  monkey: Monkey;
  onDelete: () => void;
};

const MonkeyItem = ({ monkey, onDelete }: MonkeyItemProps) => {
  const { name, location, address, isActive } = monkey;

  return (
    <div className='flex justify-between border-2 border-gray-200  min-w-xl rounded-xl p-4 bg-background'>
      <div>
        <h2 className='font-bold text-lg'>{name}</h2>
        <h3 className='text-sm'>{location.name}</h3>
        <div className='flex gap-2 items-center mt-1'>
          <div
            className={clsx(
              'w-3 h-3 rounded-full',
              isActive ? 'bg-green-400' : 'bg-red-400'
            )}
          />
          <small
            className={clsx(
              'uppercase text-xs font-medium',
              isActive ? 'text-green-500' : 'text-red-400'
            )}
          >
            {isActive ? 'active' : 'not active'}
          </small>
        </div>
        <p className='text-xs text-muted-foreground mt-2'>{address}</p>
      </div>

      <div className='flex justify-between items-end gap-2'>
        <MonkeyDialog isEdit monkey={monkey} />
        <Button variant='destructive' onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default MonkeyItem;
