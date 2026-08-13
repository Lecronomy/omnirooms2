import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";

import { authenticate } from "../../middlewares.ts";
import * as postRepository from "./repository.ts";
import * as postSchemas from "./schemas.ts";

const postsRouter = new Hono<{ Variables: JwtVariables }>();

postsRouter.get("/user/:username", async (c) => {
  const { username } = c.req.param();
  const posts = await postRepository.findByUsername(username);
  return c.json(posts);
});

postsRouter.get("/me", authenticate, async (c) => {
  const user = c.get("jwtPayload");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const posts = await postRepository.findByUserId(user.id);
  return c.json(posts);
});

postsRouter.post(
  "/",
  zValidator("json", postSchemas.postSchema),
  authenticate,
  async (c) => {
    const user = c.get("jwtPayload");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const postData = c.req.valid("json");
    const post = await postRepository.create({
      ...postData,
      userId: user.id,
    });
    return c.json(post);
  },
);

postsRouter.delete("/:postId", authenticate, async (c) => {
  const user = c.get("jwtPayload");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const postId = parseInt(c.req.param("postId"), 10);
  if (isNaN(postId)) {
    return c.json({ error: "Invalid post ID" }, 400);
  }

  const deletedPost = await postRepository.deletePost(postId);
  if (!deletedPost) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(deletedPost);
});

export { postsRouter };
