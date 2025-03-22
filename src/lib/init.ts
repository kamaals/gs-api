/* istanbul ignore file */
import type { DB } from "@/@types";
import { env } from "@/lib/config";
import { connectDB } from "@/lib/db/db";
import { mainLogger } from "@/lib/logger/winston";
import { getServer } from "@/lib/server";
import type { ServerError } from "@/lib/utils/error-handle";

export const init = async () => {
  return new Promise<string>((resolve, reject) => {
    (async () => {
      try {
        const db = (await connectDB()) as unknown as DB;
        //const user = await addDefaultUser(db);
        if (db) {
          const app = getServer(db);

          const server = app.listen(env.PORT, () => {
            mainLogger.info(`Server running on http://${env.HOST}:${env.PORT}`);
          });

          server.on("error", (err: ServerError) => {
            if (err.code) {
              mainLogger.error(`PORT ${err.port} Already in use`, err);
            }
          });

          resolve("DB connected");
        } else {
          reject("DB connection failed");
        }
      } catch (e) {
        reject("Cannot connect the db");
      }
    })();
  });
};
