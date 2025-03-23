import { env } from "@/lib/config";
import * as schema from "@/lib/db/schema";
import { WinstonDrizzleLogger } from "@/lib/logger/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const connectDB = async () => {
  const client = postgres(env.DATABASE_URL, { max: 1 });
  return drizzle(client, {
    schema,
    ...(process.env.NODE_ENV === "test"
      ? {}
      : { logger: new WinstonDrizzleLogger() }),
  });
};
