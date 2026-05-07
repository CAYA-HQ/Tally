import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email("Invalid email address"),
  phone: z.string()
  .min(10, "Phone number must be at least 10 digits")
  .max(11, "Phone number must be at most 11 digits"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});

const envSchema = z.object({
  PORT: z.string(),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
  REFRESH_SECRET: z.string(),
});


export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string(),
  password: z.string().min(6),
});

export const env = envSchema.parse(process.env);
export type CreateUserInput = z.infer<typeof createUserSchema>;