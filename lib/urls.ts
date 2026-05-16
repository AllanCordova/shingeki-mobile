export function getApiBaseUrl(): string {
  return process.env.EXPO_PUBLIC_API_URL!;
}

export function getAppOrigin(): string {
  return getApiBaseUrl().replace(/\/api\/?$/, "");
}

export function resolveStorageUrl(relativePath: string | null): string | null {
  if (!relativePath?.trim()) return null;

  const path = relativePath.trim();
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const storageMatch = path.match(/\/storage\/(.+)$/i);
    if (storageMatch && path.includes("/api/")) {
      return `${getAppOrigin()}/storage/${storageMatch[1]}`;
    }
    return path;
  }

  const origin = getAppOrigin();
  const normalized = path.replace(/^\/+/, "");

  if (normalized.startsWith("storage/")) {
    return `${origin}/${normalized}`;
  }

  return `${origin}/storage/${normalized}`;
}

export function resolveSystemCoverUrl(system: {
  cover_url?: string | null;
  cover_path?: string | null;
}): string | null {
  const raw = system.cover_url?.trim() || system.cover_path?.trim() || null;
  return resolveStorageUrl(raw);
}
