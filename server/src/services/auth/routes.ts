import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as jwt from "hono/jwt";
import { hash, verify } from "@denorg/scrypt";

import * as authSchemas from "./schemas.ts";
import * as authRepository from "./repository.ts";
import { JWT_ALGORITHM } from "../../constants.ts";

const jwtSecret = Deno.env.get("JWT_SECRET");

const authRouter = new Hono();

authRouter.post(
  "/register",
  zValidator("json", authSchemas.userCreateSchema),
  async (c) => {
    const { username, email, password } = c.req.valid("json");
    const createdUser = await authRepository.create({
      username,
      email,
      passwordHash: hash(password),
    });
    return c.json(createdUser, 201);
  },
);

authRouter.post(
  "/login",
  zValidator("json", authSchemas.userLoginSchema),
  async (c) => {
    const { username, password } = c.req.valid("json");
    const loginError = c.json({ error: "Invalid username or password" }, 401);

    const foundUser = await authRepository.findByUsername(username);
    if (!foundUser) {
      return loginError;
    }

    const isPasswordValid = verify(password, foundUser.password_hash);
    if (!isPasswordValid) {
      return loginError;
    }

    const userInfo = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
    };

    // User info is all that is needed in the payload for now.
    // TODO: In the future, sign a payload extended with private stuff like roles once those are implemented.
    if (!jwtSecret) {
      return c.json({ error: "JWT secret is not set" }, 500);
    }
    const token = await jwt.sign(userInfo, jwtSecret, JWT_ALGORITHM);

    return c.json({
      user: userInfo,
      token,
    });
  },
);

export { authRouter };
