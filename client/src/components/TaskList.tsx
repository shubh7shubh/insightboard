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
  Loader2,
  ArrowUpDown,
  AlertTriangle,
  Zap,
  Minus
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
type PriorityFilterType = 'all' | 'low' | 'medium' | 'high' | 'urgent';
type SortType = 'status' | 'priority' | 'created' | 'title';

export function TaskList({ tasks, onTaskUpdated, isLoading = false }: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('status');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && task.status === 'PENDING') ||
      (filter === 'completed' && task.status === 'COMPLETED');
    
    const matchesPriorityFilter = 
      priorityFilter === 'all' ||
      task.priority.toLowerCase() === priorityFilter;
    
    const matchesSearch = 
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesPriorityFilter && matchesSearch;
  });

  // Sort tasks with multiple sort options
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority': {
        const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        // Secondary sort by status
        if (a.status !== b.status) {
          return a.status === 'PENDING' ? -1 : 1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
      default:
        if (a.status !== b.status) {
          return a.status === 'PENDING' ? -1 : 1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
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

  const getPriorityFilterCount = (priorityFilterType: PriorityFilterType) => {
    switch (priorityFilterType) {
      case 'all': return totalTasks;
      case 'urgent': return tasks.filter(task => task.priority === 'URGENT').length;
      case 'high': return tasks.filter(task => task.priority === 'HIGH').length;
      case 'medium': return tasks.filter(task => task.priority === 'MEDIUM').length;
      case 'low': return tasks.filter(task => task.priority === 'LOW').length;
      default: return 0;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Zap className="h-3 w-3" />;
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <Minus className="h-3 w-3" />;
      case 'low': return <Clock className="h-3 w-3" />;
      default: return null;
    }
  };

  const getSortIcon = () => <ArrowUpDown className="h-3 w-3" />;

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

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Status:</span>
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

            {/* Priority Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Priority:</span>
              <div className="flex gap-1">
                {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((priorityFilterType) => (
                  <Button
                    key={priorityFilterType}
                    variant={priorityFilter === priorityFilterType ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriorityFilter(priorityFilterType)}
                    className="capitalize"
                  >
                    {priorityFilterType === 'all' ? (
                      <ListTodo className="mr-2 h-3 w-3" />
                    ) : (
                      <span className="mr-2">{getPriorityIcon(priorityFilterType)}</span>
                    )}
                    {priorityFilterType}
                    <Badge variant="secondary" className="ml-2">
                      {getPriorityFilterCount(priorityFilterType)}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
              <div className="flex gap-1">
                {(['status', 'priority', 'created', 'title'] as const).map((sortType) => (
                  <Button
                    key={sortType}
                    variant={sortBy === sortType ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy(sortType)}
                    className="capitalize"
                  >
                    {getSortIcon()}
                    <span className="ml-1">{sortType === 'created' ? 'Date' : sortType}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {(searchQuery || filter !== 'all' || priorityFilter !== 'all' || sortBy !== 'status') && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {sortedTasks.length} of {totalTasks} task{totalTasks !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
            {filter !== 'all' && ` (${filter})`}
            {priorityFilter !== 'all' && ` (${priorityFilter} priority)`}
            {sortBy !== 'status' && ` (sorted by ${sortBy === 'created' ? 'date' : sortBy})`}
          </span>
          {(searchQuery || filter !== 'all' || priorityFilter !== 'all' || sortBy !== 'status') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
                setPriorityFilter('all');
                setSortBy('status');
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