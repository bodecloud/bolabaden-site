---
source_url: "https://grok.com/c/0c08ebc5-6d0d-4b5e-8dd7-977a6e13c7c9"
conversation_id: "0c08ebc5-6d0d-4b5e-8dd7-977a6e13c7c9"
title: "Free PDF to Markdown with Image Extraction"
extracted_at: "2026-06-29T16:10:05.347Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Free PDF to Markdown with Image Extraction

Source: [Grok conversation](https://grok.com/c/0c08ebc5-6d0d-4b5e-8dd7-977a6e13c7c9)

## User

_Time: 2026-02-24T03:04:53.495Z_

I have a pdf with text and images. I need it as a markdown document with the images extracted. Find a tool that'll do this in one shot for free

## Assistant

_Time: 2026-02-24T03:07:01.078Z_

### Key Recommendations
- **Top Free Tool for One-Shot Conversion**: ConversionTools.io stands out as a reliable option for converting PDFs to Markdown while extracting images as separate files in a single process, with a free tier available after registration.
- **Alternative Options**: Tools like Monkt.com and Nanonets offer similar free online conversions, handling image referencing in Markdown, though image extraction as files may vary.
- **Open-Source Choice**: For those preferring software, MinerU (with web demos) provides high-quality extraction, including images as separate files, completely free.
- **Caveats**: Most tools handle basic PDFs well, but complex layouts or scanned documents may require OCR-enabled options; always test with your file for best results.

### How These Tools Work
Free online tools typically allow you to upload your PDF directly via a web interface. The conversion uses AI or OCR to parse text, preserve structure (like headings, tables, and lists), and handle images by either embedding references in the Markdown output or providing them as downloadable files. For instance, ConversionTools.io uses AI to generate GitHub-Flavored Markdown, with an option to include images extracted and saved separately alongside the .md file.<grok:render card_id="e892ca" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> Monkt.com automatically detects images, extracts them, and inserts Markdown syntax like `![alt text](image_path)` while maintaining quality.<grok:render card_id="84a370" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> These processes are quick, often completing in seconds to minutes, and prioritize privacy by deleting files shortly after conversion.

### Limitations and Considerations
While these tools are free, some have usage caps—ConversionTools.io limits non-registered users to 5 conversions per day and 10MB file size, but registration unlocks more credits.<grok:render card_id="b83aa5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> Tools like DeepPDF.ai support up to 50MB files without sign-up but may not explicitly extract images as separate files.<grok:render card_id="59927a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render> For open-source alternatives, installation might be needed, though MinerU offers no-login web demos for testing.<grok:render card_id="424c31" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render> If your PDF includes sensitive data, opt for client-side processing where available, and note that accuracy can dip with heavily image-based or non-standard PDFs.

### Steps to Get Started
1. Visit a tool like [ConversionTools.io](https://conversiontools.io/convert/ai-pdf-to-markdown) or [Monkt.com](https://monkt.com/pdf-to-markdown).
2. Upload your PDF (ensure it's under the size limit).
3. Select options like "include images" if available.
4. Download the resulting Markdown file and any extracted images.
5. Verify the output in a Markdown editor for any adjustments.

---
Converting PDFs containing both text and images into Markdown documents while extracting images represents a common need in digital content management, especially for workflows involving AI applications, documentation repurposing, or readable archiving. This process typically involves parsing the PDF's layout to maintain structural integrity—such as headings, paragraphs, bullet lists, tables, and code snippets—while handling visual elements like images through extraction and referencing. Free tools have proliferated in recent years, leveraging advancements in optical character recognition (OCR) and AI-driven layout analysis to achieve this in a single operation, often without requiring software installation. These solutions aim to produce "LLM-ready" content, meaning the output is optimized for large language models by preserving semantic structure and embedding elements like LaTeX for formulas or pipe syntax for tables.

Among online tools, ConversionTools.io exemplifies a user-friendly approach. It employs AI to scan the PDF, identifying and preserving formatting elements: headings are determined by font size and position, tables are converted to GitHub-Flavored Markdown (GFM) syntax, and text styles like bold or italics are retained. For images, users can enable an "Include images" option, which extracts them from the PDF and includes references in the Markdown output, such as standard `![alt](image_url)` syntax. Crucially, the images are provided as separate files in the download package, allowing for easy management without manual intervention.<grok:render card_id="97a89a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> This tool operates on a credit system, with non-registered users receiving 100 AI credits monthly (equating to about 10 pages per conversion), and limits files to 10MB. Registration, which is free, expands usage to 50 conversions monthly and removes daily caps, making it suitable for occasional users. Privacy is maintained through client-side processing where possible, and no permanent storage of uploads.

Similarly, Monkt.com offers an instant, free conversion service that transforms PDFs into clean Markdown while emphasizing preservation of hierarchy and formatting. Its algorithms map PDF elements to Markdown equivalents: paragraphs and lists remain intact, emphasis is applied via asterisks or underscores, and tables use pipe delimiters. Image handling is robust, with automatic detection, extraction, and insertion into the Markdown via syntax that includes alt text and optional titles for accessibility. The tool creates file references, suggesting that images are handled as linked assets, though specifics on whether they are bundled as separate files in a ZIP or similar aren't explicitly stated—user experiences indicate downloads often include both the .md file and accompanying images.<grok:render card_id="3e0643" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> Monkt supports OCR for scanned PDFs, ensuring text from images is extractable, and files are deleted after 30 days for security. There are no mentioned file size limits in basic use, but complex documents may require testing for optimal results.

Nanonets provides another free option through its online tool and API, focusing on layout-aware conversion for LLM pipelines. It uses OCR to handle scanned or image-heavy PDFs, accurately capturing tables as Markdown grids, code blocks with fencing, and overall semantic flow. While image extraction is implied through its content processing from visuals, the tool doesn't detail separate file outputs or Markdown referencing, potentially embedding descriptions instead.<grok:render card_id="5295bb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render> The free API allows programmatic access, ideal for batch processing, with compliance to standards like GDPR and HIPAA. Limitations include potential inaccuracies in very low-quality scans, but no hard file size caps are noted.

DeepPDF.ai stands out for its no-sign-up simplicity, converting PDFs to Markdown by uploading files up to 50MB and preserving structures like headings and tables. It supports PDFs with images, but lacks explicit details on extraction—images may be referenced in the output without separate files, focusing more on text fidelity.<grok:render card_id="288aa9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render> This makes it quick for basic needs, with conversions happening in-browser, but it doesn't support batch processing.

BankGPT.io rounds out online options with its AI converter, extracting text, tables, formulas (in LaTeX), and images while restructuring into Markdown. It analyzes layouts to ensure logical order, using pipe tables and backticks for code. Images are extracted, though not confirmed as separate files; referencing in Markdown is standard.<grok:render card_id="e4e9ed" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render> A free tier permits multiple daily conversions, with a 20MB limit, and integrates OCR for versatility.

For open-source enthusiasts, several tools offer free, customizable solutions, often with web demos for one-shot use without full installation. A comparative analysis highlights their capabilities:

| Tool       | Image Handling Capabilities                     | Extracts Images as Separate Files? | Free?                          | Online Version or Demo? | Requires Installation for Full Use? |
|------------|-------------------------------------------------|------------------------------------|--------------------------------|--------------------------|-------------------------------------|
| Marker     | Automatically exports images, preserves high-quality originals | Yes                                | Yes (GPL; commercial use may require authorization) | Hosted API (potentially paid) | Yes (pip install; supports GUI/server) |
| MinerU     | Exports images with captions                    | Yes                                | Yes (AGPL for models)          | Yes (Gradio-based demo, no login; official web app with login) | Yes (pip/Docker; auto model download) |
| MarkItDown | Outputs images as placeholders only             | No                                 | Yes (MIT)                      | No                       | Yes (pip/Docker) |
| Dolphin    | Detects and outputs images                      | Yes                                | Yes (MIT)                      | No                       | Yes (clone repo + dependencies) |<grok:render card_id="9828e8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>

MinerU, in particular, shines for its web accessibility. Its Gradio demo provides a simple interface for uploading PDFs and generating Markdown/JSON outputs, with images exported as files alongside captions.<grok:render card_id="df82d8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render> The tool supports comprehensive extraction, including formulas in LaTeX and tables in Markdown, and is optimized for agentic workflows. While the full client requires installation, the zero-install web version at sites like mineru.net allows quick tests.<grok:render card_id="63b50e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render> Marker, conversely, excels in accuracy for diverse file types (beyond PDFs, like DOCX or EPUB), converting to Markdown, JSON, or HTML, with image exports.<grok:render card_id="6f6413" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render> Its hosted version at datalab.to may involve costs for heavy use, but local setup is free.

In practice, selecting a tool depends on factors like file complexity, privacy needs, and desired output format. For instance, if your PDF is scanned, prioritize OCR-capable options like Nanonets or Monkt. Testing multiple tools is advisable, as performance varies—user reports from 2025-2026 indicate high satisfaction with MinerU for technical documents due to its model auto-download and multi-language support.<grok:render card_id="100f0f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render> Overall, these free solutions democratize PDF conversion, reducing barriers for non-technical users while providing robust features for professionals.

### Key Citations
- [PDF to Markdown Converter for LLM-Ready Content and RAG](https://tools.nanonets.com/pdf-to-markdown)
- [Best Open Source PDF to Markdown Tools (2026): Marker vs MinerU vs MarkItDown](https://jimmysong.io/blog/pdf-to-markdown-open-source-deep-dive)
- [AI PDF to Markdown Converter – Free Online, No Sign-Up](https://deeppdf.ai/pdf-to-markdown)
- [opendatalab/MinerU: Transforms complex documents like PDFs into LLM-ready markdown/JSON for your Agentic workflows.](https://github.com/opendatalab/MinerU)
- [datalab-to/marker: Convert PDF to markdown + JSON quickly with high accuracy](https://github.com/datalab-to/marker)
- [Free and powerful document parsing tool - MinerU](https://mineru.net/OpenSourceTools/Extractor)
