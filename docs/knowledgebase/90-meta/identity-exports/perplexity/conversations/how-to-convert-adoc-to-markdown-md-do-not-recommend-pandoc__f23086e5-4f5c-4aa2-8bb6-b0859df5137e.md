---
source_url: "https://www.perplexity.ai/search/cff4cdab-149d-4484-ae60-5e77580aa397"
thread_uuid: "f23086e5-4f5c-4aa2-8bb6-b0859df5137e"
slug: "cff4cdab-149d-4484-ae60-5e77580aa397"
title: "How to convert *.adoc to markdown *.md? Do NOT recommend pandoc."
extracted_at: "2026-06-29T16:07:38.745Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# How to convert *.adoc to markdown *.md? Do NOT recommend pandoc.

Source: [Perplexity thread](https://www.perplexity.ai/search/cff4cdab-149d-4484-ae60-5e77580aa397)

## User

How to convert *.adoc to markdown *.md? Do NOT recommend pandoc.

## Assistant

To convert AsciiDoc (*.adoc) files to Markdown (*.md) without using Pandoc, you can use the tool **downdoc**. This tool is specifically designed to convert AsciiDoc to Markdown efficiently and is particularly useful for converting README files for npm packaging. Here’s how you can use it:

1. **Install Node.js**: Ensure that Node.js is installed on your system, as downdoc requires it to run.

2. **Use downdoc via npx**: You can run downdoc directly using npx, which comes with Node.js, without needing a separate installation:
   ```bash
   npx downdoc README.adoc
   ```

   This command will generate a Markdown file with the same name as the AsciiDoc file but with a `.md` extension (e.g., `README.md`). If you want to specify a different output file name, use the `-o` option:
   ```bash
   npx downdoc -o output.md README.adoc
   ```

3. **Piping Input and Output**: If you prefer to use pipes for input and output, you can do so by using `-` as the input path:
   ```bash
   cat README.adoc | npx downdoc -
   ```

This method provides a straightforward way to convert AsciiDoc files to Markdown without relying on Pandoc and is suitable for most cases where Markdown is required.[6]

### Sources

- [Converting AsciiDoc to Markdown - Keep Kalm](https://karinavarela.me/2020/05/06/converting-asciidoc-to-markdown/)
  - A quick way to convert asciidoc files to markdown, and tips on how to comfortably and easily work with markdown files without memorizing the whole sintax.
- [Converting Asciidoc to Markdown - Sil](https://sil.mt/blog/convert-asciidoc-to-markdown)
- [Convert codeblocks from asciidoc to markdown - Stack Overflow](https://stackoverflow.com/questions/61763475/convert-codeblocks-from-asciidoc-to-markdown)
  - I'm trying to convert some documents from asciidoc format to Markdown. Since pandoc can't do that on its own, I use asciidoctor too to convert to an intermediate docbook file: asciidoctor -v -a
- [Asciidoc to Markdown conversion (graceful downgrade) · Issue #1907](https://github.com/asciidoctor/asciidoctor/issues/1907)
  - Flat-file CMSs (such as Grav, Pico, ...) and some text editors (such as Scriveners) use Markdown. It is not possible to push all of them to support Asciidoc but there might be some interim advantag...
- [[Tip] How to convert AsciiDoc to Markdown](https://romankudryashov.com/blog/2020/02/how-to-convert-asciidoc-to-markdown/)
  - I write posts on this blog using AsciiDoc, but a couple of resources I repost on support only Markdown, so to convert articles I use the following commands: asciidoctor -b docbook index.adoc pandoc -f docbook -t markdown_mmd -o index.md index.xml --wrap=none The only question that remains is how to properly convert code listings' captures. Thanks to the authors of the following articles: https://tinyapps.org/blog/201701240700_convert_asciidoc_to_markdown.html...
- [opendevise/downdoc: Rapidly converts AsciiDoc to Markdown.](https://github.com/opendevise/downdoc)
  - Rapidly converts AsciiDoc to Markdown. Contribute to opendevise/downdoc development by creating an account on GitHub.
- [Markdown -> Asciidoc converter - Asciidoctor :: Discussion](https://discuss.asciidoctor.org/Markdown-gt-Asciidoc-converter-td6014.html)
  - Markdown -> Asciidoc converter. Has anyone a recommendation for Markdow to Asciidoc converter? When I use pandoc I got lot of Anchors, what is unnecessary ballast. Another issue is, that I prefer "="...
- [Tools to convert & Split Docx to Markdown/Asciidoc with Images](https://www.reddit.com/r/technicalwriting/comments/tkaizw/tools_to_convert_split_docx_to_markdownasciidoc/)
- [How to use AsciiDoctorJ in Gradle to convert .adoc files to Markdown](https://stackoverflow.com/questions/74899062/how-to-use-asciidoctorj-in-gradle-to-convert-adoc-files-to-markdown)
  - I'm currently replacing my Markdown files of my Java project with .adoc to get a seamless documentation across all modules, and I want to build a README.md out of it, preferable with the Gradle plu...
- [Online MD to ADOC ASCIIDOCTOR Converter - Vertopal](https://www.vertopal.com/en/convert/md-to-adoc-asciidoctor)
  - Convert MD markup documents to ADOC ASCIIDOCTOR file format using Vertopal free online converter tools. You can edit and optimize your documents.
