import * as React from 'react';

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Label, Pie, PieChart } from 'recharts';

const chartData = [
  { interaction: 'Printed', count: 540, fill: 'var(--color-printed)' },
  { interaction: 'Scanned', count: 432, fill: 'var(--color-scanned)' },
  { interaction: 'Returned', count: 320, fill: 'var(--color-returned)' },
  {
    interaction: 'Button Presses',
    count: 1238,
    fill: 'var(--color-buttonPresses)',
  },
];

const totalInteractions = 1502;
const printedTotal = 1287;
const scanRate = ((printedTotal / totalInteractions) * 100).toFixed(1);
const verificationRate = ((432 / 1287) * 100).toFixed(1);

const chartConfig = {
  printed: {
    label: 'Printed',
    color: 'hsl(210, 80%, 50%)',
  },
  scanned: {
    label: 'Scanned',
    color: 'hsl(30, 90%, 60%)',
  },
  returned: {
    label: 'Returned',
    color: 'hsl(120, 50%, 60%)',
  },
  buttonPresses: {
    label: 'Button Presses',
    color: 'hsl(340, 80%, 85%)',
  },
} satisfies ChartConfig;

export function JourneyInteractionsChart() {
  const totalInteractions = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <Card className='w-fit'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Journey Interactions</CardTitle>
        <CardDescription>Total Journey Interactions</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px] min-h-[300px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='count'
              nameKey='interaction'
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalInteractions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Total Interactions
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey='interaction' />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex justify-center items-center gap-2 text-sm'>
        <div className='flex flex-col items-center'>
          <span className='font-medium text-base'>Total Interactions</span>
          <span className='text-lg'>{totalInteractions.toLocaleString()}</span>
        </div>
        <div className='flex flex-col items-center'>
          <span className='font-medium text-base'>Total Printed</span>
          <span className='text-lg'>{printedTotal.toLocaleString()}</span>
        </div>
        <div className='flex flex-col items-center'>
          <span className='font-medium text-base'>Scan Rate</span>
          <span className='text-lg'>{scanRate}%</span>
        </div>
        <div className='flex flex-col items-center'>
          <span className='font-medium text-base'>Verification Rate</span>
          <span className='text-lg'>{verificationRate}%</span>
        </div>
      </CardFooter>
    </Card>
  );
}
