---
source_url: "https://www.perplexity.ai/search/e0d7b552-8cc6-4d0d-9a9c-e57dbc09dec2"
thread_uuid: "5c9ea29a-5503-42ec-a995-c6724f9a570b"
slug: "e0d7b552-8cc6-4d0d-9a9c-e57dbc09dec2"
title: "determine where on this repository I can find the file format and the structure, i.e. how to not only load the data from the file but save it.

https://github.com/klembot/twinejs"
extracted_at: "2026-06-29T16:18:17.231Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# determine where on this repository I can find the file format and the structure, i.e. how to not only load the data from the file but save it.

https://github.com/klembot/twinejs

Source: [Perplexity thread](https://www.perplexity.ai/search/e0d7b552-8cc6-4d0d-9a9c-e57dbc09dec2)

## User

determine where on this repository I can find the file format and the structure, i.e. how to not only load the data from the file but save it.

https://github.com/klembot/twinejs

## Assistant

## File Format and Structure in TwineJS Repository

To determine the file format and structure used in the TwineJS repository, as well as understand how to load and save data, you should focus on the `story-formats/` directory within the repository.

**Location of File Formats**

- **`story-formats/` Directory**: This directory contains the story format definitions. Each story format is maintained in a separate repository to ensure modularity and ease of maintenance. You can find the minified versions of these story formats here.[1]

**Loading and Saving Data**

- **Loading Data**: The repository handles loading story data through the scripts and configurations defined within the `story-formats/` directory. To load data, ensure that you reference the appropriate story format repository corresponding to your desired format.

- **Saving Data**: Saving functionality is integrated into the TwineJS application. When you build or run the application using commands like `npm start` or `npm run build`, the application processes and saves your story data based on the definitions provided in the `story-formats/` directory.[1]

**Additional Resources**

- **Documentation**: For detailed instructions on working with story formats and integrating them into your projects, refer to the documentation provided in the repository. This may require installing additional tools like `mdbook` for generating and accessing the documentation locally.[1]

By exploring the `story-formats/` directory and the associated repositories, you can gain a comprehensive understanding of the file formats and structures used in TwineJS, enabling you to effectively load and save your story data.

### Sources

- [twinejs](https://github.com/klembot/twinejs)
