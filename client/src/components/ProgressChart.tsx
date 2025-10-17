"use client";

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  Loader2,
  PieChart as PieChartIcon
} from "lucide-react";
import { TaskStats } from "@/types";

interface ProgressChartProps {
  data: TaskStats['chartData'] | null;
  isLoading?: boolean;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  percentage?: number;
  [key: string]: unknown;
}

export function ProgressChart({ data, isLoading = false }: ProgressChartProps) {
  // Prepare chart data
  const chartData: ChartDataItem[] = data?.pieChart?.map(item => ({
    ...item,
    percentage: data.pieChart.reduce((sum, d) => sum + d.value, 0) > 0 
      ? Math.round((item.value / data.pieChart.reduce((sum, d) => sum + d.value, 0)) * 100)
      : 0
  })) || [];

  const totalTasks = chartData.reduce((sum, item) => sum + item.value, 0);
  const completedTasks = chartData.find(item => item.name === 'Completed')?.value || 0;
  const pendingTasks = chartData.find(item => item.name === 'Pending')?.value || 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: unknown[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }} 
            />
            <span className="font-medium">{data.name}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {data.value} tasks ({data.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label function
  const renderLabel = (props: { value: number }) => {
    const { value } = props;
    if (value === 0) return '';
    const percentage = chartData.find(item => item.value === value)?.percentage || 0;
    return `${percentage}%`;
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Progress Overview
          </CardTitle>
          <CardDescription>
            Track your task completion progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground text-sm">Loading chart...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalTasks === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Progress Overview
          </CardTitle>
          <CardDescription>
            Track your task completion progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-muted p-3">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">No data to display</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Submit a transcript and generate tasks to see your progress visualization.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-primary" />
          Progress Overview
        </CardTitle>
        <CardDescription>
          Track your task completion progress
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={renderLabel}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={entry.color}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Summary */}
        <div className="space-y-4">
          {/* Completion Rate */}
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {completionPercentage}%
            </div>
            <div className="text-sm text-muted-foreground">
              Completion Rate
            </div>
          </div>

          {/* Legend with detailed stats */}
          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {item.name === 'Completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ 
                      borderColor: item.color,
                      color: item.color 
                    }}
                  >
                    {item.value} tasks
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          {completionPercentage > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{completedTasks} of {totalTasks}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Achievement Badge */}
          {completionPercentage === 100 && (
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium text-sm">All tasks completed! 🎉</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}