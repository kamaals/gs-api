import type { Cadence, DB, TaskWithID } from "@/@types";
import {
  eq,
  isNotNull,
  lte,
  and,
  isNull,
  or,
  type AnyColumn,
  sql,
  inArray,
} from "drizzle-orm";
import { Task } from "@/lib/db/schema";
import { env } from "@/lib/config";
import { addHours, addWeeks, addMonths } from "date-fns";
import { TASKS } from "@/api/task/__test__/mock";

export const checkDependencyTasksToBeComplete =
  (db: DB) => async (id: string) => {
    const task = await db.query.Task.findFirst({
      where: eq(Task.id, id),
      with: {
        children: {
          where: (task, { ne }) => ne(task.done, true),
        },
      },
    });
    console.log("Status", task && task.children.length > 0);
    return task;
  };

export const allowTaskDependency =
  (db: DB) =>
  async (id?: string): Promise<boolean> => {
    if (!id) return true;
    const task = await db.query.Task.findFirst({
      where: and(eq(Task.id, id), isNull(Task.parentId)),
    });
    return !!task;
  };

export const generateRecurTime = (cadence: Cadence) => {
  // update task
  switch (cadence) {
    case "day":
      return addHours(new Date(), 1);
    case "week":
      return addWeeks(new Date(), 1);
    case "month":
      return addMonths(new Date(), 1);
    default:
      return null;
  }
};

const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

/*
 * Using this function we invalidate task to not done
 */
export const updateTaskToRecur =
  (db: DB) => async (ids: Array<string>, cadence: Cadence) => {
    try {
      await db
        .update(Task)
        .set({ done: false })
        .where(or(inArray(Task.id, ids), inArray(Task.parentId, ids))); // reset depend tasks

      const tasks = await db
        .update(Task)
        .set({
          recurTimes: increment(Task.recurTimes),
          recurTime: Task.lastGeneratedTime, // no recur
          lastGeneratedTime: generateRecurTime(cadence), // next
        })
        .where(inArray(Task.id, ids))
        .returning(); // update parent tasks only
      return tasks;
    } catch (e) {
      return false;
    }
  };

export const getRecurTasks = (db: DB) => async () => {
  return db.query.Task.findMany({
    where: or(
      and(isNotNull(Task.cadence), lte(Task.lastGeneratedTime, new Date())),
    ),
  });
};

export const deleteAllRows = async (db: DB) => {
  if (env.NODE_ENV !== "test") return; // bail out if not test
  await db.delete(Task);
};

export const seedSomeTasks = async (db: DB) => {
  if (env.NODE_ENV !== "test") return;
  return db.insert(Task).values(TASKS).returning();
};

export const idsAndCadence = (
  tasks: Array<Partial<TaskWithID>>,
): Record<Cadence, Array<string>> => {
  const initialAccumulator: Record<Cadence, Array<string>> = {
    day: [],
    month: [],
    week: [],
  };

  return tasks.reduce((acc, task) => {
    if (task.id && task.cadence) {
      acc[task.cadence] = [...acc[task.cadence], task.id];
    }

    return acc;
  }, initialAccumulator);
};
