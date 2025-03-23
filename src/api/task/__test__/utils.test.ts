import {
  deleteAllRows,
  getRecurTasks,
  idsAndCadence,
  seedSomeTasks,
  updateTaskToRecur,
} from "../utils";

import type { DB, TaskWithID } from "../../../@types";
import { connectDB } from "../../../lib/db/db";

let db: DB | null = null;

beforeAll(async () => {
  db = (await connectDB()) as unknown as DB;
  await deleteAllRows(db as DB);
  await seedSomeTasks(db as DB)();
});

describe("Utils Test", () => {
  describe("getRecurTasks function", () => {
    it("Should return only one task", async () => {
      const f = getRecurTasks(db as DB);
      const tasks = await f();
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe("Test Task 4 Recurs by week");
    });
  });

  describe("updateTaskToRecur function", () => {
    it("Should return only one task", async () => {
      const f = getRecurTasks(db as DB);
      const uf = updateTaskToRecur(db as DB);
      const tasks = await f();
      const ids = idsAndCadence(tasks as unknown as Array<TaskWithID>);
      const update = (await uf(
        ids.week,
        "week",
      )) as unknown as Array<TaskWithID>;
      expect(update.length).toBe(1);
    });
  });
});
