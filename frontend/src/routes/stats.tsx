import { DailyTrendsChart } from '@/components/features/stats/DailyTrendsChart';
import { JourneyInteractionsChart } from '@/components/features/stats/JourneyInteractionsChart';
import { PopularLocationsChart } from '@/components/features/stats/PopularLocationsChart';
import StatsTable from '@/components/features/stats/StatsTable';
import SummaryCard from '@/components/features/stats/SummaryCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/stats')({
  component: Stats,
});

const tableData = {
  tableHeaders: ['Name', 'Location', 'Status', 'Last Interaction'],
  tableRows: [
    {
      name: 'Monkey 1',
      location: 'Main Lobby',
      status: 'Active',
      lastInteraction: '2023-10-01 12:00',
    },
    {
      name: 'Monkey 2',
      location: 'Radiology',
      status: 'Inactive',
      lastInteraction: '2023-10-01 12:00',
    },
    {
      name: 'Monkey 3',
      location: 'Emergency Room',
      status: 'Active',
      lastInteraction: '2023-10-01 12:00',
    },
  ],
};

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
            <StatsTable title={'table title'} data={tableData} />
          </div>
        </TabsContent>
        <TabsContent value='locations'>
          <div className='flex flex-col gap-4'>
            <PopularLocationsChart />
            <JourneyInteractionsChart />
            <DailyTrendsChart />
          </div>
        </TabsContent>
        <TabsContent value='trends'>Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
