"use client";

import * as React from "react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

type DonutWithLabelPieChartsProps = {
  className?: string;
  label?: string;
  total?: number;
  value?: number;
  radius?: number;
  color?: string;
};

export function Component({
  label = "數目",
  total = 200,
  value = 180,
  radius = 80,
  color = "var(--chart-1)",
  className,
}: DonutWithLabelPieChartsProps) {
  const chartData = [{ browser: label, data: value, fill: color }];
  const startAngle = 90;
  const endAngle = startAngle - 360 * (value / total);
  const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
  const outerRadius = radius + 24;
  return (
    <ChartContainer
      config={{}}
      className={cn(
        "mx-auto aspect-square max-w-[200px] max-h-[200px]",
        className,
      )}
    >
      <RadialBarChart
        data={chartData}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={radius}
        outerRadius={outerRadius}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[radius + 5, radius - 5]}
        />
        <RadialBar
          dataKey="data"
          background
          cornerRadius={10}
          radius={radius}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 24}
                      className="fill-muted-foreground"
                    >
                      {value} / {total}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-xl font-bold"
                    >
                      {percentage} %
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {label}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}

export default Component;
