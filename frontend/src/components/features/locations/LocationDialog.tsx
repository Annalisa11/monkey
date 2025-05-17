import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import { DialogTitle } from '@radix-ui/react-dialog';

import { createLocation, updateLocation } from '@/lib/api/monkeys.api';
import { Location, LocationForm, locationFormSchema } from '@validation';

interface LocationDialogProps {
  isEdit?: boolean;
  location?: Location;
}

export function LocationDialog({
  isEdit = false,
  location,
}: LocationDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues: LocationForm = {
    name: '',
  };

  const filledDefaultValues = (location: Location) => ({
    name: location.name,
  });

  const form = useForm<LocationForm>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: location ? filledDefaultValues(location) : defaultValues,
  });

  const createMutation = useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location was successfully added');
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong');
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: LocationForm) => updateLocation(location!.id, values),
    onSuccess: () => {
      if (location) {
        queryClient.invalidateQueries({ queryKey: ['locations'] });
        queryClient.invalidateQueries({
          queryKey: ['routes'],
        });
        toast.success('Location was successfully updated');
        setOpen(false);
        form.reset();
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong');
      console.error(error);
    },
  });

  function onSubmit(values: LocationForm) {
    if (isEdit && location) {
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
      ? 'Updating Location...'
      : 'Update Location'
    : isPending
      ? 'Adding Location...'
      : 'Add Location';
  const dialogTitle = isEdit ? 'Edit Location' : 'Add New Location';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isEdit ? 'secondary' : 'default'}>
          {isEdit ? 'Edit Location' : 'Add Location'}
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
                    <Input placeholder='Enter location name' {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the location inside the hospital.
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
