import * as jwt from "hono/jwt";

import { JWT_ALGORITHM } from "../../constants.ts";

const jwtSecret = Deno.env.get("JWT_SECRET") || "";

export const verifyToken = async (token: string) => {
  return await jwt.verify(token, jwtSecret, JWT_ALGORITHM);
};
