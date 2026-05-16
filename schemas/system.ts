import { z } from "zod";
import { projectSchema } from "./project";

export const systemSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  name: z.string(),
  cover_url: z.string().nullable().optional(),
  cover_path: z.string().nullable().optional(),
  target_url: z.string().nullable(),
  repository_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  project: projectSchema.optional(),
});

export type System = z.infer<typeof systemSchema>;

const requiredUrlSchema = z
  .string()
  .trim()
  .min(1, "URL is required")
  .url("Invalid URL");

export const createSystemSchema = z.object({
  project_id: z.string().min(1, "Project is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters"),
  target_url: requiredUrlSchema,
  repository_url: requiredUrlSchema,
});

export const updateSystemSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must be at most 255 characters")
      .optional(),
    target_url: requiredUrlSchema.optional(),
    repository_url: requiredUrlSchema.optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.target_url !== undefined ||
      data.repository_url !== undefined,
    { message: "At least one field must be provided" },
  );

export type CreateSystemInput = z.infer<typeof createSystemSchema>;
export type UpdateSystemInput = z.infer<typeof updateSystemSchema>;