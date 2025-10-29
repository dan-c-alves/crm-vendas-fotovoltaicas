'use client';

import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  loading?: boolean;
}

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  loading = false,
}: MetricCardProps) {
  const colorClasses = {
    primary: 'from-primary-500/20 to-primary-600/10 border-primary-500/30',
    success: 'from-green-500/20 to-green-600/10 border-green-500/30',
    warning: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
    danger: 'from-red-500/20 to-red-600/10 border-red-500/30',
    info: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  };

  const trendColor = trend && trend > 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className={clsx(
      'glass p-6 rounded-lg border',
      colorClasses[color],
      'hover:shadow-glow transition-all duration-200'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-dark-400 text-sm font-medium mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-dark-700 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl md:text-3xl font-bold text-dark-50">{value}</p>
          )}
        </div>
        {icon && (
          <div className="text-3xl opacity-50">
            {icon}
          </div>
        )}
      </div>

      {trend !== undefined && (
        <div className={clsx('text-sm font-medium', trendColor)}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}

