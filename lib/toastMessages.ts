function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getApiSuccessMessage(
  data: unknown,
  fallback: string,
): string {
  if (isRecord(data) && typeof data.message === "string") {
    const message = data.message.trim();
    if (message) return message;
  }
  return fallback;
}
