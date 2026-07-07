import { messagesFromConversationJson } from "./chatgpt-api.mjs";

function yamlQuote(value) {
  return JSON.stringify(String(value ?? ""));
}

function roleHeading(role) {
  if (role === "user") return "## User";
  if (role === "assistant") return "## Assistant";
  if (role === "system") return "## System";
  if (role === "tool") return "## Tool";
  return `## ${role || "unknown"}`;
}

/**
 * Render a full ChatGPT conversation (all mapping nodes) to markdown.
 * @param {object} conv backend-api conversation JSON
 * @param {object} [meta]
 */
export function conversationToMarkdown(conv, meta = {}) {
  const id = meta.id || conv?.conversation_id || conv?.id || "unknown";
  const title = (meta.title || conv?.title || id).trim();
  const url = `https://chatgpt.com/c/${id}`;
  const messages = messagesFromConversationJson(conv);

  const lines = [
    "---",
    `source_url: ${yamlQuote(url)}`,
    `conversation_id: ${yamlQuote(id)}`,
    `title: ${yamlQuote(title)}`,
    `extracted_at: ${yamlQuote(new Date().toISOString())}`,
    `message_count: ${messages.length}`,
    `export_suite: ${yamlQuote(meta.export_suite || "identity")}`,
    `matched_keywords: ${JSON.stringify(meta.matched_keywords || [])}`,
    "provenance: chatgpt-backend-api",
    "---",
    "",
    `# ${title}`,
    "",
    `Source: [ChatGPT conversation](${url})`,
    "",
  ];

  if (messages.length === 0) {
    lines.push("_(No messages in conversation mapping)_", "");
  } else {
    for (const msg of messages) {
      lines.push(roleHeading(msg.role), "");
      if (msg.text) {
        lines.push(msg.text, "");
      } else {
        lines.push("_(Empty or non-text message)_", "");
      }
    }
  }

  return { title, markdown: lines.join("\n"), messageCount: messages.length };
}
