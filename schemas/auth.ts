import { z } from "zod";

// Register validation schema
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

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Update user validation schema
export const updateSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must be at most 255 characters")
      .optional(),
    email: z
      .string()
      .email("Invalid email")
      .max(255, "Email must be at most 255 characters")
      .optional(),
    icon: z.any().optional(), // File validation happens on the backend
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    password_confirmation: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && !data.password_confirmation) {
        return false;
      }
      if (
        data.password &&
        data.password_confirmation &&
        data.password !== data.password_confirmation
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["password_confirmation"],
    },
  );

// User response schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  icon_path: z.string().nullable(),
});

// Auth response schema (for login)
export const authResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
  user: userSchema,
});

// Generic success response
export const successResponseSchema = z.object({
  message: z.string(),
});

// Extract types from schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
