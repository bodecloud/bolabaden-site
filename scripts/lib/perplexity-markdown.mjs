function extractAnswer(blocks = []) {
  for (const usage of ["ask_text_0_markdown", "ask_text"]) {
    for (const block of blocks) {
      if (block.intended_usage === usage && block.markdown_block?.answer) {
        return block.markdown_block.answer;
      }
    }
  }
  for (const block of blocks) {
    if (block.markdown_block?.answer) return block.markdown_block.answer;
  }
  return "";
}

function extractSources(blocks = []) {
  for (const block of blocks) {
    if (block.intended_usage === "web_results" && block.web_result_block?.web_results) {
      return block.web_result_block.web_results.map((wr) => ({
        title: wr.name || wr.url,
        url: wr.url,
        snippet: wr.snippet || "",
      }));
    }
  }
  return [];
}

export function threadToMarkdown(threadDetail, meta = {}) {
  const uuid = meta.uuid || meta.context_uuid || "unknown";
  const slug = meta.slug || meta.thread_url_slug || uuid;
  const title =
    threadDetail?.thread_metadata?.title ||
    meta.title ||
    meta.query_str ||
    slug;
  const url = `https://www.perplexity.ai/search/${slug}`;

  const lines = [
    "---",
    `source_url: "${url}"`,
    `thread_uuid: "${uuid}"`,
    `slug: "${String(slug).replace(/"/g, '\\"')}"`,
    `title: "${String(title).replace(/"/g, '\\"')}"`,
    `extracted_at: "${new Date().toISOString()}"`,
    `matched_keywords: ${JSON.stringify(meta.matched_keywords || [])}`,
    `export_suite: "${String(meta.export_suite || "infra").replace(/"/g, '\\"')}"`,
    `entry_count: ${threadDetail?.entries?.length || 0}`,
    "provenance: perplexity-rest-api",
    "---",
    "",
    `# ${title}`,
    "",
    `Source: [Perplexity thread](${url})`,
    "",
  ];

  for (const entry of threadDetail?.entries || []) {
    const query = entry.query_str || "(no query)";
    lines.push(`## User`, "", query, "");

    const answer = extractAnswer(entry.blocks);
    lines.push(`## Assistant`, "");
    if (answer) {
      lines.push(answer, "");
    } else {
      lines.push("_(No answer text in API response)_", "");
    }

    const sources = extractSources(entry.blocks);
    if (sources.length > 0) {
      lines.push("### Sources", "");
      for (const src of sources) {
        lines.push(`- [${src.title}](${src.url})`);
        if (src.snippet) lines.push(`  - ${src.snippet.replace(/\n/g, " ")}`);
      }
      lines.push("");
    }
  }

  return { title, markdown: lines.join("\n"), entryCount: threadDetail?.entries?.length || 0 };
}
