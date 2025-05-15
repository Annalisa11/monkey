import { StatsBarChart } from '@/components/features/stats/StatsBarChart';
import SummaryCard from '@/components/features/stats/SummaryCard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: DashboardSummary,
});

type SummaryData = {
  title: string;
  content: string;
  contentDescription: string;
};

const summaryData: SummaryData[] = [
  {
    title: 'Total Interactions',
    content: '1,238',
    contentDescription: 'button presses in total',
  },
  {
    title: 'Active Monkeys',
    content: '75',
    contentDescription: 'currently active monkeys',
  },
  {
    title: 'QR Codes Printed',
    content: '540',
    contentDescription: 'total number of QR codes printed',
  },
  {
    title: 'AR Codes Scanned',
    content: '432',
    contentDescription: 'total AR codes scanned',
  },
  {
    title: 'Journeys Completed',
    content: '320',
    contentDescription: 'bananas returned',
  },
  {
    title: 'Abandonment Rate',
    content: '18%',
    contentDescription: 'before QR code print',
  },
];

function DashboardSummary() {
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-xl font-bold mb-4 '> Metrics summary</h3>
      <div className=' rounded-3xl w-full grid gap-4 grid-cols-4'>
        {summaryData.map((data, index) => (
          <SummaryCard
            key={index}
            title={data.title}
            content={data.content}
            contentDescription={data.contentDescription}
          />
        ))}
      </div>
      <div className='w-fit col-span-2'>
        <StatsBarChart />
      </div>
    </div>
  );
}
