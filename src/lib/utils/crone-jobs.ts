import { schedule } from "node-cron";

export const initCrone = () => {
  schedule("* * * * *", () => {
    console.log("will execute every minute until stopped");
  });
};
