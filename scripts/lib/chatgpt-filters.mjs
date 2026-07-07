import fs from "node:fs";
import path from "node:path";

/**
 * Keyword / title filters for narrowing which ChatGPT conversations to export.
 * Matches against title, slug, and message preview text (case-insensitive).
 */

export function parseKeywordArgs(argv) {
  const keywords = [];
  let keywordsFile = null;
  let titleRegex = null;
  let matchMode = "any";
  let useDefaultKeywords = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--keyword" && argv[i + 1]) {
      keywords.push(argv[++i]);
    } else if (arg === "--keywords-file" && argv[i + 1]) {
      keywordsFile = argv[++i];
    } else if (arg === "--title-regex" && argv[i + 1]) {
      titleRegex = argv[++i];
    } else if (arg === "--match-mode" && argv[i + 1]) {
      matchMode = argv[++i] === "all" ? "all" : "any";
    } else if (arg === "--filter") {
      useDefaultKeywords = true;
    }
  }

  const filterEnabled =
    keywords.length > 0 || Boolean(keywordsFile) || Boolean(titleRegex) || useDefaultKeywords;

  return { keywords, keywordsFile, titleRegex, matchMode, filterEnabled, useDefaultKeywords };
}

export function loadKeywordsFromFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return [];
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return data.keywords || [];
}

export function resolveFilterConfig({
  keywords,
  keywordsFile,
  titleRegex,
  matchMode,
  filterEnabled,
  useDefaultKeywords,
  defaultKeywordsPath,
}) {
  let allKeywords = [...keywords];
  if (keywordsFile) {
    allKeywords.push(...loadKeywordsFromFile(keywordsFile));
  } else if (useDefaultKeywords && defaultKeywordsPath && fs.existsSync(defaultKeywordsPath)) {
    allKeywords.push(...loadKeywordsFromFile(defaultKeywordsPath));
  }

  allKeywords = [...new Set(allKeywords.map((k) => k.trim()).filter(Boolean))];

  // Filter only when there is something to match (keywords or title regex).
  // Empty default keyword file + --filter alone exports everything.
  const active = allKeywords.length > 0 || Boolean(titleRegex);

  let titleRe = null;
  if (titleRegex) {
    titleRe = new RegExp(titleRegex, "i");
  }

  return {
    active,
    keywords: allKeywords,
    titleRegex: titleRe,
    matchMode,
  };
}

export function matchesKeyword(text, keyword) {
  const t = text.toLowerCase();
  const k = keyword.toLowerCase();
  if (k === "ha") {
    return /\bha\b/.test(t) || t.includes("high availability");
  }
  if (k === "k8s") {
    return /\bk8s\b/.test(t) || t.includes("kubernetes");
  }
  return t.includes(k);
}

export function conversationHaystack({ title = "", preview = "", slug = "" } = {}) {
  return [title, preview, slug].filter(Boolean).join("\n").toLowerCase();
}

export function matchesFilters(haystack, { keywords, titleRegex, matchMode }) {
  const text = haystack.toLowerCase();
  const checks = [];

  if (titleRegex) {
    checks.push(titleRegex.test(text));
  }

  if (keywords.length > 0) {
    const keywordHits = keywords.map((kw) => matchesKeyword(text, kw));
    checks.push(matchMode === "all" ? keywordHits.every(Boolean) : keywordHits.some(Boolean));
  }

  if (checks.length === 0) return true;
  return matchMode === "all" ? checks.every(Boolean) : checks.some(Boolean);
}

export function findExistingExport(outDir, id) {
  if (!fs.existsSync(outDir)) return null;
  for (const name of fs.readdirSync(outDir)) {
    if (name.endsWith(`__${id}.md`)) {
      return path.join(outDir, name);
    }
  }
  return null;
}

export function knownHaystack(id, status, outDir) {
  const parts = [];
  if (status.completed[id]?.title) parts.push(status.completed[id].title);
  if (status.failed[id]?.title) parts.push(status.failed[id].title);

  const existing = findExistingExport(outDir, id);
  if (existing) {
    const slug = path.basename(existing, ".md").replace(new RegExp(`__${id}$`), "");
    parts.push(slug.replace(/-/g, " "));
    const head = fs.readFileSync(existing, "utf8").slice(0, 6000);
    parts.push(head);
  }

  return conversationHaystack({ title: parts.join("\n") });
}

export function prefilterIds(ids, status, outDir, filterConfig) {
  if (!filterConfig.active) return { included: ids, excluded: [] };

  const included = [];
  const excluded = [];

  for (const id of ids) {
    const haystack = knownHaystack(id, status, outDir);
    if (haystack.trim() && matchesFilters(haystack, filterConfig)) {
      included.push(id);
    } else if (!haystack.trim()) {
      included.push(id);
    } else {
      excluded.push(id);
    }
  }

  return { included, excluded };
}
