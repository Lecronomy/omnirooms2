import { Hono } from "hono";

import { router as roomRouter } from "./services/room/routes.ts";

const app = new Hono().basePath("/api");

// Health check endpoint
app.get("/health", (c) => {
  return c.text("OK");
});

// Services
app.route("/room", roomRouter);

export default app;
