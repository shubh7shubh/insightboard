"use client";

import { TaskItem } from "./TaskItem";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  Search,
  Filter,
  Loader2 
} from "lucide-react";
import { Task } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
  isLoading?: boolean;
}

type FilterType = 'all' | 'pending' | 'completed';

export function TaskList({ tasks, onTaskUpdated, isLoading = false }: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && task.status === 'PENDING') ||
      (filter === 'completed' && task.status === 'COMPLETED');
    
    const matchesSearch = 
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Sort tasks: pending first, then by creation date (newest first)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'PENDING' ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
  const pendingTasks = totalTasks - completedTasks;

  const getFilterCount = (filterType: FilterType) => {
    switch (filterType) {
      case 'all': return totalTasks;
      case 'pending': return pendingTasks;
      case 'completed': return completedTasks;
      default: return 0;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading your tasks...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalTasks === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-muted p-3">
              <ListTodo className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">No tasks yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Submit a meeting transcript above to generate your first set of action items.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter and Search Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
                {(['all', 'pending', 'completed'] as const).map((filterType) => (
                  <Button
                    key={filterType}
                    variant={filter === filterType ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(filterType)}
                    className="capitalize"
                  >
                    {filterType === 'all' && <ListTodo className="mr-2 h-3 w-3" />}
                    {filterType === 'pending' && <Clock className="mr-2 h-3 w-3" />}
                    {filterType === 'completed' && <CheckCircle2 className="mr-2 h-3 w-3" />}
                    {filterType}
                    <Badge variant="secondary" className="ml-2">
                      {getFilterCount(filterType)}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {(searchQuery || filter !== 'all') && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {sortedTasks.length} of {totalTasks} task{totalTasks !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          {(searchQuery || filter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center space-y-3 text-center">
              <Search className="h-8 w-8 text-muted-foreground" />
              <div className="space-y-1">
                <h3 className="font-medium">No tasks found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Group by status if showing all */}
          {filter === 'all' && pendingTasks > 0 && completedTasks > 0 && (
            <>
              {/* Pending Tasks */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <h3 className="font-medium">Pending Tasks</h3>
                  <Badge variant="secondary">{pendingTasks}</Badge>
                </div>
                {sortedTasks
                  .filter(task => task.status === 'PENDING')
                  .map((task) => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onTaskUpdated={onTaskUpdated} 
                    />
                  ))}
              </div>

              {/* Separator */}
              <div className="flex items-center gap-4 py-2">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">COMPLETED</span>
                <Separator className="flex-1" />
              </div>

              {/* Completed Tasks */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <h3 className="font-medium">Completed Tasks</h3>
                  <Badge variant="secondary">{completedTasks}</Badge>
                </div>
                {sortedTasks
                  .filter(task => task.status === 'COMPLETED')
                  .map((task) => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onTaskUpdated={onTaskUpdated} 
                    />
                  ))}
              </div>
            </>
          )}

          {/* Simple list if filtered or no grouping needed */}
          {(filter !== 'all' || pendingTasks === 0 || completedTasks === 0) && (
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onTaskUpdated={onTaskUpdated} 
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}