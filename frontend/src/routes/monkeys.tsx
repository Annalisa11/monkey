import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AddMonkeyDialog } from '@/components/features/monkeys/AddMonkeyDialog';
import { getMonkeys, deleteMonkey } from '@/lib/api/monkeys';
import MonkeyItem from '@/components/features/monkeys/MonkeyItem';

export const Route = createFileRoute('/monkeys')({
  component: Monkeys,
});

function Monkeys() {
  const queryClient = useQueryClient();

  const {
    data: monkeys = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['monkeys'],
    queryFn: getMonkeys,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMonkey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monkeys'] });
      toast.success('Monkey deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className='bg-background p-6 rounded-3xl w-full'>
      <h1 className='text-2xl font-bold mb-4'>Monkeys</h1>
      <AddMonkeyDialog />
      <div className='flex flex-col gap-2 mt-6'>
        {isLoading && (
          <div className='p-4 text-muted-foreground'>Loading monkeys...</div>
        )}
        {isError && (
          <div className='p-4 text-red-500'>
            Error loading monkeys. Please try again.
          </div>
        )}
        {monkeys.map((monkey) => (
          <MonkeyItem
            {...monkey}
            key={monkey.id}
            onDelete={() => deleteMutation.mutate(monkey.id)}
            onEdit={() => console.log('edit')}
          />
        ))}
      </div>
    </div>
  );
}
