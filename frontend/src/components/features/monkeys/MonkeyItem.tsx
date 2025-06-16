import { Button } from '@/components/ui/button';
import { Monkey } from '@validation';
import { MonkeyDialog } from './MonkeyDialog';

type MonkeyItemProps = {
  monkey: Monkey;
  onDelete: () => void;
};

const MonkeyItem = ({ monkey, onDelete }: MonkeyItemProps) => {
  const { name, location } = monkey;

  return (
    <div className='flex justify-between border-2 border-gray-200  min-w-xl rounded-xl p-4 bg-background'>
      <div>
        <h2 className='font-bold text-lg'>{name}</h2>
        <h3 className='text-sm'>{location.name}</h3>
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
