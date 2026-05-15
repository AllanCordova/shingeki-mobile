import { Platform } from "react-native";

const STORAGE_KEY = "shingeki_auth_token";

function isWebLocalStorage(): boolean {
  return (
    Platform.OS === "web" &&
    typeof globalThis !== "undefined" &&
    typeof globalThis.localStorage !== "undefined"
  );
}

export function getPersistedToken(): string | null {
  if (!isWebLocalStorage()) return null;
  try {
    return globalThis.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setPersistedToken(token: string): void {
  if (!isWebLocalStorage()) return;
  try {
    globalThis.localStorage.setItem(STORAGE_KEY, token);
  } catch {
    /* ignore quota / private mode */
  }
}

export function removePersistedToken(): void {
  if (!isWebLocalStorage()) return;
  try {
    globalThis.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
