import { z } from 'zod';

export const createTranscriptSchema = z.object({
  content: z.string()
    .min(10, 'Transcript must be at least 10 characters long')
    .max(50000, 'Transcript cannot exceed 50,000 characters')
    .trim()
});

export const updateTaskSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED'], {
    message: 'Status must be either PENDING or COMPLETED'
  })
});

export const taskIdSchema = z.object({
  id: z.string().uuid('Invalid task ID format')
});

export const transcriptIdSchema = z.object({
  id: z.string().uuid('Invalid transcript ID format')
});

export type CreateTranscriptInput = z.infer<typeof createTranscriptSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdInput = z.infer<typeof taskIdSchema>;
export type TranscriptIdInput = z.infer<typeof transcriptIdSchema>;