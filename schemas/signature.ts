import { z } from "zod";

export const signatureStatusSchema = z.enum(["ALLOWED", "DENIED"]);

export type SignatureStatus = z.infer<typeof signatureStatusSchema>;

export const signatureIssueResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
  status: signatureStatusSchema,
  embed_hint: z.string(),
});

export type SignatureIssueResponse = z.infer<typeof signatureIssueResponseSchema>;

export const signatureMetaSchema = z.object({
  id: z.string(),
  status: signatureStatusSchema,
  expiration: z.string(),
  ip_address: z.string().nullable().optional(),
});

export type SignatureMeta = z.infer<typeof signatureMetaSchema>;

export const signatureValidateResponseSchema = z.object({
  message: z.string(),
  signature: signatureMetaSchema,
});

export type SignatureValidateResponse = z.infer<
  typeof signatureValidateResponseSchema
>;
