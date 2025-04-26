import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createFileRoute } from '@tanstack/react-router';
import MonkeyItem from '@/components/features/MonkeyItem';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { MonkeyForm } from '@/lib/types';
import { monkeySchema } from '@/lib/schemas';
import { createMonkey, deleteMonkey, getMonkeys } from '@/lib/api/monkeys';

export const Route = createFileRoute('/monkeys')({
  component: Monkeys,
});

function Monkeys() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: monkeys = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['monkeys'],
    queryFn: getMonkeys,
  });

  const createMutation = useMutation({
    mutationFn: createMonkey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monkeys'] });
      setOpen(false);
      toast.success('Monkey was successfully added');
      form.reset();
    },
    onError: (error) => {
      console.log('hallo');
      toast.error(error.message);
      console.log(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMonkey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monkeys'] });
      toast.success('Monkey was successfully deleted');
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const form = useForm<MonkeyForm>({
    resolver: zodResolver(monkeySchema),
    defaultValues: {
      name: '',
      location: '',
      ip: '',
      active: true,
    },
  });

  function onSubmit(values: MonkeyForm) {
    createMutation.mutate(values);
  }

  const dialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>Add Monkey</Button>
      </DialogTrigger>
      <DialogContent className='space-y-4'>
        <DialogTitle>Add New Monkey Robot</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Chimpy' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of the new Monkey robot
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select a location' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Entrance'>Entrance</SelectItem>
                      <SelectItem value='Optometrist'>Optometrist</SelectItem>
                      <SelectItem value='Psych Ward'>Psych Ward</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The location the monkey will be standing at <br />
                    You can manage locations in the location
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ip'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input placeholder='149.234.1.1' {...field} />
                  </FormControl>
                  <FormDescription>
                    The IP address of the monkey robot you want to connect
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return <div>Loading monkeys...</div>;
  }

  if (isError) {
    return <div>Error loading monkeys. Please try again.</div>;
  }

  return (
    <div className='bg-background p-6 rounded-3xl w-full'>
      <h1>Monkeys</h1>
      {dialog}
      <div className='flex gap-2 flex-col'>
        {monkeys.map((monkey) => (
          <MonkeyItem
            {...monkey}
            onDelete={() => deleteMutation.mutate(monkey.id)}
            onEdit={() => console.log('edit')}
            key={monkey.id}
          />
        ))}
      </div>
    </div>
  );
}
