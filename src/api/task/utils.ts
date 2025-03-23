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
import { addWeeks, addMonths, addDays } from "date-fns";
import { TASKS } from "@/api/task/__test__/mock";

export const checkDependencyTasksToBeComplete =
  (db: DB) => async (id: string) => {
    return db.query.Task.findFirst({
      where: eq(Task.id, id),
      with: {
        children: {
          where: (task, { ne }) => ne(task.done, true),
        },
      },
    });
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

export const checkTaskCanRecurse =
  (db: DB) =>
  async (id?: string): Promise<boolean> => {
    if (!id) return true;
    const task = await db.query.Task.findFirst({
      where: and(
        eq(Task.id, id),
        isNull(Task.parentId),
        isNull(Task.lastGeneratedTime),
        isNull(Task.cadence),
      ),
    });
    return !!task;
  };

export const generateRecurTime = (cadence: Cadence) => {
  // update task
  switch (cadence) {
    case "day":
      return addDays(new Date(), 1);
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

      return await db
        .update(Task)
        .set({
          recurTimes: increment(Task.recurTimes),
          recurTime: Task.lastGeneratedTime, // no recur
          lastGeneratedTime: generateRecurTime(cadence), // next
        })
        .where(inArray(Task.id, ids))
        .returning(); // update parent tasks only
    } catch (e) {
      console.log(e);
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

export const seedSomeTasks =
  (db: DB) =>
  async (
    tasks: Array<{
      title: string;
      cadence?: Cadence;
      lastGeneratedTime?: Date;
      recurTime?: Date;
      recurTimes?: number;
      parentId?: string;
    }> = TASKS,
  ) => {
    if (env.NODE_ENV !== "test") return;
    return db.insert(Task).values(tasks).returning();
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
