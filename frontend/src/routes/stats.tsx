import JourneysTab from '@/components/pages/statsTabs/JourneysTab';
import MonkeyTab from '@/components/pages/statsTabs/MonkeyTab';
import TrendsTab from '@/components/pages/statsTabs/TrendsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCombinedStats } from '@/hooks/useCombinedStats';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/stats')({
  component: Stats,
});

function Stats() {
  const { data: allStats } = useCombinedStats();

  if (!allStats) {
    return <div>Loading...</div>;
  }

  console.log('Stats data:', allStats);
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-xl font-bold mb-4 '> Statistics</h3>
      <Tabs defaultValue='monkeys' className='w-full'>
        <TabsList>
          <TabsTrigger value='monkeys'>Monkeys</TabsTrigger>
          <TabsTrigger value='journeys'>Journeys</TabsTrigger>
          <TabsTrigger value='trends'>Trends</TabsTrigger>
        </TabsList>
        <TabsContent value='monkeys'>
          <MonkeyTab data={allStats} />
        </TabsContent>
        <TabsContent value='journeys'>
          <JourneysTab data={allStats} />
        </TabsContent>
        <TabsContent value='trends'>
          <TrendsTab data={allStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
