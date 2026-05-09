import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});


const envSchema = z.object({
  PORT: z.string(),
  MONGO_URI: z.string(),
  REDIS_URL: z.string(),
  JWT_SECRET: z.string(),
  REFRESH_JWT_SECRET: z.string(),
  GOOGLE_EMAIL:z.string(),
  GOOGLE_PASSWORD:z.string(),
  GOOGLE_CALLBACK_URL:z.string(),
  GOOGLE_CLIENT_ID:z.string(),
  GOOGLE_CLIENT_SECRET:z.string(),
  FRONTEND_URL:z.string(),
  GOOGLE_SECRET:z.string(),
  NODE_ENV: z.enum([
    'production',
    'development'
  ])
});

export const env = envSchema.parse(process.env);
export type CreateUserInput = z.infer<typeof createUserSchema>;