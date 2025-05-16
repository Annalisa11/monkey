'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  {
    date: '2025-04-15',
    buttonPresses: 10,
    qrCodesGenerated: 5,
    journeysCompleted: 3,
  },
  {
    date: '2025-04-16',
    buttonPresses: 15,
    qrCodesGenerated: 7,
    journeysCompleted: 4,
  },
  {
    date: '2025-04-17',
    buttonPresses: 25,
    qrCodesGenerated: 12,
    journeysCompleted: 6,
  },
  {
    date: '2025-04-18',
    buttonPresses: 20,
    qrCodesGenerated: 15,
    journeysCompleted: 8,
  },
  {
    date: '2025-04-19',
    buttonPresses: 30,
    qrCodesGenerated: 18,
    journeysCompleted: 10,
  },
  {
    date: '2025-04-20',
    buttonPresses: 35,
    qrCodesGenerated: 20,
    journeysCompleted: 12,
  },
  {
    date: '2025-04-21',
    buttonPresses: 40,
    qrCodesGenerated: 22,
    journeysCompleted: 15,
  },
  {
    date: '2025-04-22',
    buttonPresses: 50,
    qrCodesGenerated: 25,
    journeysCompleted: 18,
  },
  {
    date: '2025-04-23',
    buttonPresses: 60,
    qrCodesGenerated: 30,
    journeysCompleted: 20,
  },
  {
    date: '2025-04-24',
    buttonPresses: 55,
    qrCodesGenerated: 28,
    journeysCompleted: 19,
  },
  {
    date: '2025-04-25',
    buttonPresses: 70,
    qrCodesGenerated: 35,
    journeysCompleted: 25,
  },
  {
    date: '2025-04-26',
    buttonPresses: 75,
    qrCodesGenerated: 40,
    journeysCompleted: 28,
  },
  {
    date: '2025-04-27',
    buttonPresses: 85,
    qrCodesGenerated: 45,
    journeysCompleted: 30,
  },
  {
    date: '2025-04-28',
    buttonPresses: 90,
    qrCodesGenerated: 50,
    journeysCompleted: 35,
  },
  {
    date: '2025-04-29',
    buttonPresses: 95,
    qrCodesGenerated: 55,
    journeysCompleted: 40,
  },
  {
    date: '2025-04-30',
    buttonPresses: 100,
    qrCodesGenerated: 60,
    journeysCompleted: 45,
  },
];

const chartConfig = {
  buttonPresses: {
    label: 'Button Presses',
    color: 'hsl(210, 80%, 50%)',
  },
  qrCodesGenerated: {
    label: 'QR Codes Generated',
    color: 'hsl(330, 60%, 50%)',
  },
  journeysCompleted: {
    label: 'Journeys Completed',
    color: 'hsl(90, 80%, 50%)',
  },
} satisfies ChartConfig;

export function DailyTrendsChart() {
  return (
    <Card className='w-fit min-w-[1000px]'>
      <CardHeader>
        <CardTitle>Journey Interactions - Daily Trends</CardTitle>
        <CardDescription>April 2025 - May 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='max-h-[250px] w-full min-h-[20px] '
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                const day = date.getDate().toString().padStart(2, '0');
                const month = date.getMonth() + 1;
                return `${day}-${month < 10 ? '0' + month : month}`;
              }}
              ticks={chartData.map((entry) => entry.date)}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey='buttonPresses'
              type='monotone'
              stroke='var(--color-buttonPresses)'
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey='qrCodesGenerated'
              type='monotone'
              stroke='var(--color-qrCodesGenerated)'
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey='journeysCompleted'
              type='monotone'
              stroke='var(--color-journeysCompleted)'
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              Showing total journey interactions by type (Button Presses, QR
              Codes Generated, Journeys Completed)
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
