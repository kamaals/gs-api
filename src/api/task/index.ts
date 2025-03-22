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
  recursiveParams,
  shouldCompleteTask,
} from "@/lib/middlewares/task-middleware";

export const task = (router: Router, db: DB) => {
  router.post(
    "/task",
    // @ts-ignore
    validateRequestBody(insetTaskSchema),
    allowDependTask(db),
    recursiveParams(db),
    createTask(db),
  );
  router.get("/task", validateRequestQuery(getTaskByQuery), getTasks(db));
  router.patch(
    "/task/:id",
    validateRequestParams(byIDParam),
    shouldCompleteTask(db),
    allowDependTask(db),
    recursiveParams(db),
    updateTask(db),
  );

  router.put("/task/:id", validateRequestParams(byIDParam), updateTask(db));
  router.delete("/task/:id", validateRequestParams(byIDParam), deleteTask(db));

  return router;
};
