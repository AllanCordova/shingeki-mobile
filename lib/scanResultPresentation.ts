import type { SecurityLevel, SystemResult } from "@/schemas/systemResult";

export type ResultViewMode = "friendly" | "technical";

const ATTACK_FRIENDLY: Record<string, { title: string; summary: string }> = {
  SQL_INJECTION: {
    title: "SQL injection",
    summary:
      "An attacker may send special commands through search fields or forms and make the database respond in unintended ways, potentially exposing, changing, or deleting data.",
  },
  XSS: {
    title: "Malicious script (XSS)",
    summary:
      "Dangerous code may be injected into the page and run in a visitor's browser, allowing session theft, redirects, or changes to what the user sees.",
  },
  CSRF: {
    title: "Forged action (CSRF)",
    summary:
      "Another website may trick an authenticated user's browser into performing actions without their awareness, such as changing data or confirming operations.",
  },
  PATH_TRAVERSAL: {
    title: "Server file access",
    summary:
      "An attacker may attempt to read files outside the allowed application folders, such as sensitive configuration files or backups.",
  },
  SSRF: {
    title: "Server-side request forgery",
    summary:
      "The server may be tricked into accessing internal or external addresses that should not be exposed.",
  },
};

const LOCATION_FRIENDLY: Record<string, string> = {
  QUERY_PARAM: "in the URL (search or link parameters)",
  FORM: "in a form submitted by the site",
  HEADER: "in the HTTP request headers",
  BODY: "in the request body",
  COOKIE: "in cookies sent by the browser",
};

const LEVEL_FRIENDLY: Record<
  SecurityLevel,
  { label: string; hint: string }
> = {
  LOW: {
    label: "Low risk",
    hint: "Limited impact, but it should still be fixed before it grows into a bigger issue.",
  },
  MEDIUM: {
    label: "Medium risk",
    hint: "This can be exploited in real scenarios; plan a fix soon.",
  },
  HIGH: {
    label: "High risk",
    hint: "Urgent fix recommended. This may expose data or compromise the system.",
  },
};

const EVIDENCE_FRIENDLY: Record<string, string> = {
  "SQL error pattern":
    "The server showed database error messages, which is a common sign of SQL injection.",
  "Payload reflected in response body":
    "The test input appeared back on the page, which suggests the site did not properly filter user input.",
};

const DEFAULT_ATTACK = {
  title: "Security issue detected",
  summary:
    "The scan found suspicious behavior on this route. A specialist should review the technical details and apply the appropriate fix.",
};

export function extractRoutePath(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.search.length > 40) {
      return `${parsed.pathname}?…`;
    }
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    const withoutHost = url.replace(/^https?:\/\/[^/]+/i, "");
    if (withoutHost.length > 80) {
      return `${withoutHost.slice(0, 77)}…`;
    }
    return withoutHost || url;
  }
}

export function extractRoutePathShort(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname || "/";
  } catch {
    const match = url.match(/\/[^?#]+/);
    return match?.[0] ?? url.slice(0, 60);
  }
}

function matchEvidenceFriendly(evidence: string): string | null {
  for (const [key, text] of Object.entries(EVIDENCE_FRIENDLY)) {
    if (evidence.toLowerCase().includes(key.toLowerCase())) {
      return text;
    }
  }
  return null;
}

export function getFriendlyPresentation(result: SystemResult) {
  const category = result.attack?.category ?? "";
  const attack =
    ATTACK_FRIENDLY[category] ??
    (category
      ? {
          title: category.replace(/_/g, " "),
          summary: DEFAULT_ATTACK.summary,
        }
      : DEFAULT_ATTACK);

  const location = result.attack?.target_location;
  const where = location
    ? (LOCATION_FRIENDLY[location] ??
      `at ${location.replace(/_/g, " ").toLowerCase()}`)
    : "in an accessible area of the site";

  const level = LEVEL_FRIENDLY[result.security_lvl];
  const evidenceExplain =
    matchEvidenceFriendly(result.evidence) ??
    "The automated test detected behavior that indicates a vulnerability on this route.";

  return {
    title: attack.title,
    summary: attack.summary,
    where,
    levelLabel: level.label,
    levelHint: level.hint,
    evidenceExplain,
    routeLabel: extractRoutePathShort(result.vulnerable_route),
  };
}

export function getTechnicalRows(result: SystemResult) {
  return [
    { label: "Full route", value: result.vulnerable_route },
    { label: "Payload", value: result.payload_used },
    { label: "Evidence", value: result.evidence },
    { label: "HTTP request", value: result.http_request },
    {
      label: "Category",
      value: result.attack?.category ?? "—",
    },
    {
      label: "Attack location",
      value: result.attack?.target_location ?? "—",
    },
    { label: "Level", value: result.security_lvl },
  ];
}
