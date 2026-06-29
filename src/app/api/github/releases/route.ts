import { NextResponse } from "next/server";
import { fetchRecentReleases } from "@/lib/github-releases";

/**
 * GET /api/github/releases
 * Recent GitHub release notes for the home future section.
 */
export async function GET() {
  try {
    const releases = await fetchRecentReleases();

    return NextResponse.json({
      releases,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch GitHub releases:", error);

    return NextResponse.json(
      {
        releases: [],
        lastUpdated: new Date().toISOString(),
        error: "Failed to fetch release data",
      },
      { status: 500 },
    );
  }
}
