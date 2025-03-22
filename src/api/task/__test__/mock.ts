import type { Cadence } from "@/@types";
import { addHours, addMinutes } from "date-fns";

export const TASKS: Array<{
  title: string;
  cadence: Cadence;
  lastGeneratedTime: Date;
  recurTime?: Date;
  recurTimes: number;
}> = [
  {
    title: "Test Task Recurs by day",
    cadence: "day",
    lastGeneratedTime: addHours(new Date(), 2),
    recurTimes: 0,
  },
  {
    title: "Test Task 2 Recurs by day",
    cadence: "day",
    lastGeneratedTime: addMinutes(new Date(), 1),
    recurTimes: 0,
  },
  {
    title: "Test Task 3 Recurs by week",
    cadence: "week",
    lastGeneratedTime: addHours(new Date(), 2),
    recurTimes: 0,
  },
  {
    title: "Test Task 4 Recurs by week",
    cadence: "week",
    lastGeneratedTime: addMinutes(new Date(), -1),
    recurTimes: 0,
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
