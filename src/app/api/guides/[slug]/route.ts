import { NextRequest, NextResponse } from "next/server";
import { getGuideBySlug } from "@/lib/guides";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const guide = await getGuideBySlug(slug);
  if (!guide) {
    return NextResponse.json({ error: "guide not found" }, { status: 404 });
  }
  return NextResponse.json({
    slug: guide.slug,
    title: guide.title,
    description: guide.description,
    category: guide.category,
    difficulty: guide.difficulty,
    estimatedTime: guide.estimatedTime,
    prerequisites: guide.prerequisites,
    technologies: guide.technologies,
    content: guide.content,
    updatedAt: guide.updatedAt,
    createdAt: guide.createdAt,
  });
}
