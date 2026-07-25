import { NextResponse } from "next/server";
import { getGuides } from "@/lib/guides";

export async function GET() {
  const guides = await getGuides();
  return NextResponse.json({
    guides: guides.map((g) => ({
      slug: g.slug,
      title: g.title,
      description: g.description,
      category: g.category,
      difficulty: g.difficulty,
      estimatedTime: g.estimatedTime,
      technologies: g.technologies,
      updatedAt: g.updatedAt,
    })),
    lastUpdated: new Date().toISOString(),
  });
}
