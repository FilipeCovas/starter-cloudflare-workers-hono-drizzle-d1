import { DateTime, Str } from "chanfana";
import { DrizzleD1Database } from "drizzle-orm/d1";
import type { Context } from "hono";
import { z } from "zod";

export interface IAppContext {
  Bindings: Env;
  Variables: {
    drizzle: DrizzleD1Database;
  };
}

export type AppContext = Context<IAppContext>;

export const Task = z.object({
  name: Str({ example: "lorem" }),
  slug: Str(),
  description: Str({ required: false }),
  completed: z.boolean().default(false),
  due_date: DateTime(),
});
