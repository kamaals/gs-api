import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Task } from "@/lib/db/schema";
import { object, string } from "zod";
// @ts-ignore
export const insetTaskSchema = createInsertSchema(Task).omit({ id: true });
// @ts-ignore
export const selectTaskSchema = createSelectSchema(Task);

export const byIDParam = object({
  id: string().uuid(),
});

export const getTaskByQuery = object({
  status: string().optional(),
}).strict();
