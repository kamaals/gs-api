import { createInsertSchema } from "drizzle-zod";
import { Task } from "@/lib/db/schema";
import { object, string } from "zod";

// @ts-ignore
export const insetTaskSchema = createInsertSchema(Task).omit({ id: true });

export const byIDParam = object({
  id: string().uuid(),
});

export const getTaskByQuery = object({
  order_done: string().optional(),
  order_priority: string().optional(),
  filter_done: string().optional(),
  filter_priority: string().optional(),
}).strict();
