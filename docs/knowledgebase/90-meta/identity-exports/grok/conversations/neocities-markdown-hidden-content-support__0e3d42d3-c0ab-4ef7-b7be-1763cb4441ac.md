---
source_url: "https://grok.com/c/0e3d42d3-c0ab-4ef7-b7be-1763cb4441ac"
conversation_id: "0e3d42d3-c0ab-4ef7-b7be-1763cb4441ac"
title: "Neocities Markdown Hidden Content Support"
extracted_at: "2026-06-29T16:19:23.516Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Neocities Markdown Hidden Content Support

Source: [Grok conversation](https://grok.com/c/0e3d42d3-c0ab-4ef7-b7be-1763cb4441ac)

## User

_Time: 2025-10-11T01:50:44.650Z_

if I try to use this markdown on neocities.org, will the hidden parts of the markdown be hidden on neocities? Does it support this part of markdown?
```
___
### Luxa Hair Fix
**Name:** [Luxa Hair Fix](https://deadlystream.com/files/file/452-luxa-hair-fix/)
**Author:** redrob41
**Description:** There's just no way around it: Luxa's model is all kinds of fucked up. This mod accomplishes a herculean task in getting her to look not just normal, but excellent.
**Category & Tier:** Graphics Improvement / 2 - Recommended
**Non-English Functionality:** YES
**Installation Method:** TSLPatcher & Loose-File Mod
**Installation Instructions:** Run the TSLPatcher for the Head Fix, then use the screenshots included with the mod to determine whether you prefer option 1 or 2 for the body modification (I recommend 2). Once you know your preference, enter the Body Options folder and and run the patcher for the version which matches your preference. Finally, once again use the screenshots to determine whether you wish to utilize the alternate texture also located in the Body Options folder (recommended).
<!--<<ModSync>>
- **GUID:** 7d7e552c-7170-4e36-ba97-67dfc4433852
#### Instructions
1. **GUID:** b65c4d14-9165-4e16-a49e-71ffd2bc0175
   **Action:** Extract
   **Overwrite:** true
   **Source:** <<modDirectory>>\TSL_Luxa_Fix_by_RedRob41.zip
2. **GUID:** c8bd8a42-027b-4d4f-8ff3-f70e411a0c5f
   **Action:** Patcher
   **Overwrite:** true
   **Source:** <<modDirectory>>\TSL_Luxa_Fix_by_RedRob41\1 - Head Fix\TSLPatcher (InstallMod) for Head Fix.exe
   **Destination:** <<kotorDirectory>>
3. **GUID:** d766e4ad-dc8d-4d99-bb31-07f5f17768ce
   **Action:** Choose
   **Overwrite:** true
   **Source:** 12134ba7-b493-470f-a212-521c0512e095, a87c7309-9463-4eb8-8281-551b53cf6a12
4. **GUID:** e5765acb-bda1-4521-b4b2-65e316e150c0
   **Action:** Move
   **Overwrite:** true
   **Source:** <<modDirectory>>\TSL_Luxa_Fix_by_RedRob41\2 - Body Options\3 - Alternate Texture\N_Lala_XuA01.tga
   **Destination:** <<kotorDirectory>>\Override
#### Options
##### Option 1
- **GUID:** 12134ba7-b493-470f-a212-521c0512e095
- **Name:** Option 1 - Narrow Waist
- **Description:**
- **Is Selected:** false
- **Install State:** 0
- **Is Downloaded:** false
- **Restrictions:** a87c7309-9463-4eb8-8281-551b53cf6a12
  - **Instruction:**
    - **GUID:** 177f3adc-3373-41bd-90d0-d2a46cc7c109
    - **Action:** Patcher
    - **Destination:** <<kotorDirectory>>
    - **Overwrite:** true
    - **Source:** <<modDirectory>>\TSL_Luxa_Fix_by_RedRob41\2 - Body Options\1 - Narrow Waist\TSLPatcher (InstallMod).exe
##### Option 2
- **GUID:** a87c7309-9463-4eb8-8281-551b53cf6a12
- **Name:** Option 2 - Regular Waist
- **Description:**
- **Is Selected:** true
- **Install State:** 0
- **Is Downloaded:** false
- **Restrictions:** 12134ba7-b493-470f-a212-521c0512e095
  - **Instruction:**
    - **GUID:** 6c986100-12a4-432d-8192-e8f1d1ca4b31
    - **Action:** Patcher
    - **Destination:** <<kotorDirectory>>
    - **Overwrite:** true
    - **Source:** <<modDirectory>>\TSL_Luxa_Fix_by_RedRob41\2 - Body Options\2 - Regular Waist\TSLPatcher (InstallMod).exe
##### Option 3
- **GUID:** 09ea8a15-aa17-4f86-929f-ae7a205593a6
- **Name:** Alternative Texture
- **Description:**
- **Is Selected:** false
- **Install State:** 0
- **Is Downloaded:** false
  - **Instruction:**
    - **GUID:** 3636bad0-783e-49cf-a51d-8c8d55f6bf01
    - **Action:** Move
    - **Destination:** <<kotorDirectory>>\Override
    - **Overwrite:** true
    - **Source:** <<modDirectory>>\TSL_Luxa_Fix_by_RedRob41\2 - Body Options\3 - Alternate Texture\N_Lala_XuA01.tga
-->```
I know it supports markdown just not if it supports the metadata/comment stuff or not.

## Assistant

_Time: 2025-10-11T01:52:18.484Z_

### Key Points
- Neocities does not automatically render Markdown files to HTML; it's a static hosting platform, so uploading a .md file typically results in it being served as plain text, where all content—including HTML-style comments like `<!-- ... -->`—is visible in raw form.
- If you convert your Markdown to HTML using an external tool (e.g., Pandoc or Eleventy) before uploading, the hidden parts within HTML comments will not be visible in the rendered page, as browsers treat them as non-displayed comments.
- Neocities fully supports HTML, so any properly generated HTML file with hidden comments will work as expected, but there's no built-in support for processing "metadata/comment stuff" in raw Markdown.

### How Markdown Works on Neocities
Neocities allows you to upload Markdown files (.md or .markdown extensions), but it treats them as static files without any server-side processing. When visitors access a .md file directly via a URL (e.g., yoursite.neocities.org/example.md), most browsers will either display it as raw text or prompt a download. In raw text view, everything in the file is shown, including the content inside `<!--<<ModSync>> ... -->`, because it's not being parsed as HTML—it's just text. This means the "hidden" parts aren't actually hidden; they're part of the visible source.

To achieve hiding, you need to render the Markdown to HTML beforehand. Standard Markdown processors (like those based on CommonMark or GitHub Flavored Markdown) recognize embedded HTML, including comments, and preserve them in the output HTML. In the final HTML, the browser will ignore the commented section, making it invisible to users while still present in the source code for tools or scripts.

### Steps to Hide Content on Neocities
1. **Convert Markdown to HTML**: Use a free tool like Pandoc (command-line), Marked (app), or an online converter. For example, with Pandoc: Install it, then run `pandoc input.md -o output.html`. This will turn your Markdown into HTML, keeping the `<!-- ... -->` as a non-rendered comment.
2. **Upload the HTML File**: Log into your Neocities dashboard, upload the generated .html file (e.g., as index.html for your main page). Neocities serves HTML directly, so the page will render properly in browsers.
3. **Optional Client-Side Rendering**: If you prefer to keep the file as .md, you could add JavaScript to your site (e.g., using libraries like marked.js) to fetch and render the Markdown on the client side. This way, the HTML comment would be processed and hidden during rendering. Neocities supports JS files, so this is feasible but requires coding.

### Potential Limitations and Alternatives
- **Browser Behavior**: Even in HTML, comments are "hidden" from view but can be seen in the page source (via right-click > View Page Source). If you need stronger hiding (e.g., for sensitive metadata), consider storing it separately or using a different format.
- **No Built-in Markdown Features**: Unlike platforms like GitHub or Reddit, Neocities doesn't interpret Markdown natively. For more advanced sites, users often integrate static site generators like Eleventy or Jekyll locally, build the HTML, and upload the output.
- **Testing Tip**: Create a free Neocities account, upload a test .md file with your comment syntax, and view it in a browser. If it's shown raw, switch to pre-rendering to HTML for the desired effect.

If your goal is to use this for modding or metadata (based on the ModSync-like structure), tools like TSLPatcher might not interact directly with Neocities, but the hosting side should work fine once rendered.

---

Neocities.org is a free static website hosting platform that emphasizes personal, creative web pages reminiscent of early internet sites like GeoCities. It provides 1 GB of storage for free accounts (with paid upgrades available) and supports a wide range of file types, including HTML, CSS, JavaScript, images, and notably Markdown (.md and .markdown). However, as a static host, it does not offer server-side processing or dynamic rendering capabilities. This means that while you can upload Markdown files, Neocities does not automatically convert them to HTML for display in browsers. Instead, .md files are served with a MIME type of text/plain, leading browsers to either display them as unformatted text or initiate a download, depending on the browser settings.

In the context of your provided Markdown snippet, which includes a section wrapped in an HTML comment (`<!--<<ModSync>> ... -->`), this syntax is a standard way to embed non-rendered content in Markdown. HTML comments are part of the HTML specification and are ignored by browsers when parsing HTML, meaning they do not appear in the rendered page but remain in the source code. Markdown specifications, such as CommonMark or GitHub Flavored Markdown (GFM), allow raw HTML to be embedded within Markdown documents. During conversion to HTML, these HTML elements—including comments—are typically preserved as-is. Therefore, the content inside the comment (e.g., GUIDs, instructions, and options related to what appears to be a mod installation script for a game like Knights of the Old Republic) would not be visible to users viewing the rendered HTML page.

However, since Neocities lacks built-in Markdown rendering, uploading the raw .md file will result in the entire content being visible as plain text. This includes the commented section, which loses its "hidden" property because no HTML parsing occurs. Users accessing the file would see the full Markdown source, potentially exposing metadata or instructions you intended to hide. This behavior aligns with how browsers handle plain text files; there's no interpretation of Markdown syntax like headings, bolding, or HTML comments.

To ensure the hidden parts remain hidden on Neocities, you must preprocess the Markdown file into HTML using an external tool or script. Several community-recommended approaches exist for this:

- **Command-Line Tools like Pandoc**: Pandoc is a popular, open-source document converter that supports Markdown input and HTML output. You can install it via package managers (e.g., `brew install pandoc` on macOS or `apt install pandoc` on Linux). Run a command like `pandoc yourfile.md -o yourfile.html` to generate the HTML. The resulting file will include the HTML comment intact but non-visible. Upload this .html file to Neocities, where it will render correctly.

- **Static Site Generators**: Tools such as Eleventy (11ty) are favored by Neocities users for building sites from Markdown. Eleventy processes Markdown files locally, applying templates and conversions, and outputs static HTML files ready for upload. A guide specifically for Neocities users highlights setting up Eleventy to handle Markdown-to-HTML conversion, allowing you to maintain your content in Markdown while deploying rendered pages. Similarly, users have shared scripts for automating this, such as shell scripts that run Markdown through a parser and apply patches to the HTML output.

- **Editor Integrations**: Applications like Sublime Text with Markdown plugins can preview and export rendered HTML. For instance, configuring Sublime's MarkdownBuild settings to output HTML enables quick conversion. Online tools like Dillinger or StackEdit also allow editing Markdown and exporting to HTML, though for privacy, local tools are preferable if your content includes sensitive metadata.

- **Client-Side JavaScript Rendering**: For a more dynamic approach without pre-conversion, you can upload the .md file and use JavaScript libraries like marked.js or showdown.js in an HTML page to fetch and render the Markdown content on the client's browser. In this setup, the HTML comment would be parsed during rendering, hiding the enclosed content. Neocities supports JavaScript files, making this viable, but it adds complexity and may not work for users with JS disabled.

Regarding Markdown comment support specifically, standard Markdown does not have a native comment syntax, but embedding HTML comments is a widely accepted workaround, as discussed in developer communities. These comments are ignored by HTML converters, ensuring they're not part of the visible output. However, if the file isn't converted, this doesn't apply. In your example, the comment encapsulates what looks like structured data (GUIDs, actions like "Extract" or "Patcher," and options for mod installation), which might be intended for a tool or script rather than display. If this is for a game modding context, ensure the rendering doesn't interfere with any parsing logic.

Neocities' file type allowances explicitly include Markdown, but without rendering, it's more suited for storage or download rather than direct viewing. Community discussions emphasize that for interactive or hidden elements, HTML is the way to go. For instance, alternatives like using `<details>` and `<summary>` HTML tags can create collapsible sections for semi-hidden content without comments, but that's not directly applicable to your Markdown-based hiding.

In terms of broader compatibility:
- **Browser Support**: All major browsers (Chrome, Firefox, Safari) honor HTML comments in rendered HTML pages.
- **File Size and Limits**: Neocities has no issues with small Markdown or HTML files like yours.
- **Edge Cases**: If your Markdown includes advanced features (e.g., tables, code blocks), ensure your converter supports them. Also, very large files might need splitting, but that's unrelated here.

| Aspect | Neocities Support for Raw Markdown | Neocities Support for Rendered HTML |
|--------|------------------------------------|-------------------------------------|
| File Upload | Yes (.md allowed) | Yes (.html allowed) |
| Automatic Rendering | No (served as text) | Yes (direct HTML serving) |
| HTML Comments Hiding | No (visible in text) | Yes (hidden in browser render) |
| Recommended Workflow | Upload for storage/download | Convert Markdown → Upload HTML |
| Tools for Conversion | N/A (no built-in) | Pandoc, Eleventy, JS libraries |
| Visibility of Hidden Parts | Fully visible | Invisible to users |

This table summarizes the key differences in handling your Markdown on Neocities. Overall, while Neocities excels at hosting static content and fostering creative sites, it requires manual handling for features like Markdown rendering to achieve effects such as hidden metadata.

**Key Citations:**
- [Allowed File Types - Neocities](https://neocities.org/site_files/allowed_types)
- [How do I embed .md files? : r/neocities - Reddit](https://www.reddit.com/r/neocities/comments/1e1deiv/how_do_i_embed_md_files/)
- [nycki93/eleventy-for-neocities-users: Add Markdown to ... - GitHub](https://github.com/nycki93/eleventy-for-neocities-users)
- [Building the neocities page in Markdown - filtercake.neocities.org](https://filtercake.neocities.org/)
- [Comments in Markdown - syntax - Stack Overflow](https://stackoverflow.com/questions/4823468/comments-in-markdown)
- [How This Site is Built - ShadowM00n's Summit - Neocities](https://shadowm00n.neocities.org/tech/how_this_site_is_built)
