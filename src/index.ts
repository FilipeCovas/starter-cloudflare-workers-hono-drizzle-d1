import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { IAppContext } from "./types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../drizzle/schema";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
// Start a Hono app
const app = new Hono<IAppContext>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

openapi.use(
  "*",
  cors({
    origin: ["http://example.com"],
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

openapi.use(
  "*",
  csrf({
    origin: ["http://example.com"],
  })
);

// API Key Authentication Middleware
openapi.use(async (c, next) => {
  const apiKey = c.req.header("X-API-Key");
  if (!apiKey || apiKey !== process.env.API_KEY) {
    // Validate against API_KEY environment variable
    throw new HTTPException(401, { message: "Invalid API Key." });
  }
  return await next();
});

openapi.use(async (c, next) => {
  if (!c.get("db")) {
    const db = drizzle(c.env.DB, { schema });
    c.set("db", db);
  }
  return await next();
});

// Register OpenAPI endpoints
openapi.get("/api/tasks", TaskList);
openapi.post("/api/tasks", TaskCreate);
openapi.get("/api/tasks/:taskSlug", TaskFetch);
openapi.delete("/api/tasks/:taskSlug", TaskDelete);

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;
