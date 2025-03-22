import type { DB, TaskWithChildren } from "@/@types";
import { API_PATH } from "@/lib/config";
import { getServer } from "@/lib/server";
import supertest from "supertest";
import { connectDB } from "../../../lib/db/db";
import type { App } from "supertest/types";
import { deleteAllRows, seedSomeTasks } from "../utils";

let app: App | null = null;
let db: DB | null = null;
beforeAll(async () => {
  db = (await connectDB()) as unknown as DB;
  await deleteAllRows(db as DB);
  app = getServer(db);
});

describe("TASK API", () => {
  describe("get tasks", () => {
    describe("given router should work as expected", () => {
      it("Should return 200 status but no user", async () => {
        const { body, statusCode } = await supertest(app as App).get(
          `${API_PATH}task`,
        );
        expect(body.data).toEqual([]);
        expect(statusCode).toBe(200);
        expect(body.message).toBe("Success");
      });

      it("Should return 404 status", async () => {
        const { body, statusCode } = await supertest(app as App).get(
          `${API_PATH}task?id=600`,
        );
        expect(body.data[0].code).toBe("unrecognized_keys");
        expect(statusCode).toBe(404);
        expect(body.message).toBe("Request Query Validation Error");
      });
    });
  });

  describe("create task", () => {
    describe("given router should work as expected", () => {
      const task = { title: "Hello Task" };
      it("Should return 201", async () => {
        const { body, statusCode } = await supertest(app as App)
          .post(`${API_PATH}task`)
          .send(task);
        expect(body.data.title).toBe(task.title);
        expect(statusCode).toBe(201);
        expect(body.message).toBe("Success");
      });
    });

    it("Should return 400 for missing field title", async () => {
      const { body, statusCode } = await supertest(app as App)
        .post(`${API_PATH}task`)
        .send({});
      expect(body.data[0].path).toEqual(["title"]);
      expect(statusCode).toBe(400);
      expect(body.message).toBe("Request body Validation Error");
    });

    it("Should return 400 for invalid parentId", async () => {
      const { body, statusCode } = await supertest(app as App)
        .post(`${API_PATH}task`)
        .send({ title: "Depend Task", parentId: "foo" });
      expect(body.data[0].path).toEqual(["parentId"]);
      expect(statusCode).toBe(400);
      expect(body.message).toBe("Request body Validation Error");
    });
  });

  describe("update task", () => {
    let task: null | Array<TaskWithChildren> = null;

    beforeAll(async () => {
      task = (await seedSomeTasks(
        db as DB,
      )) as unknown as Array<TaskWithChildren>;
    });

    it("Should return 404 for wrong field id", async () => {
      const { body, statusCode } = await supertest(app as App)
        .put(`${API_PATH}task/45873`)
        .send({});
      expect(body.data[0].path).toEqual(["id"]);
      expect(statusCode).toBe(404);
      expect(body.message).toBe("Request params Validation Error");
    });

    it("Should return 206 for updated task", async () => {
      const { body, statusCode } = await supertest(app as App)
        .put(`${API_PATH}task/${(task || [])[0]?.id}`)
        .send({ title: "Updated Task" });
      expect(statusCode).toBe(200);
      expect(body.message).toBe("Success");
    });
  });
});
