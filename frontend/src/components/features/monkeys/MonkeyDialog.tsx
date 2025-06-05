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
import { useLocations } from '@/hooks/useLocations';
import { createMonkey, updateMonkey } from '@/lib/api/monkeys.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Monkey, MonkeyForm, monkeyFormSchema } from '@validation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface MonkeyDialogProps {
  isEdit?: boolean;
  monkey?: Monkey;
}

export function MonkeyDialog({
  isEdit = false,
  monkey = undefined,
}: MonkeyDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: locations = [] } = useLocations();

  const defaultValues = {
    name: '',
    location: { name: '', id: undefined },
    address: '',
    isActive: true,
  };

  const filledDefaultValues = (monkey: Monkey) => {
    return {
      name: monkey.name,
      location: { name: monkey.location.name, id: monkey.location.id },
      isActive: monkey.isActive,
    };
  };

  const form = useForm<MonkeyForm>({
    resolver: zodResolver(monkeyFormSchema),
    defaultValues: monkey ? filledDefaultValues(monkey) : defaultValues,
    mode: 'onChange',
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

  const updateMutation = useMutation({
    mutationFn: (values: MonkeyForm) => updateMonkey(monkey!.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monkeys'] });
      setOpen(false);
      toast.success('Monkey was successfully updated');
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  function onSubmit(values: MonkeyForm) {
    if (isEdit && monkey) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  }

  const isPending = isEdit
    ? updateMutation.isPending
    : createMutation.isPending;
  const buttonText = isEdit
    ? isPending
      ? 'Updating Monkey...'
      : 'Update Monkey'
    : isPending
      ? 'Adding Monkey...'
      : 'Add Monkey';
  const dialogTitle = isEdit ? 'Edit Monkey Robot' : 'Add New Monkey Robot';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>
          {isEdit ? 'Edit Monkey' : 'Add Monkey'}
        </Button>
      </DialogTrigger>
      <DialogContent className='space-y-4'>
        <DialogTitle>{dialogTitle}</DialogTitle>
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
              name='location.id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selectedId = Number(value);
                      const selectedLocation = locations.find(
                        (loc) => loc.id === selectedId
                      );

                      field.onChange(selectedId);
                      form.setValue(
                        'location.name',
                        selectedLocation?.name || ''
                      );
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select a location' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem
                          key={location.id}
                          value={location.id.toString()}
                        >
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Department name where a monkey stands or can direct people
                    to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isPending}>
              {buttonText}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
