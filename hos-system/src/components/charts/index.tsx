/**
 * HOS - Hospital Management System
 * Chart Components for Dashboard Visualizations
 * ===========================================
 * 
 * Uses Recharts for responsive, animated charts
 * Implements role-based color schemes
 * 
 * @module components/charts
 * @version 1.0.0
 */

'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// ============================================
// Type Definitions
// ============================================

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface BaseChartProps {
  title?: string;
  data: ChartDataPoint[];
  height?: number;
  className?: string;
}

interface AreaChartProps extends BaseChartProps {
  dataKey: string;
  gradientColor?: string;
  strokeColor?: string;
}

interface BarChartProps extends BaseChartProps {
  dataKey: string;
  barColor?: string;
  showGrid?: boolean;
}

interface LineChartProps extends BaseChartProps {
  lines: { dataKey: string; color: string; name?: string }[];
}

interface PieChartProps extends BaseChartProps {
  dataKey?: string;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
}

// ============================================
// Color Palettes
// ============================================

/**
 * Role-based color palette for consistent theming
 */
export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#6366F1',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  purple: '#8B5CF6',
  pink: '#EC4899',
  teal: '#14B8A6',
  orange: '#F97316',
};

/**
 * Default pie chart color sequence
 */
const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.purple,
  CHART_COLORS.pink,
  CHART_COLORS.teal,
  CHART_COLORS.orange,
  CHART_COLORS.danger,
];

// ============================================
// Custom Tooltip Component
// ============================================

/**
 * Custom tooltip with consistent styling
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
        <p className="font-medium text-sm mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' 
              ? entry.value.toLocaleString() 
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================
// Area Chart Component
// ============================================

/**
 * Gradient area chart for trend visualization
 * 
 * @example
 * ```tsx
 * <AreaChartComponent
 *   title="Revenue Trend"
 *   data={revenueData}
 *   dataKey="revenue"
 *   gradientColor="#3B82F6"
 * />
 * ```
 */
export function AreaChartComponent({
  title,
  data,
  dataKey,
  gradientColor = CHART_COLORS.primary,
  strokeColor,
  height = 300,
  className,
}: AreaChartProps) {
  const gradientId = `gradient-${dataKey}`;
  const stroke = strokeColor || gradientColor;

  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {/* Gradient Definition */}
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================
// Bar Chart Component
// ============================================

/**
 * Vertical bar chart for comparisons
 * 
 * @example
 * ```tsx
 * <BarChartComponent
 *   title="Department Performance"
 *   data={departmentData}
 *   dataKey="count"
 *   barColor="#22C55E"
 * />
 * ```
 */
export function BarChartComponent({
  title,
  data,
  dataKey,
  barColor = CHART_COLORS.primary,
  showGrid = true,
  height = 300,
  className,
}: BarChartProps) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            )}
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={dataKey} 
              fill={barColor}
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================
// Multi-Line Chart Component
// ============================================

/**
 * Multi-line chart for comparing trends
 * 
 * @example
 * ```tsx
 * <MultiLineChart
 *   title="OPD vs IPD"
 *   data={patientData}
 *   lines={[
 *     { dataKey: 'opd', color: '#3B82F6', name: 'OPD' },
 *     { dataKey: 'ipd', color: '#22C55E', name: 'IPD' },
 *   ]}
 * />
 * ```
 */
export function MultiLineChart({
  title,
  data,
  lines,
  height = 300,
  className,
}: LineChartProps) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name || line.dataKey}
                stroke={line.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================
// Pie/Donut Chart Component
// ============================================

/**
 * Pie or donut chart for distribution visualization
 * 
 * @example
 * ```tsx
 * <PieChartComponent
 *   title="Patient Distribution"
 *   data={genderData}
 *   innerRadius={60} // Makes it a donut
 * />
 * ```
 */
export function PieChartComponent({
  title,
  data,
  dataKey = 'value',
  colors = PIE_COLORS,
  innerRadius = 0,
  outerRadius = 100,
  height = 300,
  className,
}: PieChartProps) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey={dataKey}
              animationDuration={1000}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================
// Mini Sparkline Component
// ============================================

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

/**
 * Compact sparkline for inline trend visualization
 * 
 * @example
 * ```tsx
 * <Sparkline data={[10, 15, 8, 20, 18, 25]} color="#22C55E" />
 * ```
 */
export function Sparkline({
  data,
  color = CHART_COLORS.primary,
  width = 100,
  height = 30,
}: SparklineProps) {
  // Convert array to chart format
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ============================================
// Export Chart Components
// ============================================

export default {
  AreaChartComponent,
  BarChartComponent,
  MultiLineChart,
  PieChartComponent,
  Sparkline,
  CHART_COLORS,
};
