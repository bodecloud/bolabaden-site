#!/usr/bin/env node
/**
 * Convert OpenAI "Export data" zip/json to knowledgebase markdown.
 * Settings → Data controls → Export data (no Cloudflare scraping).
 *
 * Usage:
 *   node scripts/convert-chatgpt-export.mjs /path/to/conversations.json
 *   node scripts/convert-chatgpt-export.mjs /path/to/export.zip
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const MANIFEST = path.join(ROOT, "scripts/chatgpt-conversation-ids.json");
const OUT_DIR = path.join(ROOT, "docs/knowledgebase/90-meta/chatgpt-exports/conversations");
const INDEX_PATH = path.join(ROOT, "docs/knowledgebase/90-meta/chatgpt-exports/index.md");

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/convert-chatgpt-export.mjs <conversations.json|export.zip>");
  process.exit(1);
}

function slugify(title) {
  return (title || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled";
}

function resolveJsonPath(p) {
  if (p.endsWith(".zip")) {
    const tmp = fs.mkdtempSync(path.join(ROOT, "scripts/.chatgpt-export-"));
    execSync(`unzip -o -q "${p}" -d "${tmp}"`);
    const candidates = [
      path.join(tmp, "conversations.json"),
      path.join(tmp, "chat.html"),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c) && c.endsWith(".json")) return c;
    }
    const found = execSync(`find "${tmp}" -name conversations.json -print -quit`, { encoding: "utf8" }).trim();
    if (!found) throw new Error("No conversations.json in zip");
    return found;
  }
  return p;
}

function messageText(message) {
  if (!message?.content?.parts) return "";
  return message.content.parts
    .map((p) => (typeof p === "string" ? p : p?.text || ""))
    .filter(Boolean)
    .join("\n")
    .trim();
}

function walkMessages(mapping, currentId, out) {
  const node = mapping[currentId];
  if (!node) return;
  if (node.parent) walkMessages(mapping, node.parent, out);
  const msg = node.message;
  if (msg?.content) {
    const text = messageText(msg);
    if (text) {
      out.push({
        role: msg.author?.role || "unknown",
        text,
        create_time: msg.create_time,
      });
    }
  }
}

function loadFilterIds() {
  if (!fs.existsSync(MANIFEST)) return null;
  const data = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  return new Set(data.conversation_ids || []);
}

function updateIndex(entries) {
  const header = [
    "# ChatGPT conversation exports",
    "",
    "From OpenAI official data export and/or UI extraction.",
    "",
    "| Title | Conversation ID | File |",
    "| --- | --- | --- |",
  ];
  const rows = entries
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((e) => `| ${e.title.replace(/\|/g, "\\|")} | \`${e.id}\` | [${e.file}](./conversations/${e.file}) |`);
  fs.writeFileSync(INDEX_PATH, [...header, ...rows, ""].join("\n"));
}

const jsonPath = resolveJsonPath(path.resolve(input));
const conversations = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const filter = loadFilterIds();

fs.mkdirSync(OUT_DIR, { recursive: true });

const indexEntries = [];
let written = 0;
let skipped = 0;

for (const conv of conversations) {
  const id = conv.conversation_id || conv.id;
  if (!id) continue;
  if (filter && !filter.has(id)) {
    skipped++;
    continue;
  }

  const messages = [];
  if (conv.mapping && conv.current_node) {
    walkMessages(conv.mapping, conv.current_node, messages);
  }

  const title = conv.title || id;
  const filename = `${slugify(title)}__${id}.md`;
  const lines = [
    "---",
    `source_url: "https://chatgpt.com/c/${id}"`,
    `conversation_id: "${id}"`,
    `title: "${title.replace(/"/g, '\\"')}"`,
    `extracted_at: "${new Date().toISOString()}"`,
    `message_count: ${messages.length}`,
    "provenance: openai-export",
    "---",
    "",
    `# ${title}`,
    "",
    `Source: [ChatGPT conversation](https://chatgpt.com/c/${id})`,
    "",
  ];

  for (const msg of messages) {
    const label =
      msg.role === "user" ? "User" : msg.role === "assistant" ? "Assistant" : msg.role;
    lines.push(`## ${label}`, "", msg.text, "");
  }

  fs.writeFileSync(path.join(OUT_DIR, filename), lines.join("\n"), "utf8");
  indexEntries.push({ id, title, file: filename });
  written++;
}

updateIndex(indexEntries);
console.log(`Wrote ${written} conversation(s) to ${OUT_DIR}`);
if (filter) console.log(`Skipped ${skipped} not in manifest filter`);
