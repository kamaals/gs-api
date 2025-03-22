// biome-ignore lint/style/useImportType: drizzle expects this way
import * as schema from "@/lib/db/schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js/";
import { Router } from "express";
import { task } from "@/api/task";

export const getApiRouter = (db: PostgresJsDatabase<typeof schema>) => {
  const router = Router();
  task(router, db);
  return router;
};
