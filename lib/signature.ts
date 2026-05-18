import type { SignatureMeta } from "@/schemas/signature";

export function isSignatureValid(meta: SignatureMeta | null): boolean {
  if (!meta || meta.status !== "ALLOWED") {
    return false;
  }

  const expiration = new Date(meta.expiration);
  if (Number.isNaN(expiration.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiration.setHours(23, 59, 59, 999);

  return expiration >= today;
}
