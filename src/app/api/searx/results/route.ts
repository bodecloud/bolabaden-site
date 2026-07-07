import { NextRequest, NextResponse } from "next/server";
import { fetchSearxResults } from "@/lib/searx";

/**
 * GET /api/searx/results?q=
 * JSON proxy for SearXNG search results (on-site search page).
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";
  const result = await fetchSearxResults(query);

  if (!result.ok) {
    return NextResponse.json(
      {
        query,
        results: [],
        error: result.error,
        lastUpdated: new Date().toISOString(),
      },
      { status: query ? 502 : 400 },
    );
  }

  return NextResponse.json({
    query,
    results: result.results,
    source: result.source,
    lastUpdated: new Date().toISOString(),
  });
}
