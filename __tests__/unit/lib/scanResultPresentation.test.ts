import {
  extractRoutePathShort,
  getFriendlyPresentation,
} from "@/lib/scanResultPresentation";
import type { SystemResult } from "@/schemas/systemResult";

const baseResult: SystemResult = {
  id: "1",
  system_id: "s1",
  attack_id: "a1",
  vulnerable_route:
    "http://host.docker.internal:8888/search.php?q=%27+OR+%271%27%3D%271%27+--",
  payload_used: "' OR '1'='1' --",
  evidence: "SQL error pattern: SQL syntax",
  http_request: "GET /search.php HTTP/1.1",
  security_lvl: "HIGH",
  created_at: "2026-05-18T16:30:18.000000Z",
  updated_at: "2026-05-18T16:30:18.000000Z",
  attack: {
    id: "a1",
    category: "SQL_INJECTION",
    target_location: "QUERY_PARAM",
  },
};

describe("extractRoutePathShort", () => {
  it("returns pathname only", () => {
    expect(extractRoutePathShort(baseResult.vulnerable_route)).toBe(
      "/search.php",
    );
  });
});

describe("getFriendlyPresentation", () => {
  it("returns SQL injection friendly copy", () => {
    const p = getFriendlyPresentation(baseResult);
    expect(p.title).toBe("SQL injection");
    expect(p.summary).toMatch(/database/i);
    expect(p.where).toMatch(/URL/i);
    expect(p.levelLabel).toBe("High risk");
  });

  it("handles XSS category", () => {
    const p = getFriendlyPresentation({
      ...baseResult,
      security_lvl: "MEDIUM",
      evidence: "Payload reflected in response body",
      attack: {
        id: "a2",
        category: "XSS",
        target_location: "FORM",
      },
    });
    expect(p.title).toBe("Malicious script (XSS)");
    expect(p.evidenceExplain).toMatch(/appeared back/i);
  });
});
