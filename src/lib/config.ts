import type { ENV } from "@/@types";
import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";
// @ts-ignore
import { version } from "../../package.json";

dotenv.config();

export const env: ENV = cleanEnv(process.env, {
  VERSION: str({ devDefault: version }),
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  DATABASE_URL: str({
    devDefault: "postgresql://admin:Postgres@forever12@localhost:5432/gs_todo",
  }),
  SALT_FACTOR: num({ devDefault: 10 }),
  PRIVATE_KEY_PATH: str({ devDefault: "private.pem" }),
});

export const DATABASE_URL = env.DATABASE_URL;
export const SWAGGER_PATH = "docs";
export const API_PATH = `/api/${env.VERSION}/`;
