import type { Cadence } from "@/@types";
import { addDays, addHours, addMinutes } from "date-fns";

export type MockTaskType = {
  title: string;
  cadence: Cadence;
  lastGeneratedTime: Date;
  recurTime?: Date;
  recurTimes: number;
  priority?: number;
  done?: boolean;
};

export const TASKS: Array<MockTaskType> = [
  {
    title: "Test Task Recurs by day",
    cadence: "day",
    lastGeneratedTime: addHours(new Date(), 2),
    recurTimes: 0,
    priority: 1,
    done: true,
  },
  {
    title: "Test Task 2 Recurs by day",
    cadence: "day",
    lastGeneratedTime: addMinutes(new Date(), 1),
    recurTimes: 0,
    priority: 1,
  },
  {
    title: "Test Task 3 Recurs by week",
    cadence: "week",
    lastGeneratedTime: addHours(new Date(), 2),
    recurTimes: 0,
    priority: 0,
  },
  {
    title: "Test Task 4 Recurs by week",
    cadence: "week",
    lastGeneratedTime: addMinutes(new Date(), -1),
    recurTimes: 0,
    priority: 2,
  },
  {
    title: "Test Task 5 Recurs by Month",
    cadence: "month",
    lastGeneratedTime: addHours(new Date(), 2),
    recurTimes: 0,
  },
  {
    title: "Test Task 6 Recurs by Month",
    cadence: "month",
    lastGeneratedTime: addMinutes(new Date(), 1),
    recurTimes: 0,
  },
];

export const PARENT_TASK: Omit<
  MockTaskType,
  "cadence" | "lastGeneratedTime" | "recurTimes"
> = {
  title: "Parent Task",
};

export const CHILDREN_TASK: Array<
  Omit<MockTaskType, "cadence" | "lastGeneratedTime" | "recurTimes">
> = [
  {
    title: "Child Task 1",
  },
  {
    title: "Child Task 2",
  },
  {
    title: "Child Task 3",
  },
];

export const RECUR_TASK: Array<MockTaskType> = [
  {
    title: "Test Task Recurs by day",
    cadence: "day",
    lastGeneratedTime: addDays(new Date(), 1),
    recurTime: new Date(),
    recurTimes: 0,
  },
];
