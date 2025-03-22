import type {
  DB,
  TaskByIDRequest,
  TaskQueryRequest,
  TaskRequest,
  TaskType,
  TaskWithChildren,
} from "@/@types";
import type { Response } from "express";
import { createSuccessResponse } from "@/lib/services/success";
import { StatusCodes } from "http-status-codes";
import { createErrorResponse } from "@/lib/services/error";
import { handleError } from "@/lib/utils/error-handle";
import { Task } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const createTask =
  (db: DB) => async (request: TaskRequest, response: Response) => {
    try {
      const task = await db
        .insert(Task)
        // @ts-ignore
        .values({
          ...request.body,
        })
        .returning();

      if (task && task.length > 0) {
        createSuccessResponse<TaskType>(
          response,
          task[0] as unknown as TaskType,
          StatusCodes.CREATED,
        );
      } else {
        createErrorResponse<string>(
          response,
          handleError({ message: "Something went wrong" }),
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (e) {
      createErrorResponse<string>(
        response,
        handleError(e),
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };

export const updateTask =
  (db: DB) => async (request: TaskRequest, response: Response) => {
    try {
      const task = await db
        .update(Task)
        .set({ ...request.body })
        .where(eq(Task.id, request.params.id))
        .returning();
      createSuccessResponse<Array<TaskWithChildren>>(
        response,
        [...task] as unknown as Array<TaskWithChildren>,
        StatusCodes.OK,
      );
    } catch (e) {
      createErrorResponse<string>(
        response,
        handleError(e),
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };

export const deleteTask =
  (db: DB) => async (request: TaskByIDRequest, response: Response) => {
    try {
      const user = await db.delete(Task).where(eq(Task.id, request.params.id));

      createSuccessResponse<TaskType>(
        response,
        user as unknown as TaskType,
        StatusCodes.OK,
        "User Deleted",
      );
    } catch (e) {
      createErrorResponse<string>(
        response,
        handleError(e),
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };

export const getTasks =
  (db: DB) => async (_: TaskQueryRequest, response: Response) => {
    try {
      const tasks = await db.query.Task.findMany({
        where: (task, { isNull }) => isNull(task.parentId),
        with: {
          children: true,
        },
      });
      createSuccessResponse<Array<TaskWithChildren>>(
        response,
        [...tasks] as unknown as Array<TaskWithChildren>,
        StatusCodes.OK,
      );
    } catch (e) {
      createErrorResponse<string>(
        response,
        handleError(e),
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };
