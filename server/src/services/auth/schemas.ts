import { z } from "zod";

export const userLoginSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(8).max(100),
});

export const userCreateSchema = userLoginSchema.extend({
  email: z.email(),
});
