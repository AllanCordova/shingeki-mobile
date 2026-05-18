import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must be at most 255 characters"),
    email: z
      .string()
      .email("Invalid email")
      .max(255, "Email must be at most 255 characters"),
    icon_path: z
      .string()
      .max(255, "Icon path must be at most 255 characters")
      .nullable()
      .optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface User {
  id: string | number;
  name: string;
  email: string;
  icon_path: string | null;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface SuccessResponse {
  message: string;
}
