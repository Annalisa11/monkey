import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createFileRoute } from '@tanstack/react-router';
import MonkeyItem from '@/components/features/MonkeyItem';
import { z } from 'zod';
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

type Monkey = {
  id: string;
  name: string;
  location: string;
  ip: string;
  active: boolean;
};

type MonkeyForm = z.infer<typeof monkeySchema>;

const initialMonkeys: Monkey[] = [
  {
    id: '1',
    name: 'Chimpy',
    location: 'Hospital Entrance',
    ip: '192.168.0.2',
    active: true,
  },
];

const monkeySchema = z.object({
  name: z.string().min(2).max(50),
  location: z.string(),
  ip: z.string().ip(),
  active: z.boolean(),
});

export const Route = createFileRoute('/monkeys')({
  component: Monkeys,
});

function Monkeys() {
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
    console.log(values);
  }

  const dialog = (
    <Dialog>
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
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className='bg-background p-6 rounded-3xl w-full'>
      <h1>Monkeys</h1>
      {dialog}
      <div className='flex gap-2 flex-col'>
        {initialMonkeys.map((monkey, i) => (
          <MonkeyItem
            {...monkey}
            onDelete={() => console.log('delete')}
            onEdit={() => console.log('edit')}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}
