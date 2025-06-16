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

type StatsTableValue = string | number | boolean;

type StatsTableData<T extends Record<string, StatsTableValue>> = {
  tableHeaders: string[];
  tableRows: T[];
};

type StatsTableProps<T extends Record<string, StatsTableValue>> = {
  title: string;
  titleDescription?: string;
  data: StatsTableData<T>;
  contentDescription?: string;
};

const StatsTable = <T extends Record<string, StatsTableValue>>({
  title,
  titleDescription,
  data,
}: StatsTableProps<T>) => {
  return (
    <Card className='bg-background rounded-2xl shadow-none border-0 w-fit h-fit'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{titleDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {data.tableHeaders.map((tableHead, index) => (
                <TableHead
                  key={index}
                  className='font-bold uppercase w-[100px] last:text-right'
                >
                  {tableHead}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.tableRows.map((tableRow, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.values(tableRow).map((value, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className='w-[100px] last:text-right'
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StatsTable;
