import {
  Task,
  Transcript,
  TaskStats,
  ApiResponse,
  CreateTranscriptRequest,
  CreateTranscriptResponse,
  UpdateTaskRequest,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Transcript endpoints
  async createTranscript(data: CreateTranscriptRequest): Promise<ApiResponse<CreateTranscriptResponse>> {
    return this.fetchApi<CreateTranscriptResponse>('/api/transcripts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTranscripts(): Promise<ApiResponse<Transcript[]>> {
    return this.fetchApi<Transcript[]>('/api/transcripts');
  }

  async getTranscriptById(id: string): Promise<ApiResponse<Transcript>> {
    return this.fetchApi<Transcript>(`/api/transcripts/${id}`);
  }

  async deleteTranscript(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.fetchApi<{ message: string }>(`/api/transcripts/${id}`, {
      method: 'DELETE',
    });
  }

  // Task endpoints
  async getTasks(): Promise<ApiResponse<{ tasks: Task[]; summary: TaskStats['overall'] }>> {
    return this.fetchApi<{ tasks: Task[]; summary: TaskStats['overall'] }>('/api/tasks');
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    return this.fetchApi<Task>(`/api/tasks/${id}`);
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    return this.fetchApi<Task>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.fetchApi<{ message: string }>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getTaskStats(): Promise<ApiResponse<TaskStats>> {
    return this.fetchApi<TaskStats>('/api/tasks/stats');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
}

export const apiClient = new ApiClient();