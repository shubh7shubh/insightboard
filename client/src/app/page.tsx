"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TranscriptForm } from "@/components/TranscriptForm";
import { TaskList } from "@/components/TaskList";
import { ProgressChart } from "@/components/ProgressChart";
import { apiClient } from "@/lib/api";
import { Task, TaskStats } from "@/types";
import { toast } from "sonner";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats['overall'] | null>(null);
  const [chartData, setChartData] = useState<TaskStats['chartData'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await apiClient.getTasks();
      setTasks(response.data.tasks);
      setStats(response.data.summary);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.getTaskStats();
      setChartData(response.data.chartData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchTasks(), fetchStats()]);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await refreshData();
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const handleTranscriptSubmitted = async () => {
    await refreshData();
    toast.success('Transcript processed and tasks generated!');
  };

  const handleTaskUpdated = async () => {
    await refreshData();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Transform Meetings into Action
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Submit your meeting transcripts and let AI extract actionable tasks. 
              Track progress with beautiful visualizations.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <TranscriptForm onTranscriptSubmitted={handleTranscriptSubmitted} />
              
              {/* Stats Overview */}
              {stats && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">
                      {stats.totalTasks}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </div>
                  <div className="bg-card border rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.completionPercentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Chart */}
            <div className="space-y-6">
              <ProgressChart 
                data={chartData} 
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Tasks Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Your Action Items</h2>
              {stats && (
                <div className="text-sm text-muted-foreground">
                  {stats.pendingTasks} pending, {stats.completedTasks} completed
                </div>
              )}
            </div>
            
            <TaskList 
              tasks={tasks}
              onTaskUpdated={handleTaskUpdated}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
