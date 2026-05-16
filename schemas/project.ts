import { z } from "zod";

export const projectSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    cover_path: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters"),
  description: z.string().min(1, "Description is required"),
});

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must be at most 255 characters")
      .optional(),
    description: z.string().min(1, "Description is required").optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "At least one field must be provided",
  });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;