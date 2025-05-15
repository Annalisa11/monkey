import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

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
  { location: 'Main Lobby', requests: 186 },
  { location: 'Radiology', requests: 80 },
  { location: 'Emergency Room', requests: 305 },
  { location: 'Optometrist', requests: 120 },
  { location: 'Orthopedics', requests: 73 },
];

const chartConfig = {
  requests: {
    label: 'Requests',
    color: 'hsl(var(--chart-1))',
  },
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig;

export function PopularLocationsChart() {
  return (
    <Card className='w-fit min-w-[1000px]'>
      <CardHeader>
        <CardTitle>Hospital Requests by Location</CardTitle>
        <CardDescription>Request data for hospital locations</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='max-h-[250px] w-full'>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey='location'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey='requests' type='number' hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Bar
              dataKey='requests'
              layout='vertical'
              fill='var(--color-desktop)'
              radius={4}
            >
              <LabelList
                dataKey='location'
                position='insideLeft'
                offset={8}
                className='fill-[--color-label]'
                fontSize={12}
              />
              <LabelList
                dataKey='requests'
                position='right'
                offset={8}
                className='fill-foreground'
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing requests by location for the current period
        </div>
      </CardFooter>
    </Card>
  );
}
