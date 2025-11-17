import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext, Task } from "../types";

export class TaskFetch extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Get a single Task by slug",
    request: {
      params: z.object({
        taskSlug: Str({ description: "Task slug" }),
      }),
    },
    responses: {
      "200": {
        description: "Returns a single task if found",
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
      "404": {
        description: "Task not found",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              error: Str(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated slug
    const { taskSlug } = data.params;

    const task = await c.get("db").query.Tasks.findFirst({
      where: (tasks, { eq }) => eq(tasks.slug, taskSlug),
    });

    return {
      success: true,
      result: {
        task,
      },
    };
  }
}
