import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createMonkey } from '@/lib/api/monkeys';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateMonkey, createMonkeySchema } from '@validation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function AddMonkeyDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CreateMonkey>({
    resolver: zodResolver(createMonkeySchema),
    defaultValues: {
      name: '',
      location: { name: '', id: 2 },
      address: '',
      isActive: true,
    },
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
      toast.error(error.message);
      console.log(error);
    },
  });

  function onSubmit(values: CreateMonkey) {
    createMutation.mutate(values);
  }

  return (
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
                    The name of the monkey robot
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='location.name'
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
                  <FormDescription>Where the monkey will stand</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input placeholder='149.234.1.1' {...field} />
                  </FormControl>
                  <FormDescription>The robot's IP address</FormDescription>
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
}
