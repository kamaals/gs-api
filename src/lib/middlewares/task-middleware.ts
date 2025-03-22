import type { Cadence, DB, TaskRequest, TaskType } from "@/@types";
import type { NextFunction, Response } from "express";
import {
  allowTaskDependency,
  checkDependencyTasksToBeComplete,
  generateRecurTime,
} from "@/api/task/utils";
import { createErrorResponse } from "@/lib/services/error";
import { StatusCodes } from "http-status-codes";
import { handleError } from "@/lib/utils/error-handle";

/*
 * Middleware to check if request to complete the task
 * if this request comes with complete task we should
 * check this task have dependency tasks without complete
 */
export const shouldCompleteTask =
  (db: DB) =>
  async (request: TaskRequest, response: Response, next: NextFunction) => {
    if (request.body.done) {
      if (request.body.done) {
        const task = await checkDependencyTasksToBeComplete(db)(
          request.params.id,
        );
        if (task && Array.isArray(task.children)) {
          return createErrorResponse<{ dependTasks: Array<TaskType> }>(
            response,
            {
              dependTasks: task?.children as unknown as Array<TaskType>,
            },
            StatusCodes.FORBIDDEN,
            handleError({
              message:
                "Could not complete. This task have incomplete dependent tasks",
            }),
          );
        }
      }
    } else {
      next();
    }
  };

/*
 * Allow task to be a dependent task
 */
export const allowDependTask =
  (db: DB) => async (request: TaskRequest, _: Response, next: NextFunction) => {
    if (request.body.parentId) {
      const parentId = request.body.parentId as unknown as string;
      const canBeDependToTheTask = await allowTaskDependency(db)(
        parentId as unknown as string,
      );
      // @ts-ignore
      request.body.parentId = canBeDependToTheTask ? parentId : null;
      next();
    } else {
      next();
    }
  };

/*
 * Update recursive
 */
export const recursiveParams =
  (db: DB) => async (request: TaskRequest, _: Response, next: NextFunction) => {
    if (request.body.cadence) {
      const lastGeneratedTime = generateRecurTime(
        request.body.cadence as unknown as Cadence,
      );
      // @ts-ignore
      request.body.lastGeneratedTime = lastGeneratedTime;
      return next();
    } else {
      next();
    }
  };
