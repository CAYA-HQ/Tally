import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email("Invalid email address"),
  phone: z.string()
  .min(10, "Phone number must be at least 10 digits")
  .max(11, "Phone number must be at most 11 digits"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;