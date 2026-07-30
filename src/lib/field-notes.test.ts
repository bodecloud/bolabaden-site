import { describe, expect, it } from "vitest";
import {
  FieldNoteValidationError,
  parseFieldNoteDate,
  parseFieldNoteFrontmatter,
  validateFieldNoteFrontmatter,
} from "./field-notes";

describe("parseFieldNoteDate", () => {
  it("parses a plain YYYY-MM-DD date as the same local calendar day", () => {
    const date = parseFieldNoteDate("2026-07-30");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(6);
    expect(date.getDate()).toBe(30);
  });

  it("does not shift the day backward regardless of host timezone", () => {
    // new Date("2026-07-30") parses as UTC midnight, which a negative-UTC
    // host renders as July 29 -- this is exactly the bug parseFieldNoteDate
    // exists to avoid.
    const naive = new Date("2026-07-30");
    const local = parseFieldNoteDate("2026-07-30");
    expect(local.getDate()).toBe(30);
    if (naive.getTimezoneOffset() > 0) {
      expect(local.getDate()).not.toBe(naive.getDate());
    }
  });

  it("returns an invalid Date for a malformed date string", () => {
    expect(isNaN(parseFieldNoteDate("not-a-date").getTime())).toBe(true);
  });

  it("returns an invalid Date for single-digit month/day instead of falling back to UTC parsing", () => {
    // A fallback to `new Date(value)` here would reintroduce the exact
    // timezone bug this function exists to avoid.
    expect(isNaN(parseFieldNoteDate("2026-7-3").getTime())).toBe(true);
  });
});

describe("parseFieldNoteFrontmatter", () => {
  it("parses description, date, and derivedFromPrivateCorpus from frontmatter", () => {
    const raw = `---
description: A short note
date: 2026-07-30
derivedFromPrivateCorpus: true
approvedBy: Boden Crouch
---

Body content here.`;
    const { frontmatter, content } = parseFieldNoteFrontmatter(raw);
    expect(frontmatter.description).toBe("A short note");
    expect(frontmatter.date).toBe("2026-07-30");
    expect(frontmatter.derivedFromPrivateCorpus).toBe(true);
    expect(frontmatter.approvedBy).toBe("Boden Crouch");
    expect(content).toBe("Body content here.");
  });

  it("returns empty frontmatter and trimmed content when there is no frontmatter block", () => {
    const raw = "Just a plain note with no frontmatter.";
    const { frontmatter, content } = parseFieldNoteFrontmatter(raw);
    expect(frontmatter).toEqual({});
    expect(content).toBe("Just a plain note with no frontmatter.");
  });

  it("defaults derivedFromPrivateCorpus to unset when absent", () => {
    const raw = `---
description: Public note
date: 2026-07-01
---

Body.`;
    const { frontmatter } = parseFieldNoteFrontmatter(raw);
    expect(frontmatter.derivedFromPrivateCorpus).toBeUndefined();
  });

  it("parses derivedFromPrivateCorpus case-insensitively", () => {
    const raw = `---
date: 2026-07-01
derivedFromPrivateCorpus: True
---

Body.`;
    const { frontmatter } = parseFieldNoteFrontmatter(raw);
    expect(frontmatter.derivedFromPrivateCorpus).toBe(true);
  });
});

describe("validateFieldNoteFrontmatter", () => {
  it("passes for a valid public note (no date privacy flag needed)", () => {
    expect(() =>
      validateFieldNoteFrontmatter(
        { description: "x", date: "2026-07-30" },
        "public-note.md",
      ),
    ).not.toThrow();
  });

  it("throws when date is missing", () => {
    expect(() =>
      validateFieldNoteFrontmatter({ description: "x" }, "no-date.md"),
    ).toThrow(FieldNoteValidationError);
  });

  it("throws when date is not a valid date string", () => {
    expect(() =>
      validateFieldNoteFrontmatter(
        { date: "not-a-date" },
        "bad-date.md",
      ),
    ).toThrow(FieldNoteValidationError);
  });

  it("throws when derivedFromPrivateCorpus is true and approvedBy is missing", () => {
    expect(() =>
      validateFieldNoteFrontmatter(
        { date: "2026-07-30", derivedFromPrivateCorpus: true },
        "unapproved.md",
      ),
    ).toThrow(FieldNoteValidationError);
  });

  it("throws when derivedFromPrivateCorpus is true and approvedBy is whitespace-only", () => {
    expect(() =>
      validateFieldNoteFrontmatter(
        {
          date: "2026-07-30",
          derivedFromPrivateCorpus: true,
          approvedBy: "   ",
        },
        "blank-approver.md",
      ),
    ).toThrow(FieldNoteValidationError);
  });

  it("passes when derivedFromPrivateCorpus is true and approvedBy is a real value", () => {
    expect(() =>
      validateFieldNoteFrontmatter(
        {
          date: "2026-07-30",
          derivedFromPrivateCorpus: true,
          approvedBy: "Boden Crouch",
        },
        "approved.md",
      ),
    ).not.toThrow();
  });
});
