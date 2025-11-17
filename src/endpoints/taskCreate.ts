import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, Task } from "../types";
import { Tasks } from "../../drizzle/schema";

export class TaskCreate extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Create a new Task",
    request: {
      body: {
        content: {
          "application/json": {
            schema: Task,
          },
        },
      },
      headers: z.object({
        "X-API-Key": z.string().describe("API Key for authentication"),
      }),
    },
    responses: {
      "200": {
        description: "Returns the created task",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({
                task: Task,
              }),
            }),
          },
        },
      },
      "401": { description: "Invalid API Key" },
    },
  };

  async handle(c: AppContext) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated request body
    const taskToCreate = data.body;

    const result = await c
      .get("db")
      .insert(Tasks)
      .values({
        name: taskToCreate.name,
        slug: taskToCreate.slug,
        description: taskToCreate.description,
        completed: taskToCreate.completed,
        due_date: new Date().toDateString(),
      })
      .returning();

    const createdTask = result[0];

    // return the new task
    return {
      success: true,
      result: {
        task: createdTask,
      },
    };
  }
}
