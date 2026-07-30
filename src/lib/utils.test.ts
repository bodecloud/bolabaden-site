import { describe, expect, it, vi } from "vitest";
import { cn, debounce, formatDate, slugify, truncate } from "./utils";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});

describe("formatDate", () => {
  it("formats a date as long-form US English", () => {
    // formatDate has no explicit timeZone, so Intl.DateTimeFormat renders in
    // the host's local timezone — construct the input the same way so the
    // test doesn't depend on which timezone CI/dev happens to run in.
    expect(formatDate(new Date(2026, 0, 15))).toBe("January 15, 2026");
  });
});

describe("truncate", () => {
  it("leaves short text untouched", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates and appends an ellipsis when text exceeds length", () => {
    expect(truncate("hello world", 5)).toBe("hello...");
  });

  it("treats exact-length text as not needing truncation", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips punctuation", () => {
    expect(slugify("What's New?!")).toBe("whats-new");
  });

  it("collapses runs of separators into one hyphen", () => {
    expect(slugify("a   b---c__d")).toBe("a-b-c-d");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("-leading and trailing-")).toBe("leading-and-trailing");
  });
});

describe("debounce", () => {
  it("only invokes the wrapped function once after the delay, using the last call's args", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("first");
    debounced("second");
    debounced("third");

    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("third");

    vi.useRealTimers();
  });
});
