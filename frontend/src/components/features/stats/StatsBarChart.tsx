'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { metric: 'Printed', value: 1287 },
  { metric: 'Scanned', value: 985 },
  { metric: 'Completed', value: 743 },
];

const chartConfig = {
  value: {
    label: 'Count',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function StatsBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Analytics</CardTitle>
        <CardDescription>Performance Metrics Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
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
              tickCount={1}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='value' fill='var(--color-desktop)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          QR Codes Printed has the highest count{' '}
          <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing key metrics for QR code engagement and journey completion
        </div>
      </CardFooter>
    </Card>
  );
}
