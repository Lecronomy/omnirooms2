import { Hono } from "hono";

import { authRouter } from "./services/auth/routes.ts";
import { roomRouter } from "./services/room/routes.ts";

const app = new Hono().basePath("/api");

// Health check endpoint
app.get("/health", (c) => {
  return c.text("OK");
});

// Services
app.route("/auth", authRouter);
app.route("/room", roomRouter);

export default app;
