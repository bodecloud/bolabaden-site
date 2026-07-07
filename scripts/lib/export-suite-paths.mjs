import path from "node:path";

/** @typedef {"perplexity" | "chatgpt" | "grok"} ExportPlatform */

/**
 * @param {string[]} argv process.argv
 */
export function isIdentityMode(argv = process.argv) {
  return argv.includes("--identity") || process.env.EXPORT_SUITE === "identity";
}

/**
 * @param {string} root repo root
 * @param {ExportPlatform} platform
 * @param {boolean} identity
 */
export function suitePaths(root, platform, identity) {
  if (!identity) {
    const infra = {
      perplexity: {
        manifestPath: path.join(root, "scripts/perplexity-thread-manifest.json"),
        statusPath: path.join(root, "scripts/perplexity-export-status.json"),
        outDir: path.join(root, "docs/knowledgebase/90-meta/perplexity-exports/conversations"),
        indexPath: path.join(root, "docs/knowledgebase/90-meta/perplexity-exports/index.md"),
        indexTitle: "# Perplexity thread exports",
        indexDescription:
          "Infrastructure-related threads exported from perplexity.ai library (keyword discovery + REST API).",
      },
      chatgpt: {
        manifestPath: path.join(root, "scripts/chatgpt-conversation-manifest.json"),
        statusPath: path.join(root, "scripts/chatgpt-export-status.json"),
        outDir: path.join(root, "docs/knowledgebase/90-meta/chatgpt-exports/conversations"),
        indexPath: path.join(root, "docs/knowledgebase/90-meta/chatgpt-exports/index.md"),
        indexTitle: "# ChatGPT conversation exports",
        indexDescription: "Infrastructure-related ChatGPT conversations (keyword discovery).",
      },
      grok: {
        manifestPath: path.join(root, "scripts/grok-conversation-manifest.json"),
        statusPath: path.join(root, "scripts/grok-export-status.json"),
        outDir: path.join(root, "docs/knowledgebase/90-meta/grok-exports/conversations"),
        indexPath: path.join(root, "docs/knowledgebase/90-meta/grok-exports/index.md"),
        indexTitle: "# Grok conversation exports",
        indexDescription: "Infrastructure-related Grok conversations (keyword discovery).",
      },
    };
    return { ...infra[platform], suite: "infra", exportSuite: "infra" };
  }

  const base = path.join(root, "docs/knowledgebase/90-meta/identity-exports", platform);
  const names = {
    perplexity: "Perplexity",
    chatgpt: "ChatGPT",
    grok: "Grok",
  };
  const label = names[platform];
  return {
    manifestPath: path.join(root, `scripts/identity-${platform}-manifest.json`),
    statusPath: path.join(root, `scripts/identity-${platform}-export-status.json`),
    outDir: path.join(base, "conversations"),
    indexPath: path.join(base, "index.md"),
    indexTitle: `# ${label} identity exports`,
    indexDescription: `Full ${label} library — identity context (all conversations and messages).`,
    suite: "identity",
    exportSuite: "identity",
  };
}

/**
 * @param {string} root
 * @param {ExportPlatform} platform
 * @param {string[]} [argv]
 */
export function resolveSuitePaths(root, platform, argv = process.argv) {
  return suitePaths(root, platform, isIdentityMode(argv));
}
