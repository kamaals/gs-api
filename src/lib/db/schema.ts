import {
  type AnyPgColumn,
  pgEnum,
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const taskCadenceEnum = pgEnum("task_cadence", ["day", "week", "month"]);

export const Task = pgTable("task", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("name").notNull(),
  description: text("slug").default("Task description"),
  parentId: uuid("parent_id").references((): AnyPgColumn => Task.id, {
    onDelete: "cascade",
  }),
  done: boolean("done").notNull().default(false),
  cadence: taskCadenceEnum("cadence"),
  priority: priorityEnum("priority").default("low"),
  lastGeneratedTime: timestamp("last_generated_time"),
  recurTime: timestamp("last_time"),
  recurTimes: integer("recur_times").default(0),
  createdAt: timestamp("created_at").default(new Date()),
});

export const taskRelation = relations(Task, ({ one, many }) => ({
  parent: one(Task, {
    fields: [Task.parentId],
    references: [Task.id],
    relationName: "children", // this and
  }),
  children: many(Task, {
    relationName: "children", // this should be same
  }),
}));
