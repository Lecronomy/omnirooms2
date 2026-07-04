import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";

import { authenticate } from "../../middlewares.ts";

const usersRouter = new Hono<{ Variables: JwtVariables }>();

usersRouter.use("/me", authenticate);
usersRouter.get("/me", (c) => {
  const user = c.get("jwtPayload");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return c.json(user);
});

export { usersRouter };
