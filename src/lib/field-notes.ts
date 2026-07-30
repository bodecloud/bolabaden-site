/**
 * Field-notes loader and frontmatter parser.
 *
 * CONTEXT: Discovery/Reference (Home Field Notes)
 * Loads short, frequent posts from /src/content/field-notes/. A parallel
 * structure to src/lib/guides.ts, not a shared loader -- notes sort by an
 * explicit frontmatter date (guides have no date field; they derive one
 * from file stat) and have no difficulty rating.
 */

import "server-only";

import { cache } from "react";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { FieldNote } from "./types";

type FieldNoteFrontmatter = {
  description?: string;
  date?: string;
  derivedFromPrivateCorpus?: boolean;
  approvedBy?: string;
};

const FIELD_NOTES_DIR = path.join(
  process.cwd(),
  "src",
  "content",
  "field-notes",
);

export class FieldNoteValidationError extends Error {}

/**
 * Parses a "YYYY-MM-DD" frontmatter date as a local calendar day, not a
 * UTC instant -- `new Date("2026-07-30")` parses as UTC midnight, which
 * a negative-UTC-offset host then displays as the previous day. Returns
 * an invalid Date for anything that doesn't match the plain-date shape,
 * rather than falling back to the ambiguous UTC parse this function
 * exists to avoid.
 */
export function parseFieldNoteDate(value: string): Date {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return new Date(NaN);
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function normalizeSlug(fileName: string): string {
  return path
    .basename(fileName, path.extname(fileName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTitleFromFilename(fileName: string): string {
  const rawBaseName = path.basename(fileName, path.extname(fileName));
  return rawBaseName
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(" ");
}

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export function parseFieldNoteFrontmatter(rawMarkdown: string): {
  frontmatter: FieldNoteFrontmatter;
  content: string;
} {
  if (!rawMarkdown.startsWith("---\n")) {
    return { frontmatter: {}, content: rawMarkdown.trim() };
  }

  const separatorIndex = rawMarkdown.indexOf("\n---\n", 4);
  if (separatorIndex === -1) {
    return { frontmatter: {}, content: rawMarkdown.trim() };
  }

  const rawFrontmatter = rawMarkdown.slice(4, separatorIndex).trim();
  const content = rawMarkdown.slice(separatorIndex + 5).trim();

  const frontmatter: FieldNoteFrontmatter = {};

  for (const line of rawFrontmatter.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const keyValueMatch = line.match(/^([a-zA-Z][a-zA-Z0-9_-]*):\s*(.*)$/);
    if (!keyValueMatch) continue;

    const key = keyValueMatch[1].trim();
    const rawValue = keyValueMatch[2].trim();

    if (key === "description") {
      frontmatter.description = stripQuotes(rawValue);
    } else if (key === "date") {
      frontmatter.date = stripQuotes(rawValue);
    } else if (key === "approvedBy") {
      frontmatter.approvedBy = stripQuotes(rawValue);
    } else if (key === "derivedFromPrivateCorpus") {
      frontmatter.derivedFromPrivateCorpus =
        stripQuotes(rawValue).toLowerCase() === "true";
    }
  }

  return { frontmatter, content };
}

/**
 * Validates a single note's frontmatter against R18/R21: date is always
 * required; approvedBy is required and non-blank only when the note is
 * flagged as derived from the private corpus. Throws rather than falling
 * back to a masking default, so a bad note fails the build loudly.
 */
export function validateFieldNoteFrontmatter(
  frontmatter: FieldNoteFrontmatter,
  fileName: string,
): void {
  if (
    !frontmatter.date ||
    isNaN(parseFieldNoteDate(frontmatter.date).getTime())
  ) {
    throw new FieldNoteValidationError(
      `Field note "${fileName}" is missing a valid "date" frontmatter field.`,
    );
  }

  if (frontmatter.derivedFromPrivateCorpus) {
    const approver = frontmatter.approvedBy?.trim();
    if (!approver) {
      throw new FieldNoteValidationError(
        `Field note "${fileName}" is flagged derivedFromPrivateCorpus but has no non-blank "approvedBy" value.`,
      );
    }
  }
}

async function directoryExists(directoryPath: string): Promise<boolean> {
  try {
    const stats = await stat(directoryPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function readFieldNotesFromDirectory(
  directoryPath: string,
): Promise<FieldNote[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && /\.md$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const notes = await Promise.all(
    markdownFiles.map(async (fileName): Promise<FieldNote | null> => {
      const filePath = path.join(directoryPath, fileName);
      const rawMarkdown = await readFile(filePath, "utf8");
      const { frontmatter, content } = parseFieldNoteFrontmatter(rawMarkdown);

      try {
        validateFieldNoteFrontmatter(frontmatter, fileName);
      } catch (error) {
        // A single bad note must not take down every page that reads the
        // field-notes feed (home, /notes, /notes/[slug], /sitemap.xml).
        // Skip and log loudly instead of throwing through the aggregate.
        console.error(`[field-notes] Skipping "${fileName}":`, error);
        return null;
      }

      const slug = normalizeSlug(fileName);
      const title = normalizeTitleFromFilename(fileName);
      const derivedFromPrivateCorpus =
        frontmatter.derivedFromPrivateCorpus ?? false;

      return {
        id: slug,
        slug,
        title,
        description: frontmatter.description || "",
        content,
        date: parseFieldNoteDate(frontmatter.date!),
        derivedFromPrivateCorpus,
        approvedBy: derivedFromPrivateCorpus
          ? frontmatter.approvedBy!.trim()
          : null,
      } satisfies FieldNote;
    }),
  );

  return notes
    .filter((note): note is FieldNote => note !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const getFieldNotes = cache(async (): Promise<FieldNote[]> => {
  if (!(await directoryExists(FIELD_NOTES_DIR))) {
    return [];
  }
  return readFieldNotesFromDirectory(FIELD_NOTES_DIR);
});

export const getFieldNoteBySlug = cache(
  async (slug: string): Promise<FieldNote | null> => {
    const normalized = slug.trim().toLowerCase();
    if (!normalized) return null;
    const notes = await getFieldNotes();
    return notes.find((note) => note.slug === normalized) ?? null;
  },
);
