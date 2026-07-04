import * as jwt from "hono/jwt";

import { JWT_ALGORITHM } from "./constants.ts";

const jwtSecret = Deno.env.get("JWT_SECRET") || "";

export const authenticate = jwt.jwt({
  secret: jwtSecret,
  alg: JWT_ALGORITHM,
});
