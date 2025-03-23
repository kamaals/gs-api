import type { Cadence, DB, TaskRequest, TaskType } from "@/@types";
import type { NextFunction, Response } from "express";
import {
  allowTaskDependency,
  checkDependencyTasksToBeComplete,
  checkTaskCanRecurse,
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
    const data = request.body;
    if (data.done) {
      const task = await checkDependencyTasksToBeComplete(db)(
        request.params.id,
      );
      if (task && Array.isArray(task.children) && task.children.length > 0) {
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
      } else {
        next();
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
    const data = request.body;
    if (data.parentId) {
      const parentId = data.parentId as unknown as string;
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
  () => async (request: TaskRequest, _: Response, next: NextFunction) => {
    if (request.body.cadence) {
      // @ts-ignore
      request.body.lastGeneratedTime = generateRecurTime(
        request.body.cadence as unknown as Cadence,
      );
      // @ts-ignore
      request.body.recurTime = new Date();
      return next();
    } else {
      next();
    }
  };

/*
 * Do not allow recurse already recursive task
 */
export const conditionallyAllowRecursive =
  (db: DB) =>
  async (request: TaskRequest, response: Response, next: NextFunction) => {
    const data = request.body;
    if (data.cadence) {
      const task = await checkTaskCanRecurse(db)(request.params.id);
      if (!task) {
        return createErrorResponse<string>(
          response,
          "Failed",
          StatusCodes.FORBIDDEN,
          handleError({
            message: "Could not recurse. This task is already recursive task",
          }),
        );
      } else {
        next();
      }
    } else {
      next();
    }
  };

export const flatRequestBody = (
  request: TaskRequest,
  _: Response,
  next: NextFunction,
) => {
  const data = request.body.data
    ? (request.body.data as unknown as TaskType)
    : (request.body as TaskType);
  request.body = data;
  next();
};
