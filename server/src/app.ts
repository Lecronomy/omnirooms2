import { Hono } from "hono";
import { cors } from "hono/cors";

import { authRouter } from "./services/auth/routes.ts";
import { roomRouter } from "./services/room/routes.ts";
import { usersRouter } from "./services/users/routes.ts";

const app = new Hono().basePath("/api");

// Enable CORS for all routes. Change the path to match your frontend domain if you want to restrict access.
app.use("/*", cors());

// Health check endpoint
app.get("/health", (c) => {
  return c.text("OK");
});

// Services
app.route("/auth", authRouter);
app.route("/room", roomRouter);
app.route("/users", usersRouter);

export default app;
