import { StatsBarChart } from '@/components/features/stats/StatsBarChart';
import SummaryCard from '@/components/features/stats/SummaryCard';
import { getOverviewStats } from '@/lib/api/stats.api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { OverviewStats } from '@validation';

export const Route = createFileRoute('/')({
  component: DashboardSummary,
});

type SummaryData = {
  title: string;
  content: string;
  contentDescription: string;
};

function transformToSummaryData({
  qrCodesPrinted,
  qrCodesScanned,
  bananasReturned,
  monkeyInteractions,
  activeMonkeys,
  totalMonkeys,
  abandonedInteractionsStats,
}: OverviewStats): SummaryData[] {
  const { abandonmentRateBeforeQR } = abandonedInteractionsStats;
  return [
    {
      title: 'Total Interactions',
      content: monkeyInteractions.toString(),
      contentDescription: 'button presses in total',
    },
    {
      title: 'Active Monkeys',
      content: `${activeMonkeys}/${totalMonkeys}`,
      contentDescription: 'currently active monkeys',
    },
    {
      title: 'QR Codes Printed',
      content: qrCodesPrinted.toLocaleString(),
      contentDescription: 'total number of QR codes printed',
    },
    {
      title: 'AR Codes Scanned',
      content: qrCodesScanned.toLocaleString(),
      contentDescription: 'total QR codes scanned',
    },
    {
      title: 'Journeys Completed',
      content: bananasReturned.toLocaleString(),
      contentDescription: 'bananas returned',
    },
    {
      title: 'Abandonment Rate',
      content: `${abandonmentRateBeforeQR}%`,
      contentDescription: 'before QR code print',
    },
  ];
}

const transformToChartData = ({
  qrCodesPrinted,
  qrCodesScanned,
  bananasReturned,
}: OverviewStats) => {
  return [
    {
      metric: 'Printed',
      value: qrCodesPrinted,
    },
    {
      metric: 'Scanned',
      value: qrCodesScanned,
    },
    {
      metric: 'Returned',
      value: bananasReturned,
    },
  ];
};

function DashboardSummary() {
  const { data: overviewStats } = useQuery<OverviewStats>({
    queryKey: ['stats'],
    queryFn: getOverviewStats,
  });

  const summaryData = overviewStats
    ? transformToSummaryData(overviewStats)
    : [];

  const chartData = overviewStats ? transformToChartData(overviewStats) : [];

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
        <StatsBarChart
          xAxis={chartData}
          yAxis={overviewStats ? overviewStats.monkeyInteractions : 0}
        />
      </div>
    </div>
  );
}
