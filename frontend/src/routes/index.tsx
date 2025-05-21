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
  const qrCodeData =
    '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\" shape-rendering=\"crispEdges\"><path fill=\"#ffffff\" d=\"M0 0h45v45H0z\"/><path stroke=\"#000000\" d=\"M4 4.5h7m4 0h5m3 0h7m1 0h1m2 0h7M4 5.5h1m5 0h1m2 0h3m6 0h3m1 0h2m6 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m1 0h1m1 0h3m1 0h2m1 0h2m2 0h2m1 0h1m2 0h1m2 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m1 0h13m2 0h1m1 0h4m1 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m1 0h2m2 0h3m3 0h1m3 0h4m4 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m1 0h1m1 0h3m1 0h1m1 0h1m2 0h3m2 0h1m2 0h1m2 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M12 11.5h1m1 0h1m2 0h1m1 0h1m2 0h2m2 0h1m1 0h2m2 0h1M4 12.5h1m1 0h5m6 0h1m1 0h1m2 0h2m1 0h1m2 0h5m1 0h5M4 13.5h2m1 0h1m3 0h1m1 0h3m1 0h1m1 0h4m1 0h1m1 0h1m4 0h1m2 0h1m1 0h4M4 14.5h1m2 0h2m1 0h2m4 0h1m5 0h2m1 0h1m1 0h1m2 0h1m1 0h1m2 0h1m3 0h2M6 15.5h1m1 0h1m2 0h1m1 0h3m1 0h1m2 0h2m2 0h3m4 0h2m3 0h3M4 16.5h1m1 0h1m1 0h3m3 0h1m2 0h1m2 0h1m1 0h1m6 0h1m1 0h1m2 0h3m3 0h1M5 17.5h3m1 0h1m4 0h1m3 0h2m1 0h2m2 0h6m1 0h1m7 0h1M4 18.5h4m1 0h2m2 0h4m3 0h2m2 0h3m1 0h1m2 0h4m1 0h2M6 19.5h1m4 0h1m1 0h7m1 0h2m3 0h2m1 0h1m1 0h4m5 0h1M4 20.5h1m1 0h1m2 0h3m4 0h2m1 0h2m2 0h1m2 0h1m3 0h2m1 0h1m1 0h4m1 0h1M4 21.5h1m1 0h3m4 0h1m5 0h1m1 0h2m1 0h1m4 0h1m3 0h2m1 0h2M4 22.5h1m2 0h1m2 0h1m1 0h1m1 0h1m2 0h4m2 0h1m1 0h1m1 0h1m3 0h2m1 0h2m4 0h1M4 23.5h2m6 0h2m2 0h1m2 0h1m1 0h1m3 0h1m4 0h2m3 0h1m1 0h3M4 24.5h1m3 0h1m1 0h3m1 0h1m1 0h2m1 0h2m1 0h2m2 0h4m2 0h1m1 0h1m1 0h1M4 25.5h1m1 0h1m1 0h2m1 0h1m3 0h1m2 0h3m1 0h4m1 0h1m1 0h2m2 0h1m4 0h2M4 26.5h2m2 0h1m1 0h1m1 0h2m2 0h2m4 0h5m4 0h1m2 0h1m1 0h1m1 0h1M6 27.5h1m2 0h1m1 0h4m2 0h3m5 0h2m2 0h1m3 0h4m3 0h1M6 28.5h1m1 0h1m1 0h3m1 0h1m1 0h4m2 0h2m5 0h1m1 0h2m3 0h3M4 29.5h2m6 0h1m1 0h3m2 0h3m1 0h3m1 0h2m1 0h1m5 0h1m2 0h1M4 30.5h1m4 0h2m1 0h4m1 0h1m5 0h1m1 0h3m1 0h1m2 0h1m2 0h1m3 0h2M4 31.5h1m2 0h2m3 0h1m3 0h3m1 0h2m3 0h1m2 0h1m2 0h2m1 0h1m3 0h3M4 32.5h1m3 0h1m1 0h1m2 0h3m4 0h1m1 0h3m1 0h2m1 0h2m1 0h6m1 0h1M12 33.5h1m1 0h2m1 0h3m1 0h2m2 0h1m1 0h2m2 0h2m3 0h3m1 0h1M4 34.5h7m4 0h1m1 0h2m1 0h2m3 0h2m5 0h1m1 0h1m1 0h1m1 0h1M4 35.5h1m5 0h1m1 0h1m5 0h2m1 0h2m3 0h1m2 0h1m2 0h1m3 0h1m3 0h1M4 36.5h1m1 0h3m1 0h1m1 0h1m1 0h1m5 0h1m4 0h1m2 0h1m2 0h8M4 37.5h1m1 0h3m1 0h1m1 0h3m1 0h1m2 0h1m1 0h2m2 0h4m3 0h1m1 0h1m1 0h1m1 0h3M4 38.5h1m1 0h3m1 0h1m1 0h1m1 0h1m2 0h4m2 0h1m3 0h1m3 0h1m1 0h1m1 0h1m4 0h1M4 39.5h1m5 0h1m2 0h4m2 0h1m1 0h1m3 0h1m2 0h1m1 0h1m1 0h4m2 0h1m1 0h1M4 40.5h7m1 0h2m1 0h3m1 0h2m1 0h1m1 0h2m1 0h9m3 0h2\"/></svg>\n';
  const encodedSvg = encodeURIComponent(qrCodeData);

  const full = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;

  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-xl font-bold mb-4 '> Statistics summary</h3>
      <img
        src={full}
        alt='QR Code'
        className='w-64 h-64 border border-amber-300'
      />
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
