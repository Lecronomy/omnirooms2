import { createMiddleware } from "hono/factory";
import * as jwt from "hono/jwt";

import { JWT_ALGORITHM } from "./constants.ts";
import { JWTPayload } from "hono/utils/jwt/types";

const jwtSecret = Deno.env.get("JWT_SECRET") || "";

export const authenticate = jwt.jwt({
  secret: jwtSecret,
  alg: JWT_ALGORITHM,
});

export type OptionalAuthenticateVariables = {
  optionalPayload?: JWTPayload;
};

export const optionalAuthenticate = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    try {
      const payload = await jwt.verify(token, jwtSecret, JWT_ALGORITHM);
      c.set("optionalPayload", payload);
    } catch (error) {
      console.error("JWT verification failed:", error);
    }
  }

  await next();
});
