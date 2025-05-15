import SummaryCard from '@/components/features/stats/SummaryCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/stats')({
  component: Stats,
});

function Stats() {
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-xl font-bold mb-4 '> Statistics</h3>
      <Tabs defaultValue='account' className='w-full border border-amber-400'>
        <TabsList>
          <TabsTrigger value='monkeys'>Monkeys</TabsTrigger>
          <TabsTrigger value='locations'>Locations</TabsTrigger>
          <TabsTrigger value='trends'>Trends</TabsTrigger>
        </TabsList>
        <TabsContent value='monkeys'>
          <div className='flex flex-col gap-4'>
            <div className=' rounded-3xl w-full grid gap-4 grid-cols-4'>
              <SummaryCard
                title='active monkeys'
                content='2'
                contentDescription='currently active monkeys'
              />
              <SummaryCard
                title='inactive monkeys'
                content='1'
                contentDescription='currently not active monkeys'
              />
            </div>
            <Card className='bg-background rounded-2xl shadow-none border-0 w-fit'>
              <CardHeader>
                <CardTitle>Monkey Usage </CardTitle>
                <CardDescription>Interactions per Monkey</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className=''>
                      <TableHead className='font-bold uppercase  w-[100px]'>
                        Monkey
                      </TableHead>
                      <TableHead>Total Interactions</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className='text-right'>Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className='font-medium'>Bubbles</TableCell>
                      <TableCell className='w-[100px]'>287</TableCell>
                      <TableCell className='w-[100px]'>Main Lobby</TableCell>
                      <TableCell className='text-right w-[100px]'>
                        yes
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className='font-medium'>Bananas</TableCell>
                      <TableCell className='w-[100px]'>232</TableCell>
                      <TableCell className='w-[100px]'>Radiology</TableCell>
                      <TableCell className='text-right w-[100px]'>
                        yes
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value='locations'></TabsContent>
        <TabsContent value='trends'>Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
