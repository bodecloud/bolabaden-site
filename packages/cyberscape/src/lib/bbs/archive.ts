import assignments from "@/data/archive-assignments.json";

export interface ArchiveEntry {
  id: string;
  source_url: string;
  license_class: "public" | "dev-only";
  assignable_tags: string[];
  notes?: string;
}

const entries = assignments.entries as ArchiveEntry[];

export function listByTag(tag: string): ArchiveEntry[] {
  return entries.filter((e) => e.assignable_tags.includes(tag));
}

export function formatFileAreas(tag = "bbs"): string[] {
  const matched = listByTag(tag);
  if (!matched.length) {
    return ["No archive assignments for this tag."];
  }
  return [
    `File areas (archive-manifest, tag=${tag}):`,
    ...matched.map(
      (e, i) =>
        `  [${i + 1}] ${e.id} (${e.license_class}) — ${e.notes ?? e.source_url}`
    ),
  ];
}
