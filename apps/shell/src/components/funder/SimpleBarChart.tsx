'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SimpleBarChartProps {
  data?: number[];
  className?: string;
}

export function SimpleBarChart({ data, className }: SimpleBarChartProps) {
  // Default sample data if none provided
  const chartData = data || [53, 47, 73, 58, 52, 42, 50, 55, 60, 64, 46, 38, 43, 60, 64];

  const maxValue = Math.max(...chartData);

  return (
    <div className={cn('flex gap-0.5 items-end h-12 w-full', className)}>
      {chartData.map((value, index) => {
        const height = (value / maxValue) * 100;
        return (
          <div key={index} className="flex-1 h-full relative overflow-hidden rounded-sm">
            <div
              className="absolute bottom-0 left-0 right-0 rounded-sm"
              style={{
                height: `${height}%`,
                background: 'linear-gradient(to top, #3c61dd 50%, #adbff5 50%)',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}


