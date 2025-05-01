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
import { createRoute, updateRoute } from '@/lib/api/monkeys';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Location, Route, RouteForm, routeFormSchema } from '@validation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface RouteDialogProps {
  isEdit?: boolean;
  route?: Route;
  existingRoutes: Route[];
  startLocation: Location;
}

const RouteDialog = ({
  isEdit = false,
  route,
  startLocation,
  existingRoutes,
}: RouteDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: locations = [] } = useLocations();

  const existingDestinationIds = existingRoutes.map(
    (route) => route.destinationLocation.id
  );

  const currentDestinationId = isEdit ? route?.destinationLocation.id : null;

  const possibleDestinations = locations.filter((loc) => {
    const isNotStart = loc.id !== startLocation.id;
    const isNotAlreadyUsed =
      !existingDestinationIds.includes(loc.id) ||
      loc.id === currentDestinationId;
    return isNotStart && isNotAlreadyUsed;
  });

  const defaultValues = {
    sourceLocation: {
      id: startLocation.id,
      name: startLocation.name,
    },
    destinationLocation: {
      id: undefined,
      name: '',
    },
    description: '',
    isAccessible: false,
  };

  const filledDefaultValues = (route: Route) => {
    return {
      ...route,
    };
  };

  const form = useForm<RouteForm>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: route ? filledDefaultValues(route) : defaultValues,
  });

  const createMutation = useMutation({
    mutationFn: createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setOpen(false);
      toast.success('Route was successfully added');
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: RouteForm) => updateRoute(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setOpen(false);
      toast.success('Route was successfully updated');
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  function onSubmit(values: RouteForm) {
    if (isEdit && route) {
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
      ? 'Updating Route...'
      : 'Update Route'
    : isPending
      ? 'Adding Route...'
      : 'Add Route';
  const dialogTitle = isEdit ? 'Edit Route' : 'Add New Route';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>{isEdit ? 'Edit Route' : 'Add Route'}</Button>
      </DialogTrigger>
      <DialogContent className='space-y-4'>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {/* Location Selects Side-by-Side */}
            <div className='flex items-end gap-4'>
              {/* Source Location (disabled) */}
              <FormItem className='w-full'>
                <FormLabel>From</FormLabel>
                <Input value={startLocation.name} disabled />
              </FormItem>

              <span className='text-xl mb-2'>→</span>

              {/* Destination Location */}
              <FormField
                control={form.control}
                name='destinationLocation'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>To</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        const selected = locations.find(
                          (l) => l.id === Number(val)
                        );
                        if (selected) field.onChange(selected);
                      }}
                      defaultValue={field.value?.id?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select destination' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {possibleDestinations.map((location) => (
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
                      Destination department for this route
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Field */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      rows={4}
                      className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                      placeholder='Describe the route...'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include landmarks and instructions.
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
};

export default RouteDialog;
