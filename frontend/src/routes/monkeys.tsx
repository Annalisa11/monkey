import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { createFileRoute } from '@tanstack/react-router';
import MonkeyItem from '@/components/features/MonkeyItem';

type Monkey = {
  id: string;
  name: string;
  location: string;
  ip: string;
  active: boolean;
};

const initialMonkeys: Monkey[] = [
  {
    id: '1',
    name: 'Chimpy',
    location: 'Hospital Entrance',
    ip: '192.168.0.2',
    active: true,
  },
];

export const Route = createFileRoute('/monkeys')({
  component: Monkeys,
});

function Monkeys() {
  const [monkeys, setMonkeys] = useState<Monkey[]>(initialMonkeys);

  const toggleStatus = (id: string) => {
    setMonkeys((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
  };

  const deleteMonkey = (id: string) => {
    setMonkeys((prev) => prev.filter((m) => m.id !== id));
  };

  const addMonkey = () => {};

  return (
    <div className='bg-background p-6 rounded-3xl w-full'>
      <h1>Monkeys</h1>
      <Button variant='default' onClick={}>
        Add Monkey
      </Button>
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

function EditMonkeyDialog({
  monkey,
  onSave,
}: {
  monkey: Monkey;
  onSave: (m: Monkey) => void;
}) {
  const [form, setForm] = useState(monkey);

  const handleChange = (key: keyof Monkey, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' variant='outline'>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className='space-y-4'>
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        <Label>Location</Label>
        <Input
          value={form.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />
        <Label>IP Address</Label>
        <Input
          value={form.ip}
          onChange={(e) => handleChange('ip', e.target.value)}
        />
        <Label>Active</Label>
        <Switch
          checked={form.active}
          onCheckedChange={(val) => handleChange('active', val)}
        />
        <Button onClick={() => onSave(form)}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
