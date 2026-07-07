/**
 * Shared keyword matching for Perplexity / ChatGPT / Grok discovery & export filters.
 */

export function matchesKeyword(text, keyword) {
  const t = text.toLowerCase();
  const k = keyword.toLowerCase();
  if (k === "ha") {
    return (
      /\bha\b/.test(t) ||
      t.includes("high availability") ||
      t.includes("home assistant") ||
      /\bhaos\b/.test(t) ||
      /\bhassio\b/.test(t) ||
      /\bhass\b/.test(t)
    );
  }
  if (k === "k8s") {
    return /\bk8s\b/.test(t) || t.includes("kubernetes");
  }
  if (k === "infra") {
    return /\binfra\b/.test(t) || t.includes("infrastructure");
  }
  return t.includes(k);
}

export function matchKeywords(haystackText, keywords) {
  return keywords.filter((kw) => matchesKeyword(haystackText, kw));
}

export function metadataHaystack({ title = "", preview = "", query = "", slug = "" } = {}) {
  return [title, preview, query, slug].filter(Boolean).join("\n");
}

export function loadKeywordsFile(filePath, fs) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return data.keywords || [];
}

export function mergeKeywordFiles(paths, fs) {
  const merged = new Set();
  for (const p of paths) {
    if (!p || !fs.existsSync(p)) continue;
    for (const kw of loadKeywordsFile(p, fs)) {
      const trimmed = String(kw).trim();
      if (trimmed) merged.add(trimmed);
    }
  }
  return [...merged];
}
