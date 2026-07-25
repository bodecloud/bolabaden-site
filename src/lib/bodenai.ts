import "server-only";

import { config } from "@/lib/config";

export function isBodenaiEnabled(): boolean {
  return config.BODENAI_ENABLED;
}

export function bodenBaseUrl(): string {
  return config.BODENAI_BASE_URL.replace(/\/+$/, "");
}

function twinHeaders(): HeadersInit {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = config.BODENAI_SERVICE_TOKEN.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers["X-BodenAI-Token"] = token;
  }
  return headers;
}

export async function fetchBodenHealth(): Promise<Record<string, unknown>> {
  if (!config.BODENAI_ENABLED) {
    return { ok: false, error: "BodenAI disabled" };
  }
  try {
    const res = await fetch(`${bodenBaseUrl()}/health`, {
      headers: twinHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { ok: false, error: `health ${res.status}` };
    return (await res.json()) as Record<string, unknown>;
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "health failed",
    };
  }
}

export async function proxyBodenChat(body: unknown): Promise<Response> {
  if (!config.BODENAI_ENABLED) {
    return Response.json({ error: "BodenAI disabled" }, { status: 503 });
  }
  return fetch(`${bodenBaseUrl()}/v1/chat`, {
    method: "POST",
    headers: {
      ...twinHeaders(),
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}
