"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Loader2,
  Zap,
  AlertTriangle,
  Minus,
  Clock
} from "lucide-react";
import { TaskStats } from "@/types";

interface PriorityChartProps {
  data: TaskStats['chartData'] | null;
  isLoading?: boolean;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  [key: string]: unknown;
}

export function PriorityChart({ data, isLoading = false }: PriorityChartProps) {
  // Prepare chart data
  const chartData: ChartDataItem[] = data?.barChart || [];
  const totalTasks = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: unknown[]; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }} 
            />
            <span className="font-medium capitalize">{label} Priority</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {data.value} task{data.value !== 1 ? 's' : ''}
          </div>
        </div>
      );
    }
    return null;
  };

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return <Zap className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Minus className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Clock className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Priority Distribution
          </CardTitle>
          <CardDescription>
            Track tasks by priority level
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
            <BarChart3 className="h-5 w-5 text-primary" />
            Priority Distribution
          </CardTitle>
          <CardDescription>
            Track tasks by priority level
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
                  Submit a transcript and generate tasks to see priority distribution.
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
          <BarChart3 className="h-5 w-5 text-primary" />
          Priority Distribution
        </CardTitle>
        <CardDescription>
          Track tasks by priority level
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
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
                domain={[0, 'dataMax + 1']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                fill={(entry) => entry.color}
              >
                {chartData.map((entry, index) => (
                  <Bar key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Legend */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Priority Breakdown</h4>
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getPriorityIcon(item.name)}
                  <span className="font-medium text-sm capitalize">{item.name}</span>
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
                  {item.value} task{item.value !== 1 ? 's' : ''}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {totalTasks > 0 ? Math.round((item.value / totalTasks) * 100) : 0}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {totalTasks}
              </div>
              <div className="text-xs text-muted-foreground">
                Total Tasks
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">
                {chartData.find(item => item.name === 'Urgent')?.value || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Urgent Tasks
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}