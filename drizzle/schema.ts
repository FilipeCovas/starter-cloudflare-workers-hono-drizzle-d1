import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const Tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text("description").notNull(),
  completed: integer({ mode: "boolean" }).default(false),
  due_date: text().default(sql`(CURRENT_DATE)`),
});
