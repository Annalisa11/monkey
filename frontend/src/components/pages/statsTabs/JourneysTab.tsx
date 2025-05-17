import { JourneyInteractionsChart } from '@/components/features/stats/JourneyInteractionsChart';
import { PopularLocationsChart } from '@/components/features/stats/PopularLocationsChart';
import StatsTable from '@/components/features/stats/StatsTable';
import SummaryCard from '@/components/features/stats/SummaryCard';
import { Stats } from '@validation';

type JourneyAnalysisRowData = {
  route: string;
  qrGeneratedCount: number;
  qrScannedCount: number;
  scanRate: number;
  avgScanTime: string;
};

type JourneyAnalysisTableData = {
  tableHeaders: string[];
  tableRows: JourneyAnalysisRowData[];
};

type JourneysTabProps = {
  data: Stats;
};

const transformToJourneysAnalysisTableData = (
  data: Stats
): JourneyAnalysisTableData => {
  const tableRows = data.efficiencyTable.map(
    ({
      sourceLocation,
      destinationLocation,
      scanRate,
      qrScannedCount,
      avgScanTime,
      qrGeneratedCount,
    }) => ({
      route: `${sourceLocation.name} - ${destinationLocation.name}`,
      qrGeneratedCount,
      qrScannedCount,
      scanRate,
      avgScanTime,
    })
  );

  return {
    tableHeaders: [
      'Route',
      'QR Generated',
      'QR Scanned',
      'Scan Rate',
      'Avg Scan Time',
    ],
    tableRows,
  };
};

const JourneysTab = ({ data }: JourneysTabProps) => {
  const tableData = transformToJourneysAnalysisTableData(data);
  const { monkeyInteractions } = data;
  return (
    <div className='flex flex-col gap-4'>
      <div className=' rounded-3xl w-full grid gap-4 grid-cols-4'>
        <SummaryCard
          title='Total Interactions'
          content={monkeyInteractions.toString()}
          contentDescription={`button presses in total`}
        />
        <SummaryCard
          title='QR Codes Printed'
          content={data.qrCodesPrinted.toString()}
          contentDescription={`QR codes printed in total`}
        />
        <SummaryCard
          title='QR Codes Scanned'
          content={data.qrCodesScanned.toString()}
          contentDescription={`QR codes scanned in total`}
        />
        <SummaryCard
          title='Bananas Returned'
          content={data.bananasReturned.toString()}
          contentDescription={`bananas returned in total`}
        />
        <JourneyInteractionsChart />
        <PopularLocationsChart />
      </div>
      <StatsTable title={'Journeys Analysis'} data={tableData} />
    </div>
  );
};

export default JourneysTab;
