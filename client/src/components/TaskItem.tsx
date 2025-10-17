"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Calendar,
  Loader2,
  Zap,
  AlertTriangle,
  Minus,
  Tag
} from "lucide-react";
import { Task } from "@/types";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
}

export function TaskItem({ task, onTaskUpdated }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    
    try {
      const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
      await apiClient.updateTask(task.id, { status: newStatus });
      
      toast.success(
        newStatus === 'COMPLETED' 
          ? '✅ Task marked as completed!' 
          : '🔄 Task marked as pending'
      );
      
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      await apiClient.deleteTask(task.id);
      toast.success('🗑️ Task deleted successfully');
      onTaskUpdated();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const isCompleted = task.status === 'COMPLETED';
  const createdAt = new Date(task.createdAt);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT': return <Zap className="h-3 w-3" />;
      case 'HIGH': return <AlertTriangle className="h-3 w-3" />;
      case 'MEDIUM': return <Minus className="h-3 w-3" />;
      case 'LOW': return <Clock className="h-3 w-3" />;
      default: return <Minus className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md ${
        isCompleted 
          ? 'bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
          : 'bg-card hover:bg-accent/50'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Checkbox */}
          <div className="pt-1">
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Checkbox
                checked={isCompleted}
                onCheckedChange={handleStatusToggle}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
            )}
          </div>

          {/* Task Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 
                className={`font-medium leading-tight ${
                  isCompleted 
                    ? 'line-through text-muted-foreground' 
                    : 'text-foreground'
                }`}
              >
                {task.title}
              </h3>
              
              <div className="flex items-center gap-2">
                {/* Priority Badge */}
                <Badge 
                  variant="outline"
                  className={`${getPriorityColor(task.priority)}`}
                >
                  {getPriorityIcon(task.priority)}
                  <span className="ml-1 capitalize">{task.priority.toLowerCase()}</span>
                </Badge>

                {/* Status Badge */}
                <Badge 
                  variant={isCompleted ? "default" : "secondary"}
                  className={`${
                    isCompleted 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {isCompleted ? 'Completed' : 'Pending'}
                </Badge>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p 
                className={`text-sm leading-relaxed ${
                  isCompleted 
                    ? 'line-through text-muted-foreground' 
                    : 'text-muted-foreground'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                <Tag className="h-3 w-3 text-muted-foreground" />
                {task.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-0 h-5 bg-muted/50 text-muted-foreground hover:bg-muted"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Created {timeAgo}</span>
              </div>

              {/* Delete Button */}
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete task</span>
                  </Button>
                </DialogTrigger>
                
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this task? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteDialog(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Task
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}