import axios from "axios";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getAxiosErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (isRecord(data)) {
      const direct = data.message;
      if (typeof direct === "string" && direct.trim()) {
        return direct.trim();
      }
      const alt = data.error;
      if (typeof alt === "string" && alt.trim()) {
        return alt.trim();
      }
      const errors = data.errors;
      if (isRecord(errors)) {
        for (const key of Object.keys(errors)) {
          const val = errors[key];
          if (
            Array.isArray(val) &&
            typeof val[0] === "string" &&
            val[0].trim()
          ) {
            return val[0].trim();
          }
          if (typeof val === "string" && val.trim()) {
            return val.trim();
          }
        }
      }
    }
    if (typeof err.message === "string" && err.message) {
      return err.message;
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}
