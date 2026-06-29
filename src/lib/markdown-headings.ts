import type { TocItem } from "@/components/side-toc";
import { slugify } from "@/lib/utils";

type ExtractMarkdownHeadingsOptions = {
  minLevel?: number;
  maxLevel?: number;
};

/**
 * Extract in-page heading anchors from markdown (matches rehype-slug output).
 */
export function extractMarkdownHeadings(
  content: string,
  { minLevel = 2, maxLevel = 2 }: ExtractMarkdownHeadingsOptions = {},
): TocItem[] {
  const items: TocItem[] = [];
  const seen = new Set<string>();

  for (const line of content.split("\n")) {
    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const level = match[1].length;
    if (level < minLevel || level > maxLevel) continue;

    const label = match[2].trim();
    let id = slugify(label);
    const base = id;
    let counter = 1;
    while (seen.has(id)) {
      id = `${base}-${counter++}`;
    }
    seen.add(id);
    items.push({ id, label });
  }

  return items;
}
