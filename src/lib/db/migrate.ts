/* istanbul ignore file */
import { DATABASE_URL } from "@/lib/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export const connectDB = async () => {
  const migrationClient = postgres(DATABASE_URL, { max: 1 });
  await migrate(drizzle(migrationClient), {
    migrationsFolder: "./src/lib/drizzle/migrations",
  });

  await migrationClient.end();
};

connectDB().catch(console.log);
