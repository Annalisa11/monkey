import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/stats')({
  component: Stats,
});

function Stats() {
  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      <Card className='col-span-1'>
        <CardContent className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Total Interactions</h2>
          <p className='text-4xl font-bold'>1,238</p>
          <p className='text-sm text-muted-foreground mt-2'>
            So far today across all monkeys
          </p>
        </CardContent>
      </Card>

      <Card className='col-span-1'>
        <CardContent className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Bananas Redeemed</h2>
          <p className='text-4xl font-bold'>742 🍌</p>
          <p className='text-sm text-muted-foreground mt-2'>
            Kids redeemed rewards this week
          </p>
        </CardContent>
      </Card>

      <Card className='col-span-1'>
        <CardContent className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>QR Codes Printed</h2>
          <p className='text-4xl font-bold'>528</p>
          <p className='text-sm text-muted-foreground mt-2'>
            Sent from Monkey at Entrance
          </p>
        </CardContent>
      </Card>

      <Card className='col-span-2'>
        <CardContent className='p-6'>
          <h2 className='text-xl font-semibold mb-4'>Monkey Unit Status</h2>
          <div className='space-y-4'>
            <div>
              <p className='mb-1 font-medium'>Entrance Monkey</p>
              <Progress value={100} />
              <p className='text-sm text-muted-foreground mt-1'>
                All systems OK
              </p>
            </div>
            <div>
              <p className='mb-1 font-medium'>Ward Monkey</p>
              <Progress value={60} />
              <p className='text-sm text-muted-foreground mt-1'>
                Printer needs refill
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='col-span-1 bg-gradient-to-r from-blue-100 to-purple-200'>
        <CardContent className='p-6 flex flex-col justify-between h-full'>
          <div>
            <h2 className='text-lg font-semibold mb-2'>
              How to add new interactions?
            </h2>
            <p className='text-sm text-muted-foreground'>
              You can configure what the monkey says and prints by editing
              interaction scripts.
            </p>
          </div>
          <Button className='mt-6 w-full' variant='secondary'>
            View Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
