import { z } from "zod";

export const securityLevelSchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export type SecurityLevel = z.infer<typeof securityLevelSchema>;

export const attackSchema = z.object({
  id: z.string(),
  category: z.string(),
  target_location: z.string(),
});

export type Attack = z.infer<typeof attackSchema>;

export const systemResultSchema = z.object({
  id: z.string(),
  system_id: z.string(),
  attack_id: z.string(),
  vulnerable_route: z.string(),
  payload_used: z.string(),
  evidence: z.string(),
  http_request: z.string(),
  security_lvl: securityLevelSchema,
  created_at: z.string(),
  updated_at: z.string(),
  attack: attackSchema.optional(),
});

export type SystemResult = z.infer<typeof systemResultSchema>;

export const scanQueuedResponseSchema = z.object({
  message: z.string(),
  system_id: z.string(),
  target_url: z.string(),
  attacks_count: z.number(),
});

export type ScanQueuedResponse = z.infer<typeof scanQueuedResponseSchema>;

export const scanResultsResponseSchema = z.object({
  message: z.string(),
  system_id: z.string(),
  results: z.array(systemResultSchema),
});

export type ScanResultsResponse = z.infer<typeof scanResultsResponseSchema>;
