import type { Request, Response } from 'express';
import { prisma } from '../index.js';
import { updateTaskSchema, taskIdSchema } from '../validation/schemas.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany({
    include: {
      transcript: {
        select: {
          id: true,
          createdAt: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
  const pendingTasks = totalTasks - completedTasks;

  res.json({
    message: 'Tasks retrieved successfully',
    data: {
      tasks: tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        transcriptId: task.transcriptId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        transcript: {
          id: task.transcript.id,
          createdAt: task.transcript.createdAt
        }
      })),
      summary: {
        totalTasks,
        pendingTasks,
        completedTasks,
        completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    }
  });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = taskIdSchema.parse(req.params);

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      transcript: {
        select: {
          id: true,
          content: true,
          createdAt: true
        }
      }
    }
  });

  if (!task) {
    throw createError('Task not found', 404);
  }

  res.json({
    message: 'Task retrieved successfully',
    data: {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      transcriptId: task.transcriptId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      transcript: task.transcript
    }
  });
});

export const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = taskIdSchema.parse(req.params);
  const { status } = updateTaskSchema.parse(req.body);

  const existingTask = await prisma.task.findUnique({
    where: { id }
  });

  if (!existingTask) {
    throw createError('Task not found', 404);
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { status },
    include: {
      transcript: {
        select: {
          id: true,
          createdAt: true
        }
      }
    }
  });

  res.json({
    message: 'Task status updated successfully',
    data: {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      transcriptId: updatedTask.transcriptId,
      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt,
      transcript: updatedTask.transcript
    }
  });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = taskIdSchema.parse(req.params);

  const existingTask = await prisma.task.findUnique({
    where: { id }
  });

  if (!existingTask) {
    throw createError('Task not found', 404);
  }

  await prisma.task.delete({
    where: { id }
  });

  res.json({
    message: 'Task deleted successfully'
  });
});

export const getTaskStatistics = asyncHandler(async (req: Request, res: Response) => {
  const [totalTasks, completedTasks, pendingTasks] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: 'COMPLETED' } }),
    prisma.task.count({ where: { status: 'PENDING' } })
  ]);

  // Get tasks by transcript for detailed breakdown
  const tasksByTranscript = await prisma.transcript.findMany({
    include: {
      _count: {
        select: {
          tasks: true
        }
      },
      tasks: {
        select: {
          status: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const transcriptStats = tasksByTranscript.map(transcript => {
    const total = transcript._count.tasks;
    const completed = transcript.tasks.filter(task => task.status === 'COMPLETED').length;
    const pending = total - completed;

    return {
      transcriptId: transcript.id,
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      createdAt: transcript.createdAt
    };
  });

  res.json({
    message: 'Task statistics retrieved successfully',
    data: {
      overall: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      },
      byTranscript: transcriptStats,
      chartData: {
        pieChart: [
          { name: 'Completed', value: completedTasks, color: '#22c55e' },
          { name: 'Pending', value: pendingTasks, color: '#f59e0b' }
        ]
      }
    }
  });
});