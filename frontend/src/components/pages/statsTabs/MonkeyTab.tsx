import StatsTable from '@/components/features/stats/StatsTable';
import SummaryCard from '@/components/features/stats/SummaryCard';
import { calculatePercentage } from '@/lib/utils';
import { Stats } from '@validation';

type MonkeyInfoRowData = {
  id: number;
  name: string;
  location: string;
  totalInteractions: number;
  qrPrinted: number;
  qrScanned: number;
};

type MonkeyInfoTableData = {
  tableHeaders: string[];
  tableRows: MonkeyInfoRowData[];
};

type MonkeyTabProps = {
  data: Stats;
};

const transformToMonkeyInfoTableData = (data: Stats): MonkeyInfoTableData => {
  const tableRows = data.monkeysTable.map(({ monkey, stats }) => ({
    id: monkey.id,
    name: monkey.name,
    location: monkey.location.name,
    totalInteractions: stats.totalInteractions,
    qrPrinted: stats.qrCodesPrinted,
    qrScanned: stats.qrCodesScanned,
  }));

  return {
    tableHeaders: [
      'ID',
      'Name',
      'Location',
      'Total Interactions',
      'QR Printed',
      'QR Scanned',
    ],
    tableRows,
  };
};

const MonkeyTab = ({ data }: MonkeyTabProps) => {
  console.log('MonkeyTab data:', data);
  const tableData = transformToMonkeyInfoTableData(data);
  const { activeMonkeys, totalMonkeys } = data;
  return (
    <div className='flex flex-col gap-4'>
      <div className='w-full flex gap-4 flex-wrap'>
        <SummaryCard
          title='active monkeys'
          content={activeMonkeys.toString()}
          contentDescription={`of ${totalMonkeys} total monkeys (${calculatePercentage(activeMonkeys, totalMonkeys)}% active)`}
        />
      </div>
      <StatsTable
        title={'Monkey Information (DATA IS NOT ACCURATE)'}
        data={tableData}
      />
    </div>
  );
};

export default MonkeyTab;
