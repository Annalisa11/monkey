import { DailyTrendsChart } from '@/components/features/stats/DailyTrendsChart';
import StatsTable from '@/components/features/stats/StatsTable';
import { Stats } from '@validation';

type PeakHoursRowData = {
  hourRange: string;
  buttonPresses: number;
  qrCodesGenerated: number;
  percentageOfDailyTotal: number;
};

type PeakHoursTableData = {
  tableHeaders: string[];
  tableRows: PeakHoursRowData[];
};

type TrendsTabProps = {
  data: Stats;
};

const transformToPeakHoursTableData = (data: Stats): PeakHoursTableData => {
  const tableRows = data.peakHours.map(
    ({
      buttonPresses,
      hourRange,
      percentageOfDailyTotal,
      qrCodesGenerated,
    }) => ({
      hourRange,
      buttonPresses,
      qrCodesGenerated,
      percentageOfDailyTotal,
    })
  );

  return {
    tableHeaders: [
      'Hour Of Day',
      'Button Presses',
      'QR Codes Generated',
      '% of Daily Interactions',
    ],
    tableRows,
  };
};

const transformToWeeklyPeakHoursTableData = (data: Stats) => {
  return {
    tableHeaders: [
      'Weekday',
      'Peak Hour Range',
      '% of Daily Interactions',
      '% of Daily QR Generated',
    ],
    tableRows: data.weekPeakHours,
  };
};

// TODO: add weekly trends chart
// TODO: revisit the table data
const TrendsTab = ({ data }: TrendsTabProps) => {
  const tableData = transformToPeakHoursTableData(data);
  const weeklyTableData = transformToWeeklyPeakHoursTableData(data);
  return (
    <div className='flex flex-col gap-4'>
      <div className='w-full flex gap-4 flex-wrap'>
        <DailyTrendsChart />
      </div>
      <div className='w-full flex gap-4 flex-wrap'>
        <StatsTable title={'Peak Hours Analysis'} data={tableData} />
        <StatsTable
          title={'Weekly Peak Hours Analysis'}
          data={weeklyTableData}
        />
      </div>
    </div>
  );
};

export default TrendsTab;
