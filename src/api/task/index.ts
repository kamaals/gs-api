import type { DB } from "@/@types";
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from "@/lib/middlewares/validate";
import type { Router } from "express";
import {
  byIDParam,
  getTaskByQuery,
  insetTaskSchema,
} from "@/lib/zod-schemas/task";
import { createTask, deleteTask, getTasks, updateTask } from "./controller";
import {
  allowDependTask,
  conditionallyAllowRecursive,
  flatRequestBody,
  recursiveParams,
  shouldCompleteTask,
} from "@/lib/middlewares/task-middleware";

export const task = (router: Router, db: DB) => {
  router.post(
    "/task",
    flatRequestBody,
    // @ts-ignore
    validateRequestBody(insetTaskSchema),
    allowDependTask(db),
    recursiveParams(),
    createTask(db),
  );
  router.get("/task", validateRequestQuery(getTaskByQuery), getTasks(db));
  router.patch(
    "/task/:id",
    flatRequestBody,
    validateRequestParams(byIDParam),
    shouldCompleteTask(db),
    allowDependTask(db),
    conditionallyAllowRecursive(db),
    recursiveParams(),
    updateTask(db),
  );

  router.put(
    "/task/:id",
    flatRequestBody,
    validateRequestParams(byIDParam),
    shouldCompleteTask(db),
    allowDependTask(db),
    conditionallyAllowRecursive(db),
    recursiveParams(),
    updateTask(db),
  );
  router.delete("/task/:id", validateRequestParams(byIDParam), deleteTask(db));

  return router;
};
