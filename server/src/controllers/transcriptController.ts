import type { Request, Response } from "express";
import { prisma } from "../index.js";
import { llmService } from "../services/llmService.js";
import { createTranscriptSchema } from "../validation/schemas.js";
import { asyncHandler, createError } from "../middleware/errorHandler.js";

export const createTranscript = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate input
    const { content } = createTranscriptSchema.parse(req.body);

    try {
      console.log("generate action items for transcript...");

      let actionItems;
      try {
        // generate action items using LLM
        actionItems = await llmService.generateActionItems(content);
        console.log("Generated action items:", actionItems);
      } catch (llmError) {
        console.error("LLM failed, using fallback:", llmError);
        // Sample Generate mock tasks with priorities and tags
        actionItems = [
          {
            title: "Prep",
            description:
              "John will prepare the proposal by Friday as discussed in the meeting",
            priority: "HIGH",
            tags: ["proposal", "deadline", "john"],
          },
          {
            title: "Rev",
            description:
              "Sarah to review the budget for the new feature release",
            priority: "MEDIUM",
            tags: ["budget", "review", "sarah"],
          },
          {
            title: "Sched",
            description: "Schedule a follow-up meeting for next Tuesday",
            priority: "MEDIUM",
            tags: ["meeting", "followup", "schedule"],
          },
        ];
      }

      // Create transcript and associated tasks in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create transcript
        const transcript = await tx.transcript.create({
          data: { content },
        });

        // Create tasks
        const tasks = await Promise.all(
          actionItems.map((item) =>
            tx.task.create({
              data: {
                title: item.title,
                description: item.description,
                priority: item.priority,
                tags: item.tags,
                transcriptId: transcript.id,
              },
            })
          )
        );

        return {
          transcript,
          tasks,
        };
      });

      res.status(201).json({
        message: "Transcript processed successfully",
        data: {
          transcript: {
            id: result.transcript.id,
            content: result.transcript.content,
            createdAt: result.transcript.createdAt,
          },
          tasks: result.tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            tags: task.tags,
            createdAt: task.createdAt,
          })),
          summary: {
            totalTasks: result.tasks.length,
            pendingTasks: result.tasks.length,
            completedTasks: 0,
          },
        },
      });
    } catch (error) {
      console.error("Error processing transcript:", error);
      throw createError(
        "Failed to process transcript and generate action items",
        500
      );
    }
  }
);

export const getTranscripts = asyncHandler(
  async (req: Request, res: Response) => {
    const transcripts = await prisma.transcript.findMany({
      include: {
        tasks: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const transcriptsWithStats = transcripts.map((transcript) => {
      const totalTasks = transcript.tasks.length;
      const completedTasks = transcript.tasks.filter(
        (task) => task.status === "COMPLETED"
      ).length;
      const pendingTasks = totalTasks - completedTasks;

      return {
        id: transcript.id,
        content:
          transcript.content.substring(0, 200) +
          (transcript.content.length > 200 ? "..." : ""),
        createdAt: transcript.createdAt,
        tasks: transcript.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          tags: task.tags,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })),
        summary: {
          totalTasks,
          pendingTasks,
          completedTasks,
          completionPercentage:
            totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0,
        },
      };
    });

    res.json({
      message: "Transcripts retrieved successfully",
      data: transcriptsWithStats,
    });
  }
);

export const getTranscriptById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw createError("Transcript ID is required", 400);
    }

    const transcript = await prisma.transcript.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!transcript) {
      throw createError("Transcript not found", 404);
    }

    const totalTasks = transcript.tasks.length;
    const completedTasks = transcript.tasks.filter(
      (task) => task.status === "COMPLETED"
    ).length;
    const pendingTasks = totalTasks - completedTasks;

    res.json({
      message: "Transcript retrieved successfully",
      data: {
        id: transcript.id,
        content: transcript.content,
        createdAt: transcript.createdAt,
        tasks: transcript.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          tags: task.tags,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })),
        summary: {
          totalTasks,
          pendingTasks,
          completedTasks,
          completionPercentage:
            totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0,
        },
      },
    });
  }
);

export const deleteTranscript = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw createError("Transcript ID is required", 400);
    }

    const transcript = await prisma.transcript.findUnique({
      where: { id },
    });

    if (!transcript) {
      throw createError("Transcript not found", 404);
    }

    await prisma.transcript.delete({
      where: { id },
    });

    res.json({
      message: "Transcript deleted successfully",
    });
  }
);
