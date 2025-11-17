import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext, Task } from "../types";
import { Tasks } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
export class TaskDelete extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Delete a Task",
    request: {
      params: z.object({
        taskSlug: Str({ description: "Task slug" }),
      }),
      headers: z.object({
        "X-API-Key": z.string().describe("API Key for authentication"),
      }),
    },
    responses: {
      "200": {
        description: "Returns if the task was deleted successfully",
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

    // Retrieve the validated slug
    const { taskSlug } = data.params;

    const deletedTask = await c
      .get("db")
      .delete(Tasks)
      .where(eq(Tasks.slug, taskSlug))
      .returning();

    // Return the deleted task for confirmation
    return {
      success: true,
      result: {
        task: deletedTask[0],
      },
    };
  }
}
