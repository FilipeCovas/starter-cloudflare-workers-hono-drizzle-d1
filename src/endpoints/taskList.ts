import { Bool, Num, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, Task } from "../types";

export class TaskList extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "List Tasks",
    request: {
      query: z.object({
        page: Num({
          description: "Page number",
          default: 0,
        }),
        iscompleted: Bool({
          description: "Filter by completed flag",
          required: false,
        }),
      }),
      headers: z.object({
        "X-API-Key": z.string().describe("API Key for authentication"),
      }),
    },
    responses: {
      "200": {
        description: "Returns a list of tasks",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({
                tasks: Task.array(),
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

    // Retrieve the validated parameters
    const { page, iscompleted } = data.query;

    // Define quantos itens por página você quer (por exemplo, 10)
    const pageSize = 10;
    const offset = page * pageSize;

    // Adiciona paginação na query
    const pagedTasks = await c.get("db").query.Tasks.findMany({
      where: iscompleted
        ? (tasks, { eq }) => eq(tasks.completed, true)
        : undefined,
      limit: page === 1 ? 10 : pageSize,
      offset: page === 1 ? 0 : offset,
    });

    return {
      success: true,
      result: {
        tasks: pagedTasks,
      },
    };
  }
}
