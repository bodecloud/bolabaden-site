---
source_url: "https://grok.com/c/682f04f5-166b-4cea-863c-c7c26449f526"
conversation_id: "682f04f5-166b-4cea-863c-c7c26449f526"
title: "FlareSolverr Spinoffs in 2025"
extracted_at: "2026-06-29T16:26:25.466Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# FlareSolverr Spinoffs in 2025

Source: [Grok conversation](https://grok.com/c/682f04f5-166b-4cea-863c-c7c26449f526)

## User

_Time: 2025-07-02T21:38:16.813Z_

any flaresolverr spinoffs still working in 2025? i couldn't get byparr to work either.

## Assistant

_Time: 2025-07-02T21:39:15.209Z_

### Key Points
- Research suggests that "alexfozor/flaresolverr:pr-1300-experimental" is a working spinoff of FlareSolverr in 2025, based on user reports.
- It seems likely that this fork addresses issues with the original FlareSolverr, which some users find non-functional.
- The evidence leans toward Byparr being another alternative, but you mentioned it did not work for you, so this fork may be a viable option.

### Background
FlareSolverr is a proxy server designed to bypass Cloudflare's anti-bot protection, commonly used in web scraping or accessing protected websites. Given reports of its instability, users often seek alternatives or spinoffs that remain functional, especially in 2025.

### Recommended Solution
Based on recent discussions, consider trying the fork "alexfozor/flaresolverr:pr-1300-experimental." This can be used as a drop-in replacement in setups like Jackett or Prowlarr, potentially resolving your issues.

- **GitHub Repository**: [alexfozor/FlareSolverr](https://github.com/AlexFozor/FlareSolverr)
- **Reddit Discussion**: [Flaresolverr broken?](https://www.reddit.com/r/sonarr/comments/1izl9e6/flaresolverr_broken/)

---

### Survey Note: Detailed Analysis of FlareSolverr Spinoffs in 2025

This section provides a comprehensive examination of the query regarding FlareSolverr spinoffs still functional in 2025, particularly in light of the user's experience with Byparr. The analysis is grounded in a systematic review of available online resources, focusing on technical forums, GitHub repositories, and community discussions as of July 2, 2025.

#### Context and Initial Findings
FlareSolverr is a proxy server utilized to bypass Cloudflare and DDoS-GUARD protections, primarily employed in web scraping to handle Cloudflare challenges. It operates by launching a web browser (typically Chrome) via Selenium and undetected-chromedriver, solving challenges, and returning cookies to bypass protections. However, recent reports indicate that FlareSolverr has faced challenges in maintaining functionality due to evolving Cloudflare security measures, prompting the development of alternatives and spinoffs.

The user's mention of Byparr not working suggests a need for alternative solutions. Byparr, identified as a drop-in replacement for FlareSolverr built with FastAPI and nodriver, is noted in GitHub repositories and forums as an option. However, its failure for the user indicates potential compatibility or performance issues, necessitating further exploration of other spinoffs.

#### Investigation of Alternatives
To address the query, a search was conducted for FlareSolverr alternatives and spinoffs active in 2025. Key findings include:

- **Byparr**: Described in GitHub (e.g., [ThePhaseless/Byparr](https://github.com/ThePhaseless/Byparr)) as a FlareSolverr replacement, with recent activity noted in April 2025. However, the user's inability to get it to work aligns with community feedback suggesting instability or specific setup requirements, such as support for NAS devices being minimal.

- **Simple-Cloudflare-Solver**: Mentioned in a Reddit post from January 2025 ([r/unRAID discussion](https://forums.unraid.net/topic/185532-how-to-setup-simple-cloudflare-solversimple-cloudflare-solver/)), this tool was proposed as an alternative. However, limited recent information on its functionality in 2025 was found, reducing confidence in its current viability.

- **Forks and Community Contributions**: A significant finding was a Reddit post from February 2025 in r/sonarr, where a user reported success with a fork of FlareSolverr, specifically "alexfozor/flaresolverr:pr-1300-experimental." This fork was suggested as a solution to issues with the main branch, described as "dead," and was recommended for use in Docker setups, particularly for tools like Jackett.

#### Verification of the Fork
Further investigation into "alexfozor/flaresolverr" via GitHub revealed that AlexFozor has a repository with this fork, showing activity and a copyright notice for 2025, indicating ongoing maintenance. The fork's description aligns with FlareSolverr's purpose, and community feedback, such as the Reddit post, supports its functionality in 2025. The specific build "pr-1300-experimental" was highlighted for addressing issues, suggesting it as a direct spinoff addressing the original tool's limitations.

#### Comparative Analysis
To organize the findings, the following table summarizes the identified alternatives and their status as of July 2025:

| Tool/Fork                  | Description                                      | Status in 2025                     | User-Reported Functionality |
|---------------------------|--------------------------------------------------|------------------------------------|-----------------------------|
| Byparr                    | Drop-in replacement, FastAPI, nodriver          | Active, recent updates in April    | Did not work for user       |
| Simple-Cloudflare-Solver  | Alternative mentioned in forums                 | Limited recent information         | Uncertain, not widely confirmed |
| alexfozor/flaresolverr:pr-1300-experimental | Fork addressing FlareSolverr issues | Active, 2025 copyright, community reports | Reported working by users   |

This table illustrates that while Byparr and simple-cloudflare-solver exist, the fork "alexfozor/flaresolverr:pr-1300-experimental" stands out due to recent community validation and alignment with the user's needs, given Byparr's failure.

#### Conclusion and Recommendation
Given the user's specific challenge with Byparr and the need for a functional FlareSolverr spinoff in 2025, the evidence leans toward recommending "alexfozor/flaresolverr:pr-1300-experimental." This fork is supported by community reports of success, particularly in Docker environments, and its recent activity suggests ongoing relevance. Users are advised to consult the GitHub repository for setup instructions and community forums for troubleshooting, ensuring compatibility with their specific use case, such as integration with Jackett or Prowlarr.

This analysis provides a thorough basis for the recommendation, acknowledging the complexity of maintaining functionality against evolving security measures and the importance of community-driven solutions in open-source ecosystems.
