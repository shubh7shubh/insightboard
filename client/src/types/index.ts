export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'PENDING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  tags: string[];
  transcriptId: string;
  createdAt: string;
  updatedAt: string;
  transcript?: {
    id: string;
    createdAt: string;
  };
}

export interface Transcript {
  id: string;
  content: string;
  createdAt: string;
  tasks?: Task[];
  summary?: {
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    completionPercentage: number;
  };
}

export interface TaskSummary {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  completionPercentage: number;
}

export interface ChartData {
  pieChart: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  barChart: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export interface TaskStats {
  overall: TaskSummary;
  byTranscript: Array<{
    transcriptId: string;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionPercentage: number;
    createdAt: string;
  }>;
  chartData: ChartData;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface CreateTranscriptRequest {
  content: string;
}

export interface CreateTranscriptResponse {
  transcript: Transcript;
  tasks: Task[];
  summary: TaskSummary;
}

export interface UpdateTaskRequest {
  status: 'PENDING' | 'COMPLETED';
}