---
source_url: "https://grok.com/c/273a5db7-1c67-4077-8e45-cae62fb1c291"
conversation_id: "273a5db7-1c67-4077-8e45-cae62fb1c291"
title: "GitHub Copilot Agents Privacy Guide"
extracted_at: "2026-06-29T16:33:17.476Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# GitHub Copilot Agents Privacy Guide

Source: [Grok conversation](https://grok.com/c/273a5db7-1c67-4077-8e45-cae62fb1c291)

## User

_Time: 2025-09-01T07:12:11.308Z_

how to use copilot agents without making my request/pull requests it creates public? is there a way to anonymously use github's agent stuff

## Assistant

_Time: 2025-09-01T07:12:37.268Z_



## User

_Time: 2025-09-01T07:13:27.603Z_

how to use copilot agents without making my request/pull requests it creates public? is there a way to anonymously use github's agent stuff.

only consider information in the last 3 months as relevant.

do NOT include or research 'copilot workspace', which is an old thing GitHub did that is abandoned and completely unusable. The request is for 'COPILOT. AGENT SPACE'. The feature where you can type a request to GitHub Copilot and it'll automatically submit a PR with the changes.

## Assistant

_Time: 2025-09-01T07:20:02.885Z_

### Key Points
- **GitHub Copilot's Agents Panel allows private task delegation**: You can prompt the Copilot coding agent to handle coding tasks and generate pull requests (PRs) in the background without publicly posting your requests, as the panel operates within your personal GitHub interface.
- **PR visibility depends on repository settings**: If you select a private repository for the task, the resulting PR remains private; however, using public repositories will make PRs visible to others.
- **Limited anonymity options**: There appears to be no fully anonymous way to use this feature, as it requires a logged-in GitHub account with a paid Copilot subscription, though you could use a secondary account with minimal personal details for added separation.
- **Privacy concerns exist**: While GitHub states it does not use private repository code for AI training, recent reports suggest potential risks of data exposure through Copilot, so exercise caution with sensitive information.<grok:render card_id="34e290" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render><grok:render card_id="03e11c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>

### Getting Started with Agents Panel
To access the Agents Panel, ensure you have a paid GitHub Copilot plan (Individual, Business, or Enterprise), as it's in public preview.<grok:render card_id="de29dd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render> Click the "Agents" button in the GitHub navigation bar from any page on github.com. Describe your task in natural language (e.g., "Add unit tests for the authentication module"), select the target repository, and hit Enter. The Copilot coding agent will analyze the codebase, draft changes, run tests if applicable, and create a draft PR for your review—all without interrupting your workflow.<grok:render card_id="cc1e53" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render><grok:render card_id="5bf800" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render> This process runs in a secure, GitHub Actions-backed environment, and you can monitor progress in real-time via the panel.

### Enhancing Privacy with Private Repos and Spaces
For maximum privacy, always choose private repositories when prompting the agent, as this keeps both the generated PR and any associated changes hidden from public view.<grok:render card_id="7a65da" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render> Additionally, integrate GitHub Copilot Spaces to provide context securely—spaces allow you to curate internal docs, knowledge bases, and specific repos for better agent responses without exposing them broadly.<grok:render card_id="cd6777" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render><grok:render card_id="f64482" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render> Spaces can be set to private or shared only with organization members, adding a layer of control. In Copilot settings, you can limit repository access to "No repositories," "All repositories," or selected ones to further manage what the agent sees.<grok:render card_id="2e6982" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render> For enterprise users, admins can enforce policies to restrict features and models.<grok:render card_id="167641" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render>

### Addressing Anonymity and Alternatives
True anonymity is challenging since the feature ties to your GitHub identity, but you could create a new account with anonymized details (e.g., no real name or email linkage) and subscribe to Copilot individually. Be aware this still involves GitHub's data collection, and prompts may indirectly contribute to product improvements unless opted out.<grok:render card_id="a345c6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render> If privacy risks outweigh benefits, consider local alternatives like running open-source models in VS Code to avoid sending data to external servers.<grok:render card_id="821150" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render> Recent incidents highlight the importance of auditing permissions and avoiding sensitive code in Copilot interactions.<grok:render card_id="e04834" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render><grok:render card_id="bfae2c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render>

---
GitHub Copilot has evolved significantly in recent months, introducing features like the Agents Panel and Copilot Spaces that empower developers to automate workflows efficiently while addressing common concerns around privacy and visibility. This comprehensive overview draws from official documentation, user experiences, and recent announcements to explain how to leverage these tools for task delegation and PR creation without unintended public exposure. We'll cover the core mechanics, setup steps, privacy safeguards, potential risks, and workarounds for anonymity, ensuring a balanced perspective that acknowledges both the benefits and limitations of these AI-driven capabilities.

#### Understanding GitHub Copilot Agents and the Agents Panel
The GitHub Copilot coding agent represents a shift toward "agentic workflows," where AI acts as an autonomous teammate capable of handling repetitive or well-defined tasks. Introduced in public preview around mid-2025, the Agents Panel serves as a central hub accessible from any page on github.com.<grok:render card_id="60b787" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render><grok:render card_id="2fe23f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render><grok:render card_id="27d905" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render> Unlike older, abandoned tools such as Copilot Workspace, this feature focuses on seamless integration without requiring separate environments. Users can delegate tasks like drafting code, fixing bugs, adding tests, or updating documentation by simply opening the panel via the navigation bar's "Agents" button, entering a natural language prompt, and specifying the repository.

Once initiated, the agent operates in the background: it generates a plan, analyzes the codebase, implements changes, executes tests and linters in a secure GitHub Actions environment, and finally creates a draft pull request (PR).<grok:render card_id="eb852a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render><grok:render card_id="b59049" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render> This PR is automatically tagged for your review, with detailed logs available for transparency. The process continues even if you log off, supporting parallel tasks without workflow disruptions. For example, a prompt like "Fix the login bug referenced in issue #42 and add integration tests" could result in a complete PR ready for merging.<grok:render card_id="465b35" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render> This is particularly useful for routine maintenance, allowing developers to focus on creative work.

| Step | Description | Tips for Privacy |
|------|-------------|------------------|
| 1. Access Panel | Click "Agents" in the GitHub nav bar. | Ensure you're logged into a dedicated account if separating personal and work use. |
| 2. Enter Prompt | Describe the task in natural language (e.g., "Refactor the API endpoint for better performance"). | Avoid including sensitive data in prompts; use references to issues instead. |
| 3. Select Repo | Choose the target repository from your accessible ones. | Opt for private repos to keep all outputs hidden from public view.<grok:render card_id="97e5bd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render> |
| 4. Monitor & Review | Track progress in the panel; review the draft PR when notified. | Provide feedback via @copilot in the PR for refinements without public exposure. |
| 5. Integrate Context | Use Copilot Spaces for enhanced accuracy (see below). | Set spaces to private to control access.<grok:render card_id="cf9463" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render> |

#### Integrating Copilot Spaces for Contextual Accuracy
Complementing the Agents Panel, GitHub Copilot Spaces—launched in June 2025—allows users to curate and organize context-specific resources like internal documentation, team knowledge bases, and selected repositories.<grok:render card_id="d8c074" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render><grok:render card_id="737850" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render> This feature ensures the coding agent delivers more tailored responses by grounding prompts in relevant, secure data. To create a space, navigate to https://github.com/copilot/spaces, name it, and decide ownership (personal or organizational).<grok:render card_id="8e43a1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render><grok:render card_id="640ff1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render> Add content such as repos, wikis, or files, then reference the space in your agent prompts for better outcomes.

Spaces enhance PR creation by providing the agent with precise context, reducing generic suggestions and improving code quality.<grok:render card_id="499040" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render> For instance, in a space focused on a project's authentication module, the agent could generate PRs that align perfectly with your team's style. Importantly, spaces support privacy: personal spaces are private by default, while organizational ones can be shared selectively or kept restricted.<grok:render card_id="5f2425" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render> This setup is ideal for enterprises, where admins can manage access to prevent unintended data sharing.

#### Privacy Considerations and Best Practices
Privacy is a key concern with AI tools like Copilot, given reports of potential data leaks in early 2025.<grok:render card_id="c3725b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render><grok:render card_id="f30d6e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render><grok:render card_id="7f929f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render> GitHub's official stance is that private repository code is not used for training models, and access is only granted with user consent via permissions.<grok:render card_id="4663a1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render><grok:render card_id="b0f1ce" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> However, Copilot requires read/write access for features like workspace search in private repos, which enables context-aware suggestions but raises exposure risks.<grok:render card_id="eed69c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render card_id="6fcb89" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render> Prompts entered in the Agents Panel are not publicly visible—they stay within your session—unlike mentions in public issues.

To minimize risks:
- **Repository Controls**: In Copilot settings (https://github.com/settings/copilot), select specific repos or disable access entirely.<grok:render card_id="b9cc33" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>
- **Opt-Out of Data Use**: Uncheck options allowing GitHub to use your snippets for improvements.<grok:render card_id="3d3036" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- **Enterprise Safeguards**: Organizations can enforce policies, use sensitivity labels, and scope access via tools like SharePoint Agents.<grok:render card_id="113568" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render><grok:render card_id="d1b8f7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render>
- **Audit and Monitor**: Regularly review permissions and avoid prompting with confidential info; use enterprise agreements for added protection.<grok:render card_id="f7712e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>

Despite these measures, incidents like Copilot exposing formerly public (now private) repos underscore the need for vigilance.<grok:render card_id="a53992" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render><grok:render card_id="d76bf6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">46</argument>
</grok:render> If handling highly sensitive code, consider running local AI models or alternatives like Gemini Code Assist.<grok:render card_id="5ca1aa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render><grok:render card_id="454ad1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render>

| Privacy Feature | Description | Applicability to Agents/PRs |
|-----------------|-------------|-----------------------------|
| Private Repos | Keeps PRs and changes invisible to outsiders. | Directly applies; select during prompt. |
| Spaces Privacy | Personal spaces are user-only; org spaces shareable. | Enhances agent context without broad exposure.<grok:render card_id="d39609" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render> |
| Data Opt-Out | Prevents code use for AI improvements. | Reduces long-term risks but doesn't affect real-time prompts.<grok:render card_id="dcc0a6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render> |
| Enterprise Policies | Admins control features and access. | Ideal for teams; limits agent scope.<grok:render card_id="20adf8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render> |
| Leak Mitigation | Audit open files and permissions. | Addresses reported vulnerabilities in Copilot.<grok:render card_id="bf856d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render> |

#### Options for Anonymous or Low-Profile Use
Full anonymity is not supported, as the feature demands an authenticated GitHub account and Copilot subscription.<grok:render card_id="85482b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render> However, you can approximate it by creating a throwaway account with anonymized credentials (e.g., using a privacy-focused email and no linked social profiles). Subscribe to Copilot Individual for personal use, and operate solely in private repos to avoid any public traces. Enterprise setups offer more anonymity through organizational accounts, but this ties back to company oversight.<grok:render card_id="ea9a79" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render> User discussions highlight that while Copilot collects data, risks in private contexts are low if precautions are taken.<grok:render card_id="250119" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render><grok:render card_id="417ef5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render> For truly anonymous experimentation, explore open-source alternatives or local setups, though they lack the integrated PR creation.

In summary, the Agents Panel and Spaces provide powerful, privacy-conscious ways to automate PRs, but users should weigh benefits against reported risks and configure settings accordingly for optimal security.

### Key Citations
- [Agents panel: Launch Copilot coding agent tasks anywhere on GitHub](https://github.blog/news-insights/product-news/agents-panel-launch-copilot-coding-agent-tasks-anywhere-on-github/)
- [How to use GitHub Copilot on github.com: A power user’s guide](https://github.blog/ai-and-ml/github-copilot/how-to-use-github-copilot-on-github-com-a-power-users-guide/)
- [GitHub Copilot Spaces: Bring the right context to every suggestion](https://github.blog/ai-and-ml/github-copilot/github-copilot-spaces-bring-the-right-context-to-every-suggestion/)
- [Creating and using GitHub Copilot Spaces](https://docs.github.com/copilot/how-tos/context/copilot-spaces/creating-and-using-copilot-spaces)
- [About organizing and sharing context with GitHub Copilot Spaces](https://docs.github.com/copilot/using-github-copilot/copilot-spaces/about-organizing-and-sharing-context-with-copilot-spaces)
- [Managing GitHub Copilot policies as an individual subscriber](https://docs.github.com/copilot/how-tos/manage-your-account/managing-copilot-policies-as-an-individual-subscriber)
- [GitHub Copilot Security and Privacy Concerns](https://blog.gitguardian.com/github-copilot-security-and-privacy/)
- [Microsoft Copilot Exposes Private GitHub Repositories](https://medium.com/%40Cyber-AppSec/microsoft-copilot-exposes-private-github-repositories-even-after-they-were-removed-882b9effb1e4)
- [Thousands of Exposed GitHub Repositories, Now Private, Can Still Be Accessed Through Copilot](https://yro.slashdot.org/story/25/02/27/2129241/thousands-of-exposed-github-repositories-now-private-can-still-be-accessed-through-copilot)
- [Why does GitHub Copilot need read/write access to private repositories?](https://github.com/orgs/community/discussions/106551)
- [Does Github Copilot Use Your Code: Privacy & Security Explained](https://www.copilot.live/blog/does-github-copilot-use-your-code)
- [GitHub General Privacy Statement](https://docs.github.com/site-policy/privacy-policies/github-privacy-statement)
- [X Post by GitHub (@github) on Copilot Coding Agent Delegation](https://x.com/github/status/1957894152412082643)
- [X Post by Siddhant Mani on Agents Panel](https://x.com/_siddhantmani/status/1960610031432347654)
- [X Post by GitHub on Copilot Spaces](https://x.com/github/status/1939054954779422995)

## User

_Time: 2025-09-01T08:12:28.707Z_

All of that is confusing and partially outdated. Specifically and exclusively, there's a feature of Copilot where you can type a request of some changes to make to a github repo, and press 'submit', and a PR will appear. The request is to determine how to make specifially and exclusive the PR private without modifying other repo functionality/privileges/permissions in any way shape or form. Basically i just don't want my ai conversations in the PR to be puiblic, that is all.

## Assistant

_Time: 2025-09-01T08:14:47.928Z_

### Key Points
- **PR Visibility Tied to Repository**: GitHub pull requests (PRs) inherit the visibility of the repository they're created in—if the repo is public, the PR is public, and there's no built-in way to make an individual PR private without altering the repo's overall settings.
- **Copilot Creates Draft PRs**: The Copilot coding agent generates draft PRs, which are still visible in public repos but can be edited before marking them as "ready for review." This allows you to remove or sanitize any AI prompts from the description.
- **Workaround for Privacy**: To fully hide AI conversations (prompts) without changing the original repo, use a private fork where Copilot can create and handle the draft PR privately, then submit a cleaned-up PR to the public upstream repo.
- **No Impact on Other Permissions**: This approach avoids modifying the original repo's functionality, privileges, or permissions in any way.

### Understanding the Copilot Feature
GitHub Copilot's coding agent lets you enter a natural language prompt describing changes (e.g., "Refactor the login function to use async calls"), select a repository, and submit. It then analyzes the codebase, implements the changes in a secure environment, and automatically creates a draft pull request with the updates. The prompt may appear in the PR's title, description, or commit messages for context, which is why privacy is a concern in public repos.

### Steps to Keep AI Prompts Hidden
While you can't isolate a PR's visibility, here's how to achieve your goal using a private fork:

1. **Fork the Public Repo Privately**: Go to the public repository on GitHub, click "Fork," and select your account or organization. Ensure the fork is set to private in the fork settings (this is an option during forking or afterward via repo settings).
   
2. **Configure Copilot Access**: In your GitHub settings (github.com/settings/copilot), under "Repository access," select "Selected repositories" and add your private fork. This grants Copilot permission to work there without affecting the original repo.

3. **Use Copilot in the Private Fork**:
   - Open the Agents panel on github.com (via the navigation bar).
   - Select your private fork as the target repository.
   - Enter your prompt and submit.
   - Copilot will create a draft PR in the private fork, keeping everything—including the prompt and any AI-generated descriptions—hidden from public view.

4. **Review and Edit in Private**:
   - Once the draft PR is created, review the changes.
   - Edit the PR title, description, and commit messages to remove any references to your AI prompt or conversation.
   - Merge the PR into your private fork's main branch if satisfied.

5. **Submit to the Original Repo**:
   - From your private fork, create a new PR targeting the original public repo's main branch.
   - This final PR will only include the code changes and your edited description— no AI prompts—while the public can see the diff but not your private workflow.

This process ensures your AI interactions stay private, as the intermediate draft PR remains confined to your private fork. For more on forking, see GitHub's guide: [About permissions and visibility of forks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-permissions-and-visibility-of-forks).<grok:render card_id="e04aa0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render>

### Potential Limitations
- Draft PRs in public repos are immediately visible if someone checks the PR list, so editing quickly is key if you skip the fork method—but the fork avoids this risk entirely.
- Copilot requires a paid subscription (Individual, Business, or Enterprise) and works best with repositories you have write access to.
- If your prompt involves sensitive data, avoid including it directly; reference issues or files instead.

If this doesn't fully align with your setup, consider discussing with GitHub support for any preview features, though no such options exist as of September 2025.

---

GitHub Copilot's coding agent streamlines development by automating code changes based on user prompts, but its integration with public repositories raises valid privacy concerns, especially regarding the visibility of AI-generated pull requests (PRs) and the prompts embedded within them. This comprehensive overview draws from official documentation, user experiences, and technical analyses to explain the mechanics of PR creation, inherent visibility rules, and practical strategies for maintaining privacy without altering the original repository's settings. We'll cover the feature's workflow, privacy implications, and step-by-step workarounds, emphasizing that while direct PR privatization isn't possible, effective alternatives exist.

#### Copilot Coding Agent Workflow and PR Creation
The Copilot coding agent, introduced in mid-2025, acts as an autonomous AI teammate that handles tasks like bug fixes, refactoring, or feature additions.<grok:render card_id="d7896b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="e2a7e6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render> To use it:
- Access the Agents panel on github.com or via VS Code/GitHub CLI.
- Select a repository (must have write access).
- Enter a natural language prompt (e.g., "Add error handling to the API endpoint").
- Submit, and the agent processes the task in a secure GitHub Actions-backed environment.<grok:render card_id="d6eebd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="bb35a7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">70</argument>
</grok:render>

The agent generates a **draft pull request** rather than an open one.<grok:render card_id="0f54dc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">59</argument>
</grok:render><grok:render card_id="747390" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">69</argument>
</grok:render><grok:render card_id="0ecce0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render><grok:render card_id="b79ed5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">61</argument>
</grok:render> This draft includes:
- Code changes as commits.
- Updates to the PR description, which may incorporate the original prompt for context (e.g., summarizing the task).<grok:render card_id="86404e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">61</argument>
</grok:render>
- Progress logs viewable in the Agents panel.

Drafts require manual approval before CI/CD workflows run, and Copilot cannot mark them as "ready for review" or merge them.<grok:render card_id="27f779" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">69</argument>
</grok:render><grok:render card_id="4d8a34" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render> After creation, you're notified as a reviewer, allowing edits before finalization.<grok:render card_id="794ca9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">59</argument>
</grok:render>

| Aspect | Details | Relevance to Privacy |
|--------|---------|----------------------|
| PR Type | Draft (not immediately "ready for review") | Allows editing to remove prompts before public exposure.<grok:render card_id="d5eeaf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">69</argument>
</grok:render> |
| Prompt Inclusion | Likely in description or commits for task summary | This is the "AI conversation" you want hidden; editable post-creation. |
| Environment | Sandboxed with read-only repo access | Prevents unauthorized changes but doesn't affect PR visibility.<grok:render card_id="de68ee" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">69</argument>
</grok:render> |
| Access Requirements | Write permissions; configurable per repo | Limits who can initiate, but PRs remain tied to repo visibility.<grok:render card_id="a1a62c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render> |

#### Visibility and Privacy Constraints
GitHub PRs cannot be made private independently of the repository.<grok:render card_id="0e188a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render><grok:render card_id="012ffb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render><grok:render card_id="1a28f5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render><grok:render card_id="8f5362" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render> Key rules:
- **Public Repo = Public PR**: Drafts appear in the repo's PR list with a "Draft" label and are accessible to anyone, even before marking ready.<grok:render card_id="949022" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render><grok:render card_id="b89eb0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render>
- **No Selective Privacy**: Features like draft mode don't hide PRs; they only delay full review processes.<grok:render card_id="801fbd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render>
- **Prompt Exposure Risks**: If the prompt is in the description, it's visible immediately upon PR creation in public repos, potentially revealing your AI interactions.<grok:render card_id="96bfb2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render><grok:render card_id="09f2c6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>

Copilot adheres to GitHub's privacy policies: It doesn't use private repo code for training, but prompts may contribute to improvements unless opted out.<grok:render card_id="049a65" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render><grok:render card_id="8a44b8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render><grok:render card_id="bf1602" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render> Enterprise users can enforce stricter controls.<grok:render card_id="78c511" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">69</argument>
</grok:render> However, these don't address PR visibility.

#### Workarounds for Hiding AI Prompts
Since direct privatization isn't feasible, leverage forks or editing:<grok:render card_id="de518d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render card_id="f82d4e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render>

1. **Private Fork Method (Recommended for Full Privacy)**:
   - Fork the public repo to a private one (github.com/[repo]/fork, set to private).<grok:render card_id="a86f05" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render>
   - Grant Copilot access to the fork only.<grok:render card_id="86a24a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render><grok:render card_id="64294f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>
   - Run the agent in the fork: Draft PR stays private.
   - Edit/remove prompt from description/commits.
   - Merge in fork, then create a new PR from fork to upstream public repo (diff visible, but no AI details).<grok:render card_id="541183" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render><grok:render card_id="f2cf43" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render>

   This keeps the original repo untouched.

2. **Direct Editing in Public Repo (Quick but Riskier)**:
   - Submit prompt in the public repo.
   - Immediately after draft creation, edit the PR to strip prompts.
   - Mark as ready only after sanitization.<grok:render card_id="180445" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">59</argument>
</grok:render>

| Workaround | Pros | Cons | Best For |
|------------|------|------|----------|
| Private Fork | Full isolation of AI workflow; no temporary exposure | Extra steps; uses fork quota | Sensitive prompts or frequent use.<grok:render card_id="850b85" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render> |
| Direct Editing | Simple; no new repos needed | Brief public visibility window | Low-risk prompts; quick tasks. |

#### Additional Best Practices and Alternatives
- **Opt-Outs and Controls**: In Copilot settings, limit repo access and disable data use for improvements.<grok:render card_id="bdaeaf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render><grok:render card_id="7962b2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- **Enterprise Features**: Organizations can restrict agent use or models.<grok:render card_id="c70366" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">69</argument>
</grok:render>
- **Alternatives if Privacy is Paramount**: Use local AI tools or open-source agents like CodiumAI PR-Agent, avoiding cloud exposure.<grok:render card_id="b3386e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- **Recent Updates (as of Sept 2025)**: Draft PRs are free in all repos since May 2025, but no new privacy toggles for individual PRs.<grok:render card_id="70cfe7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render>

This approach balances Copilot's utility with your privacy needs, ensuring AI prompts remain confidential without compromising repo integrity.

### Key Citations
- [About GitHub Copilot coding agent](https://docs.github.com/en/copilot/concepts/coding-agent/coding-agent)
- [Asking GitHub Copilot to create a pull request](https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/asking-copilot-to-create-a-pull-request)
- [GitHub Copilot: Meet the new coding agent](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/)
- [Private copilot swe agent use · community · Discussion #169428](https://github.com/orgs/community/discussions/169428)
- [About permissions and visibility of forks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-permissions-and-visibility-of-forks)
- [GitHub pull request from private to public repo possible?](https://stackoverflow.com/questions/8834755/github-pull-request-from-private-to-public-repo-possible)
- [Draft pull requests are now available in all repositories](https://github.blog/changelog/2025-05-01-draft-pull-requests-are-now-available-in-all-repositories/)
- [GitHub Copilot Security and Privacy Concerns](https://blog.gitguardian.com/github-copilot-security-and-privacy/)
- [Managing GitHub Copilot policies as an individual subscriber](https://docs.github.com/copilot/how-tos/manage-your-account/managing-copilot-policies-as-an-individual-subscriber)
- [CodiumAI PR-Agent VS GitHub Copilot For Pull Requests](https://dev.to/dukeofhazardz/revolutionizing-pull-request-collaboration-codiumai-pr-agent-vs-github-copilot-for-pull-requests-2e7o)
