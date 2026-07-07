function sortResponses(responses) {
  return [...responses].sort((a, b) => {
    const ta = Date.parse(a.createTime || 0) || 0;
    const tb = Date.parse(b.createTime || 0) || 0;
    return ta - tb;
  });
}

function roleLabel(response) {
  const sender = String(response.sender || "").toLowerCase();
  if (sender === "human") return "User";
  if (sender === "assistant" || sender === "grok") return "Assistant";
  return response.sender || "Unknown";
}

export function conversationToMarkdown(convo, responses, { extractedAt = new Date().toISOString() } = {}) {
  const id = convo.conversationId;
  const title = convo.title || "(untitled)";
  const sorted = sortResponses(responses || []);

  const lines = [
    "---",
    `source_url: "https://grok.com/c/${id}"`,
    `conversation_id: "${id}"`,
    `title: "${String(title).replace(/"/g, '\\"')}"`,
    `extracted_at: "${extractedAt}"`,
    `message_count: ${sorted.length}`,
    `export_suite: "${String(convo.export_suite || "infra").replace(/"/g, '\\"')}"`,
    "provenance: grok-rest-api",
    "---",
    "",
    `# ${title}`,
    "",
    `Source: [Grok conversation](https://grok.com/c/${id})`,
    "",
  ];

  for (const r of sorted) {
    const label = roleLabel(r);
    lines.push(`## ${label}`, "");
    if (r.createTime) lines.push(`_Time: ${r.createTime}_`, "");
    lines.push(r.message || "", "");
    if (r.generatedImageUrls?.length) {
      lines.push("**Generated images:**", "");
      for (const url of r.generatedImageUrls) lines.push(`- ${url}`);
      lines.push("");
    }
  }

  return {
    markdown: lines.join("\n"),
    title,
    messageCount: sorted.length,
  };
}
