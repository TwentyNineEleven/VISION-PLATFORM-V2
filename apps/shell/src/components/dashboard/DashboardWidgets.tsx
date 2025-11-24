'use client';

import React from 'react';
import { ShoppingCart, Users, TrendingUp, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlowButton } from '@/components/glow-ui';

interface MetricWidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  chart?: React.ReactNode;
  className?: string;
}

function MetricWidget({ title, value, icon, trend, chart, className }: MetricWidgetProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-xl p-5 flex flex-col gap-4',
        className
      )}
    >
      {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-vision-gray-100 border border-border rounded-md flex items-center justify-center shrink-0 text-vision-gray-700">
            {icon}
          </div>
          <p className="text-sm font-medium text-vision-gray-700 truncate">{title}</p>
        </div>
        <GlowButton
          variant="ghost"
          size="icon"
          glow="none"
          className="text-muted-foreground hover:text-vision-gray-700"
          aria-label="More metrics"
        >
          <MoreVertical className="w-4 h-4" />
        </GlowButton>
      </div>

      {/* Value and Trend */}
      <div className="flex items-end gap-2">
        <div className="flex items-end gap-1 flex-1 min-w-0">
          <span className="text-4xl font-normal text-foreground leading-none">{value}</span>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium',
                trend.isPositive
                  ? 'border-vision-green-100 text-vision-green-700 bg-vision-green-50'
                  : 'border-vision-red-100 text-vision-red-700 bg-vision-red-50'
              )}
            >
              <TrendingUp
                className={cn(
                  'w-3.5 h-3.5',
                  !trend.isPositive && 'rotate-180'
                )}
              />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {chart && <div className="w-20 h-12 shrink-0">{chart}</div>}
      </div>
    </div>
  );
}

// Simple Line Chart Component (placeholder for now)
function MiniLineChart() {
  const points = [20, 25, 30, 28, 32, 35, 40];
  const max = Math.max(...points);
  const normalized = points.map((p) => (p / max) * 100);

  return (
    <svg viewBox="0 0 80 48" className="w-full h-full">
      <polyline
        points={normalized
          .map((y, i) => `${(i / (normalized.length - 1)) * 80},${48 - y}`)
          .join(' ')}
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Pie Chart Component (placeholder)
function MiniPieChart() {
  const percentage = 42;
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12">
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke="#F1F5F9"
        strokeWidth="4"
      />
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke="#2563EB"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
    </svg>
  );
}

// Bar Chart Component
function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const normalized = data.map((d) => (d / max) * 100);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const displayMonths = months.slice(0, data.length);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-end gap-0.5 flex-1 pb-7">
        {normalized.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col gap-0.5 justify-end">
            <div
              className="w-full rounded-sm"
              style={{
                height: `${height}%`,
                background: `linear-gradient(to top, #2563EB 50%, #DBEAFE 50%)`,
                minHeight: '2px',
              }}
            />
          </div>
        ))}
      </div>
      {/* Month Labels */}
      <div className="flex items-center justify-between text-xs text-vision-gray-700 border-t border-border pt-2.5 pb-0">
        {displayMonths.map((month, i) => (
          <span key={i} className="text-xs">{month}</span>
        ))}
      </div>
    </div>
  );
}

export function TotalOrdersWidget() {
  return (
    <MetricWidget
      title="Total orders"
      value="480"
      icon={<ShoppingCart className="w-5 h-5" />}
      trend={{ value: 23, isPositive: true }}
      chart={<MiniLineChart />}
    />
  );
}

export function ReturningUsersPercentageWidget() {
  return (
    <MetricWidget
      title="Returning Users"
      value="42%"
      icon={<Users className="w-5 h-5" />}
      chart={<MiniPieChart />}
    />
  );
}

export function ReturningUsersCountWidget({ data }: { data?: number[] }) {
  const barData =
    data ||
    Array.from({ length: 24 }, () => Math.floor(Math.random() * 100) + 20);

  return (
    <MetricWidget
      title="Returning Users"
      value="235"
      icon={<Users className="w-5 h-5" />}
      trend={{ value: 23, isPositive: true }}
      chart={<BarChart data={barData} />}
      className="flex-1 in-h-[456px]"
    />
  );
}

// Export document management widgets
export { RecentDocumentsWidget } from './RecentDocumentsWidget';
export { StorageUsageWidget } from './StorageUsageWidget';
export { DocumentActivityWidget } from './DocumentActivityWidget';
