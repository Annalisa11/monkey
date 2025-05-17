import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type StatsBarChartData = {
  metric: string;
  value: number;
};

type StatsBarChartProps = {
  xAxis: StatsBarChartData[];
  yAxis: number;
};

const chartConfig = {
  value: {
    label: 'Count',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function StatsBarChart(data: StatsBarChartProps) {
  const chartData = data.xAxis;
  const totalInteractions = data.yAxis;

  const yAxisMax = totalInteractions;
  return (
    <Card className='w-fit min-w-min'>
      <CardHeader>
        <CardTitle>QR Code Analytics</CardTitle>
        <CardDescription>Performance Metrics Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='max-h-[250px] w-full'>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='metric'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              label={{
                value: 'Total Interactions',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
              axisLine={false}
              tickLine={false}
              domain={[0, yAxisMax]}
              ticks={[0, yAxisMax / 2, yAxisMax]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='value' fill='var(--color-desktop)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
