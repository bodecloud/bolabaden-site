/**
 * Application configuration — SINGLE SOURCE OF TRUTH
 * Every site-wide value lives here. Components import from config, never hardcode.
 */

type GenericRecord = Record<string, unknown>;

export type NavigationItem = {
  href: string;
  label: string;
};

export type HomeHubCard = {
  title: string;
  description: string;
  href: string;
  icon: "compass" | "dashboard" | "code" | "book" | "blocks";
  cta: string;
};

export type HomeExploreLane = {
  title: string;
  description: string;
  href: string;
  icon: "rocket" | "workflow" | "layers" | "cpu";
  cta: string;
};

export type ShowcaseItem = {
  id: string;
  title: string;
  description?: string;
  type: "link" | "embed" | "iframe" | "text";
  href?: string;
  src?: string;
  icon?: string;
  color?: string;
  aspectRatio?: "auto" | "square" | "video" | "wide";
};

export type HomeLayoutSectionId =
  | "embeds"
  | "showcase"
  | "home-hub"
  | "explore-lanes"
  | "future-blocks"
  | "proof-ledger"
  | "desk-artifact"
  | "archive-boundary"
  | "desk-bot"
  | "field-notes";

export type DeskArtifact = {
  id: string;
  title: string;
  note: string;
  /** Who approved this content for public display. Required, non-blank. */
  approvedBy: string;
};

export type ProofLedgerRow = {
  thread: string;
  whatExists: string;
  whyItMatters: string;
  routeLabel: string;
  routeHref: string;
};

export type ArchiveBoundaryCard = {
  tag: string;
  title: string;
  description: string;
};

export type HomeLayoutSection = {
  id: HomeLayoutSectionId;
  label: string;
  enabled: boolean;
  order: number;
};

export type AboutLayoutSectionId =
  | "hero"
  | "embeds"
  | "projects"
  | "guides"
  | "github-stats"
  | "about"
  | "contact";

export type AboutLayoutSection = {
  id: AboutLayoutSectionId;
  label: string;
  enabled: boolean;
  order: number;
};

export type TocConfigItem = {
  id: string;
  label: string;
};

export function envString(name: string, defaultValue: string): string {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  const normalized = raw.trim();
  return normalized.length > 0 ? normalized : defaultValue;
}

export function envNumber(name: string, defaultValue: number): number {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

export function envCsv(name: string, defaultValues: string[]): string[] {
  const raw = process.env[name];
  if (!raw) return defaultValues;
  const parsed = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : defaultValues;
}

function isRecord(value: unknown): value is GenericRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function envJson<T>(name: string, defaultValue: T): T {
  const raw = process.env[name];
  if (!raw) return defaultValue;

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(defaultValue)) {
      return (Array.isArray(parsed) ? parsed : defaultValue) as T;
    }

    if (isRecord(defaultValue)) {
      return (isRecord(parsed) ? parsed : defaultValue) as T;
    }

    return (parsed ?? defaultValue) as T;
  } catch {
    return defaultValue;
  }
}

export function envFlag(name: string, defaultValue: boolean = true): boolean {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  const normalized = raw.toString().trim().toLowerCase();
  return !["false", "0", "no", "off"].includes(normalized);
}

export type ChromeMode = "dual" | "discovery";

export function envChromeMode(name: string, defaultValue: ChromeMode): ChromeMode {
  const raw = process.env[name]?.trim().toLowerCase();
  if (raw === "discovery") return "discovery";
  if (raw === "dual") return "dual";
  return defaultValue;
}

export const config = {
  /** Owner / personal identity */
  OWNER_NAME: envString("NEXT_PUBLIC_OWNER_NAME", "Boden Crouch"),
  JOB_TITLE: envString("NEXT_PUBLIC_JOB_TITLE", "Infrastructure Engineer"),
  JOB_SUBTITLE: envString(
    "NEXT_PUBLIC_JOB_SUBTITLE",
    "Self-taught infrastructure engineer & software developer",
  ),
  BIO: envString(
    "NEXT_PUBLIC_BIO",
    "I design, deploy, and maintain complex technical systems, create open source projects, and share technical knowledge. Open to remote opportunities.",
  ),

  /** Contact */
  CONTACT_EMAIL: envString(
    "NEXT_PUBLIC_CONTACT_EMAIL",
    "boden.crouch@gmail.com",
  ),
  LINKEDIN_URL: envString(
    "NEXT_PUBLIC_LINKEDIN_URL",
    "https://linkedin.com/in/boden-crouch-555897193/",
  ),

  /** Site / domain */
  SITE_PROTOCOL: envString("NEXT_PUBLIC_SITE_PROTOCOL", "https"),
  SITE_DOMAIN: envString("NEXT_PUBLIC_SITE_DOMAIN", "bolabaden.org"),
  SITE_NAME: envString("NEXT_PUBLIC_SITE_NAME", "bolabaden.org"),
  SEARXNG_PUBLIC_URL: envString(
    "NEXT_PUBLIC_SEARXNG_PUBLIC_URL",
    "https://searx.be",
  ),
  SEARXNG_SEARCH_PATH: envString("NEXT_PUBLIC_SEARXNG_SEARCH_PATH", "/search"),
  RESUME_PATH: envString("NEXT_PUBLIC_RESUME_PATH", "/Boden_Crouch_Resume.pdf"),

  /** GitHub */
  GITHUB_OWNER: envString("NEXT_PUBLIC_GITHUB_OWNER", "bolabaden"),
  /** Comma-separated list of GitHub usernames whose repos are aggregated */
  GITHUB_USERNAMES: envCsv("NEXT_PUBLIC_GITHUB_USERS", [
    "bolabaden",
    "th3w1zard1",
  ]),

  /** Experience */
  EXPERIENCE_START_YEAR: Math.floor(
    envNumber("NEXT_PUBLIC_EXPERIENCE_START_YEAR", 2021),
  ),

  /** Location / timezone (shown in contact & footer) */
  LOCATION: envString("NEXT_PUBLIC_LOCATION", "Remote"),
  TIMEZONE: envString("NEXT_PUBLIC_TIMEZONE", "UTC-6 (Central)"),

  /** Site-wide copy and metadata */
  HTML_LANG: envString("NEXT_PUBLIC_HTML_LANG", "en"),
  /** dual = portfolio chrome on /about; discovery = PageLayout everywhere */
  CHROME_MODE: envChromeMode("NEXT_PUBLIC_CHROME_MODE", "dual"),
  SITE_SECTION_LABEL: envString(
    "NEXT_PUBLIC_SITE_SECTION_LABEL",
    "Field Desk",
  ),
  SITE_META_DESCRIPTION: envString(
    "NEXT_PUBLIC_SITE_META_DESCRIPTION",
    "Boden Crouch's field desk for old game tools, AI workflow notes, self-hosted services, and field-tested guides.",
  ),
  SITE_META_KEYWORDS: envCsv("NEXT_PUBLIC_SITE_META_KEYWORDS", [
    "Boden Crouch",
    "field desk",
    "guides",
    "projects",
    "self-hosted services",
    "docker",
    "kubernetes",
    "automation",
    "tooling",
  ]),
  SITE_OG_DESCRIPTION: envString(
    "NEXT_PUBLIC_SITE_OG_DESCRIPTION",
    "Old game tools, AI workflow notes, live services, and guides that actually got used.",
  ),
  SITE_JSONLD_DESCRIPTION: envString(
    "NEXT_PUBLIC_SITE_JSONLD_DESCRIPTION",
    "Boden Crouch's field desk: old game tools, AI workflow notes, live services, and practical guides.",
  ),

  /** Home page — "Proof desk" (see docs/plans/2026-07-07-001) */
  HOME_HERO_EYEBROW: envString(
    "NEXT_PUBLIC_HOME_HERO_EYEBROW",
    "Boden Crouch / field desk",
  ),
  HOME_HERO_TITLE: envString(
    "NEXT_PUBLIC_HOME_HERO_TITLE",
    "I keep taking broken tools, old games, weird archives, and vague answers apart until there is proof.",
  ),
  HOME_HERO_DESCRIPTION: envString(
    "NEXT_PUBLIC_HOME_HERO_DESCRIPTION",
    "This is the useful front door: old game tooling, AI workflow notes, self-hosting experiments, server traces, public guides, and the parts of the archive that can be summarized without turning private logs into content.",
  ),
  HOME_PAGE_TITLE: envString(
    "NEXT_PUBLIC_HOME_PAGE_TITLE",
    "Boden Crouch | Proof desk",
  ),
  HOME_PAGE_DESCRIPTION: envString(
    "NEXT_PUBLIC_HOME_PAGE_DESCRIPTION",
    "Boden Crouch's proof-first field desk for old game tools, AI/tool notes, server traces, public guides, and useful routes.",
  ),
  HOME_PAGE_KEYWORDS: envCsv("NEXT_PUBLIC_HOME_PAGE_KEYWORDS", [
    "Boden Crouch",
    "KOTOR tools",
    "Holocron Toolset",
    "old game modding",
    "self-hosting",
    "local LLMs",
    "infrastructure engineer",
    "practical technical notes",
  ]),
  HOME_HUB_TITLE: envString("NEXT_PUBLIC_HOME_HUB_TITLE", "The desk"),
  HOME_HUB_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_HUB_SUBTITLE",
    "Four ways in, depending on what you actually want.",
  ),
  HOME_HUB_INTRO: envString(
    "NEXT_PUBLIC_HOME_HUB_INTRO",
    "No tour, no forced order. Pick whichever one answers your question.",
  ),
  /**
   * HOME_HUB_CARDS: Main entry points that reflect the portfolio/discovery split:
   * - About: Portfolio-focused (curated projects, background, discussion)
   * - Service Dashboard: Operational status monitoring
   * - Contributions: Dynamic discovery of all repos, gists, activity
   * - Technical Playbooks: Reference guides and implementation docs
   */
  HOME_HUB_CARDS: envJson<HomeHubCard[]>("NEXT_PUBLIC_HOME_HUB_CARDS_JSON", [
    {
      title: "About",
      description:
        "The long version — background, full portfolio, how I got here.",
      href: "/about",
      icon: "compass",
      cta: "Read the long version",
    },
    {
      title: "The status board",
      description:
        "What's actually running right now, not what the resume claims.",
      href: "/dashboard",
      icon: "dashboard",
      cta: "Check what's up",
    },
    {
      title: "Commit history",
      description: "Repos, gists, and activity — ranked by what I touch most.",
      href: "/projects",
      icon: "blocks",
      cta: "See what I've shipped",
    },
    {
      title: "Field notes",
      description:
        "Write-ups for problems I actually hit and how I got out of them.",
      href: "/guides",
      icon: "book",
      cta: "Read the notes",
    },
  ]),
  HOME_LAYOUT_SECTIONS: envJson<HomeLayoutSection[]>(
    "NEXT_PUBLIC_HOME_LAYOUT_SECTIONS_JSON",
    [
      { id: "showcase", label: "Showcase", enabled: true, order: 1 },
      { id: "embeds", label: "Live Services", enabled: true, order: 2 },
      { id: "proof-ledger", label: "Ledger", enabled: true, order: 3 },
      { id: "home-hub", label: "Hub", enabled: true, order: 4 },
      { id: "explore-lanes", label: "Explore", enabled: true, order: 5 },
      { id: "archive-boundary", label: "Archive", enabled: true, order: 6 },
      { id: "desk-artifact", label: "Desk Notes", enabled: true, order: 7 },
      { id: "field-notes", label: "Field Notes", enabled: true, order: 8 },
      { id: "desk-bot", label: "Ask the desk", enabled: true, order: 9 },
      { id: "future-blocks", label: "Future", enabled: true, order: 10 },
    ],
  ),
  HOME_SHOWCASE_TITLE: envString(
    "NEXT_PUBLIC_HOME_SHOWCASE_TITLE",
    "Quick exits",
  ),
  HOME_SHOWCASE_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_SHOWCASE_SUBTITLE",
    "If you already know what you want, go straight there.",
  ),
  HOME_SHOWCASE_ITEMS: envJson<ShowcaseItem[]>(
    "NEXT_PUBLIC_HOME_SHOWCASE_ITEMS_JSON",
    [
      {
        id: "showcase-dashboard",
        title: "Live dashboard",
        description: "Service health and container status, right now.",
        type: "link",
        href: "/dashboard#services-table",
        color: "from-emerald-600/20 to-teal-600/20",
      },
      {
        id: "showcase-guides",
        title: "Field notes",
        description: "Walkthroughs for the stuff I actually had to solve.",
        type: "link",
        href: "/guides",
        color: "from-blue-600/20 to-cyan-600/20",
      },
      {
        id: "showcase-contact",
        title: "Contact",
        description: "Want to work together or just say hi? Start here.",
        type: "link",
        href: "/contact",
        color: "from-orange-600/20 to-red-600/20",
      },
      {
        id: "showcase-github",
        title: "GitHub",
        description: "Repos, commits, and whatever I'm currently breaking.",
        type: "link",
        href: `https://github.com/${envString("NEXT_PUBLIC_GITHUB_OWNER", "bolabaden")}`,
        color: "from-purple-600/20 to-pink-600/20",
      },
      {
        id: "showcase-searx",
        title: "Search",
        description: "Search the desk on-site, with an external fallback.",
        type: "link",
        href: "/search?q=bolabaden",
        color: "from-green-600/20 to-emerald-600/20",
      },
    ],
  ),
  HOME_EMBEDS_MODE: envString("NEXT_PUBLIC_HOME_EMBEDS_MODE", "default"),
  HOME_EMBEDS_FALLBACK_TITLE: envString(
    "NEXT_PUBLIC_HOME_EMBEDS_FALLBACK_TITLE",
    "Live services",
  ),
  HOME_TOC_ITEMS: envJson<TocConfigItem[]>("NEXT_PUBLIC_HOME_TOC_ITEMS_JSON", [
    { id: "showcase", label: "Showcase" },
    { id: "embeds", label: "Live Services" },
    { id: "proof-ledger", label: "Ledger" },
    { id: "home-hub", label: "Hub" },
    { id: "explore-lanes", label: "Explore" },
    { id: "archive-boundary", label: "Archive" },
    { id: "desk-artifact", label: "Desk Notes" },
    { id: "desk-bot", label: "Ask the desk" },
    { id: "future-blocks", label: "Future" },
  ]),
  HOME_EXPLORE_TITLE: envString(
    "NEXT_PUBLIC_HOME_EXPLORE_TITLE",
    "What I actually spend time on",
  ),
  HOME_EXPLORE_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_EXPLORE_SUBTITLE",
    "Pick a lane based on what you're here for.",
  ),
  HOME_EXPLORE_LANES: envJson<HomeExploreLane[]>(
    "NEXT_PUBLIC_HOME_EXPLORE_LANES_JSON",
    [
      {
        title: "What I'm building",
        description:
          "Shipped projects and the ones still half-finished on purpose.",
        href: "/projects",
        icon: "rocket",
        cta: "See the projects",
      },
      {
        title: "What's actually running",
        description:
          "Self-hosted services, uptime, and the infra behind this site.",
        href: "/dashboard",
        icon: "cpu",
        cta: "Check the board",
      },
      {
        title: "Notes and fixes",
        description:
          "KOTOR tooling, modding, debugging, and other things I wrote down so I wouldn't forget.",
        href: "/guides",
        icon: "workflow",
        cta: "Read the notes",
      },
      {
        title: "The long version",
        description: "Full background if you want more than the desk gives you.",
        href: "/about",
        icon: "layers",
        cta: "Keep reading",
      },
    ],
  ),
  HOME_DESK_ARTIFACT_TITLE: envString(
    "NEXT_PUBLIC_HOME_DESK_ARTIFACT_TITLE",
    "Something I found",
  ),
  HOME_DESK_ARTIFACT_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_DESK_ARTIFACT_SUBTITLE",
    "Rotates. Come back later for a different one.",
  ),
  HOME_DESK_ARTIFACTS: envJson<DeskArtifact[]>(
    "NEXT_PUBLIC_HOME_DESK_ARTIFACTS_JSON",
    [
      {
        id: "artifact-scoreboard",
        title: "Old Halo postgame carnage report",
        note: "Found while sorting an Xfire archive. Still not sure why I screenshotted the loss.",
        approvedBy: "Boden Crouch",
      },
      {
        id: "artifact-rcon",
        title: "A server command I forgot I wrote",
        note: "An RCON alias from a game server I ran years ago. It still works.",
        approvedBy: "Boden Crouch",
      },
      {
        id: "artifact-toolset",
        title: "Holocron Toolset issue thread",
        note: "A KOTOR modding bug report that turned into three days of file-format archaeology.",
        approvedBy: "Boden Crouch",
      },
      {
        id: "artifact-glitch",
        title: "A glitch I never reported",
        note: "Caught it on camera once. Never filed the bug. It's probably still there.",
        approvedBy: "Boden Crouch",
      },
      {
        id: "artifact-debug-log",
        title: "A debug log that solved itself",
        note: "Spent an hour reproducing it. It stopped happening before I finished the reproduction steps.",
        approvedBy: "Boden Crouch",
      },
    ],
  ),
  HOME_BOT_TITLE: envString("NEXT_PUBLIC_HOME_BOT_TITLE", "Ask the desk"),
  HOME_BOT_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_BOT_SUBTITLE",
    "A guide, not an archive. It won't quote private logs — it points you somewhere useful instead.",
  ),
  HOME_BOT_DISABLED_MESSAGE: envString(
    "NEXT_PUBLIC_HOME_BOT_DISABLED_MESSAGE",
    "The desk guide isn't wired up publicly yet. Try /projects, /guides, or /contact instead.",
  ),
  HOME_LEDGER_TITLE: envString(
    "NEXT_PUBLIC_HOME_LEDGER_TITLE",
    "Every row needs a thing you can inspect.",
  ),
  HOME_LEDGER_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_LEDGER_SUBTITLE",
    "proof ledger",
  ),
  HOME_LEDGER_ROWS: envJson<ProofLedgerRow[]>(
    "NEXT_PUBLIC_HOME_LEDGER_ROWS_JSON",
    [
      {
        thread: "old game tooling",
        whatExists:
          "Holocron Toolset, PyKotor, TPC/TGA workflows, dialogue graphs",
        whyItMatters:
          "sealed game data becomes inspectable instead of folklore",
        routeLabel: "/projects",
        routeHref: "/projects",
      },
      {
        thread: "AI workflow notes",
        whatExists:
          "exports, agent plans, RAG complaints, real-tool boundaries",
        whyItMatters:
          "answers should touch files, docs, routes, builds, or logs",
        routeLabel: "/guides",
        routeHref: "/guides",
      },
      {
        thread: "servers and infra",
        whatExists:
          "status surfaces, deployment notes, self-hosted search, fallbacks",
        whyItMatters:
          "if a service is broken, the page should not pretend it is fine",
        routeLabel: "/dashboard",
        routeHref: "/dashboard",
      },
      {
        thread: "old internet archive",
        whatExists: "Xfire clips, Halo server screenshots, Wizard command docs",
        whyItMatters:
          "the pattern was already there: save the weird thing, debug it",
        routeLabel: "#desk-artifact",
        routeHref: "#desk-artifact",
      },
    ],
  ),
  HOME_ARCHIVE_TITLE: envString(
    "NEXT_PUBLIC_HOME_ARCHIVE_TITLE",
    "The archive can shape the site without becoming the site.",
  ),
  HOME_ARCHIVE_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_ARCHIVE_SUBTITLE",
    "Discord exports, Xfire files, private-server command manuals, and old notes inform the voice and taxonomy here. Raw private logs stay private. That is not a footnote; it is the design rule.",
  ),
  HOME_ARCHIVE_CARDS: envJson<ArchiveBoundaryCard[]>(
    "NEXT_PUBLIC_HOME_ARCHIVE_CARDS_JSON",
    [
      {
        tag: "public",
        title: "Projects and guides",
        description: "Things already meant for people to inspect, reuse, or judge.",
      },
      {
        tag: "summarized",
        title: "Archive patterns",
        description: "Topics, habits, old tool energy, and source boundaries.",
      },
      {
        tag: "private",
        title: "Messages and DMs",
        description: "Used for internal taste, not dumped as public material.",
      },
      {
        tag: "not indexed",
        title: "Future shelves",
        description: "Anything not cleaned, sourced, and bounded stays out.",
      },
    ],
  ),
  HOME_FUTURE_TITLE: envString(
    "NEXT_PUBLIC_HOME_FUTURE_TITLE",
    "Future Spaces",
  ),
  HOME_FUTURE_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_FUTURE_SUBTITLE",
    "Intentional placeholders so this homepage can evolve beyond a standard portfolio format.",
  ),
  HOME_FUTURE_BADGE: envString("NEXT_PUBLIC_HOME_FUTURE_BADGE", "Idea Sandbox"),
  HOME_FUTURE_PLACEHOLDERS: envJson<string[]>(
    "NEXT_PUBLIC_HOME_FUTURE_PLACEHOLDERS_JSON",
    [
      "Release Notes Stream (Placeholder)",
      "Field Reports / Build Logs (Placeholder)",
      "Tool Directory (Placeholder)",
      "Mini Apps Shelf (Placeholder)",
      "Learning Paths (Placeholder)",
      "Community Updates (Placeholder)",
      "Monthly Snapshot (Placeholder)",
      "Public Experiments Lab (Placeholder)",
    ],
  ),
  get HOME_FUTURE_RELEASES_ENABLED() {
    return envFlag("NEXT_PUBLIC_HOME_FUTURE_RELEASES_ENABLED", true);
  },

  /** Page metadata */
  CONTACT_PAGE_TITLE: envString("NEXT_PUBLIC_CONTACT_PAGE_TITLE", "Contact"),
  CONTACT_HERO_TITLE: envString(
    "NEXT_PUBLIC_CONTACT_HERO_TITLE",
    "Get in touch",
  ),
  CONTACT_PAGE_DESCRIPTION: envString(
    "NEXT_PUBLIC_CONTACT_PAGE_DESCRIPTION",
    "Direct contact options including email and social profiles. Reach out for questions, collaborations, or inquiries.",
  ),
  DASHBOARD_PAGE_TITLE: envString(
    "NEXT_PUBLIC_DASHBOARD_PAGE_TITLE",
    "Dashboard — Status & Monitoring",
  ),
  DASHBOARD_PAGE_DESCRIPTION: envString(
    "NEXT_PUBLIC_DASHBOARD_PAGE_DESCRIPTION",
    "Live status, monitoring, and embedded views of production self-hosted services and infrastructure.",
  ),
  get DASHBOARD_EMBEDS_ENABLED() {
    return envFlag("NEXT_PUBLIC_DASHBOARD_EMBEDS_ENABLED", true);
  },
  PROJECTS_PAGE_TITLE: envString("NEXT_PUBLIC_PROJECTS_PAGE_TITLE", "Projects"),
  PROJECTS_PAGE_DESCRIPTION: envString(
    "NEXT_PUBLIC_PROJECTS_PAGE_DESCRIPTION",
    "Explore dynamically ranked repositories and gists by stars, commits, popularity, ownership, and contribution context.",
  ),
  GUIDES_PAGE_TITLE: envString(
    "NEXT_PUBLIC_GUIDES_PAGE_TITLE",
    "Technical Playbooks",
  ),
  GUIDES_PAGE_DESCRIPTION: envString(
    "NEXT_PUBLIC_GUIDES_PAGE_DESCRIPTION",
    "Reference guides and technical walkthroughs on Kubernetes, Docker, Terraform, and infrastructure engineering. Implementation-focused documentation.",
  ),
  GUIDES_INDEX_SECTION_TITLE: envString(
    "NEXT_PUBLIC_GUIDES_INDEX_SECTION_TITLE",
    "All Guides",
  ),
  GUIDES_INDEX_SECTION_SUBTITLE: envString(
    "NEXT_PUBLIC_GUIDES_INDEX_SECTION_SUBTITLE",
    "Browse detailed technical guides.",
  ),
  GUIDES_INDEX_CARD_CTA: envString(
    "NEXT_PUBLIC_GUIDES_INDEX_CARD_CTA",
    "Read Guide →",
  ),
  GUIDE_NOT_FOUND_TITLE: envString(
    "NEXT_PUBLIC_GUIDE_NOT_FOUND_TITLE",
    "Guide Not Found",
  ),
  GUIDE_BACK_TO_INDEX_LABEL: envString(
    "NEXT_PUBLIC_GUIDE_BACK_TO_INDEX_LABEL",
    "← All Guides",
  ),
  GUIDE_INLINE_TOC_LABEL: envString(
    "NEXT_PUBLIC_GUIDE_INLINE_TOC_LABEL",
    "On this page",
  ),
  GUIDE_INLINE_TOC_ARIA: envString(
    "NEXT_PUBLIC_GUIDE_INLINE_TOC_ARIA",
    "On this page",
  ),

  /** Field notes -- short, frequent posts; separate from Guides */
  NOTES_PAGE_TITLE: envString("NEXT_PUBLIC_NOTES_PAGE_TITLE", "Field Notes"),
  NOTES_PAGE_DESCRIPTION: envString(
    "NEXT_PUBLIC_NOTES_PAGE_DESCRIPTION",
    "Short, frequent posts -- less how-to, more what happened.",
  ),
  NOTES_INDEX_SECTION_TITLE: envString(
    "NEXT_PUBLIC_NOTES_INDEX_SECTION_TITLE",
    "All Notes",
  ),
  NOTES_EMPTY_STATE_LABEL: envString(
    "NEXT_PUBLIC_NOTES_EMPTY_STATE_LABEL",
    "No notes yet.",
  ),
  NOTE_NOT_FOUND_TITLE: envString(
    "NEXT_PUBLIC_NOTE_NOT_FOUND_TITLE",
    "Note Not Found",
  ),
  NOTE_BACK_TO_INDEX_LABEL: envString(
    "NEXT_PUBLIC_NOTE_BACK_TO_INDEX_LABEL",
    "← All Notes",
  ),
  HOME_NOTES_TITLE: envString("NEXT_PUBLIC_HOME_NOTES_TITLE", "Field notes"),
  HOME_NOTES_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_NOTES_SUBTITLE",
    "Short, frequent -- separate from Guides.",
  ),
  HOME_NOTES_MAX_ITEMS: envNumber("NEXT_PUBLIC_HOME_NOTES_MAX_ITEMS", 5),
  /** Days since the newest note before the homepage feed shows a resting state instead. */
  HOME_NOTES_STALE_THRESHOLD_DAYS: envNumber(
    "NEXT_PUBLIC_HOME_NOTES_STALE_THRESHOLD_DAYS",
    45,
  ),
  HOME_NOTES_RESTING_LABEL: envString(
    "NEXT_PUBLIC_HOME_NOTES_RESTING_LABEL",
    "No recent notes -- browse the full archive.",
  ),

  /** Navigation */
  /**
   * NAV_ITEMS: Main site navigation emphasizing discovery and reference
   * - Contributions: Dynamic explorer of all repositories, gists, and activity
   * - Status: Operational monitoring of live services
   * - Playbooks: Technical reference documentation
   */
  NAV_ITEMS: envJson<NavigationItem[]>("NEXT_PUBLIC_NAV_ITEMS_JSON", [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Contributions" },
    { href: "/dashboard", label: "Status" },
    { href: "/guides", label: "Playbooks" },
    { href: "/contact", label: "Contact" },
  ]),
  /**
   * ABOUT_NAV_ITEMS: About page navigation emphasizing portfolio and background
   * Links anchor to sections within /about to keep context cohesive
   * - Portfolio: Curated projects and production-ready work
   * - Learning: Technical knowledge sharing and infrastructure walkthroughs
   * - Discuss: Direct contact for technical collaboration
   */
  ABOUT_NAV_ITEMS: envJson<NavigationItem[]>(
    "NEXT_PUBLIC_ABOUT_NAV_ITEMS_JSON",
    [
      { href: "/", label: "Home" },
      { href: "/about#projects", label: "Portfolio" },
      { href: "/about#guides", label: "Learning" },
      { href: "/about#contact", label: "Discuss" },
    ],
  ),
  NAV_FUTURE_PLACEHOLDERS: envJson<string[]>(
    "NEXT_PUBLIC_NAV_FUTURE_PLACEHOLDERS_JSON",
    ["Labs (Soon)", "Notes (Soon)"],
  ),
  NAV_SEARCH_TAG: envString("NEXT_PUBLIC_NAV_SEARCH_TAG", "SearXNG"),
  NAV_SEARCH_FORM_ARIA: envString(
    "NEXT_PUBLIC_NAV_SEARCH_FORM_ARIA",
    "SearXNG search",
  ),
  NAV_SEARCH_INPUT_PLACEHOLDER: envString(
    "NEXT_PUBLIC_NAV_SEARCH_INPUT_PLACEHOLDER",
    "Search with SearXNG…",
  ),
  NAV_SEARCH_INPUT_ARIA: envString(
    "NEXT_PUBLIC_NAV_SEARCH_INPUT_ARIA",
    "Search with SearXNG",
  ),
  NAV_SEARCH_BUTTON_LABEL: envString(
    "NEXT_PUBLIC_NAV_SEARCH_BUTTON_LABEL",
    "Search",
  ),
  NAV_ABOUT_BUTTON_LABEL: envString(
    "NEXT_PUBLIC_NAV_ABOUT_BUTTON_LABEL",
    "About",
  ),

  /** On-site search page */
  SEARCH_PAGE_TITLE: envString("NEXT_PUBLIC_SEARCH_PAGE_TITLE", "Search"),
  SEARCH_PAGE_DESCRIPTION: envString(
    "NEXT_PUBLIC_SEARCH_PAGE_DESCRIPTION",
    "Search the web with SearXNG without leaving bolabaden.org.",
  ),
  SEARCH_PAGE_FORM_ARIA: envString(
    "NEXT_PUBLIC_SEARCH_PAGE_FORM_ARIA",
    "Site search",
  ),
  SEARCH_PAGE_EMPTY_HINT: envString(
    "NEXT_PUBLIC_SEARCH_PAGE_EMPTY_HINT",
    "Enter a query above to search with SearXNG.",
  ),
  SEARCH_PAGE_RESULTS_HEADING: envString(
    "NEXT_PUBLIC_SEARCH_PAGE_RESULTS_HEADING",
    'Results for "{query}"',
  ),
  SEARCH_PAGE_NO_RESULTS: envString(
    "NEXT_PUBLIC_SEARCH_PAGE_NO_RESULTS",
    "No results returned. Try a different query or open SearXNG directly.",
  ),
  SEARCH_PAGE_OPEN_EXTERNAL_LABEL: envString(
    "NEXT_PUBLIC_SEARCH_PAGE_OPEN_EXTERNAL_LABEL",
    "Open in SearXNG",
  ),
  SEARCH_PAGE_STATIC_MESSAGE: envString(
    "NEXT_PUBLIC_SEARCH_PAGE_STATIC_MESSAGE",
    "On-site search requires a server deployment with API routes. This static build links to the public SearXNG instance instead.",
  ),
  get STATIC_EXPORT() {
    return envFlag("NEXT_PUBLIC_STATIC_EXPORT", false);
  },

  /**
   * About page layout configuration
   * Emphasizes portfolio, background, and discussion context
   * "Portfolio" showcases production-ready work (not general Contributions explorer)
   * "Learning" highlights guides as knowledge-sharing, not reference docs
   * "GitHub Activity" emphasizes contribution metrics (not just repositories)
   * All CTAs anchor within /about for cohesive portfolio experience
   */
  ABOUT_LAYOUT_SECTIONS: envJson<AboutLayoutSection[]>(
    "NEXT_PUBLIC_ABOUT_LAYOUT_SECTIONS_JSON",
    [
      { id: "hero", label: "Overview", enabled: true, order: 1 },
      { id: "embeds", label: "Live Services", enabled: true, order: 2 },
      { id: "projects", label: "Portfolio", enabled: true, order: 3 },
      { id: "guides", label: "Learning", enabled: true, order: 4 },
      { id: "github-stats", label: "GitHub Activity", enabled: true, order: 5 },
      { id: "about", label: "Background", enabled: true, order: 6 },
      { id: "contact", label: "Reach Out", enabled: true, order: 7 },
    ],
  ),
  ABOUT_EMBEDS_MODE: envString("NEXT_PUBLIC_ABOUT_EMBEDS_MODE", "default"),
  ABOUT_EMBEDS_FALLBACK_TITLE: envString(
    "NEXT_PUBLIC_ABOUT_EMBEDS_FALLBACK_TITLE",
    "Live services section failed to load",
  ),
  ABOUT_TOC_ITEMS: envJson<TocConfigItem[]>(
    "NEXT_PUBLIC_ABOUT_TOC_ITEMS_JSON",
    [
      { id: "hero", label: "Overview" },
      { id: "embeds", label: "Live Services" },
      { id: "projects", label: "Portfolio" },
      { id: "guides", label: "Learning" },
      { id: "github-stats", label: "GitHub Activity" },
      { id: "about", label: "Background" },
      { id: "contact", label: "Reach Out" },
    ],
  ),

  /** Embed services — always present */
  EMBED_SERVICES: [
    ...envJson("NEXT_PUBLIC_EMBED_SERVICES_JSON", [
      {
        id: "AI-ResearchWizard",
        name: "AI Research Wizard",
        description: "AI-powered multi-model research platform",
        subdomain: "gptr",
      },
      {
        id: "SearXNG",
        name: "SearXNG",
        description: "Privacy-respecting metasearch engine",
        subdomain: "searxng",
      },
      {
        id: "homepage",
        name: "Homepage Dashboard",
        description: "Comprehensive dashboard for all self-hosted services",
        subdomain: "homepage",
      },
    ]),
  ],

  /** Cache durations (seconds) */
  CACHE_DURATION: {
    GITHUB_REPOS: envNumber("CACHE_DURATION_GITHUB_REPOS", 300),
    PROJECTS: envNumber("CACHE_DURATION_PROJECTS", 60),
    GUIDES: envNumber("CACHE_DURATION_GUIDES", 3600),
    SKILLS: envNumber("CACHE_DURATION_SKILLS", 3600),
  },

  /** OpenGraph image copy */
  OG_HOME_TITLE: envString("NEXT_PUBLIC_OG_HOME_TITLE", "Independent Web Hub"),
  OG_HOME_SUBTITLE: envString("NEXT_PUBLIC_OG_HOME_SUBTITLE", "Home"),
  OG_HOME_DESCRIPTION: envString(
    "NEXT_PUBLIC_OG_HOME_DESCRIPTION",
    "Explore guides, projects, dashboards, and future spaces.",
  ),
  OG_ABOUT_TITLE: envString("NEXT_PUBLIC_OG_ABOUT_TITLE", "About & Portfolio"),
  OG_ABOUT_SUBTITLE: envString(
    "NEXT_PUBLIC_OG_ABOUT_SUBTITLE",
    envString("NEXT_PUBLIC_OWNER_NAME", "Boden Crouch"),
  ),
  OG_ABOUT_DESCRIPTION: envString(
    "NEXT_PUBLIC_OG_ABOUT_DESCRIPTION",
    "Complete portfolio, professional background, live services, and technical expertise overview.",
  ),
  OG_CONTACT_TITLE: envString("NEXT_PUBLIC_OG_CONTACT_TITLE", "Contact"),
  OG_CONTACT_SUBTITLE: envString(
    "NEXT_PUBLIC_OG_CONTACT_SUBTITLE",
    "Start a Conversation",
  ),
  OG_CONTACT_DESCRIPTION: envString(
    "NEXT_PUBLIC_OG_CONTACT_DESCRIPTION",
    "Reach out for questions, collaboration, or project discussions.",
  ),
  OG_DASHBOARD_TITLE: envString(
    "NEXT_PUBLIC_OG_DASHBOARD_TITLE",
    "Status & Monitoring",
  ),
  OG_DASHBOARD_SUBTITLE: envString(
    "NEXT_PUBLIC_OG_DASHBOARD_SUBTITLE",
    "Live Service Status",
  ),
  OG_DASHBOARD_DESCRIPTION: envString(
    "NEXT_PUBLIC_OG_DASHBOARD_DESCRIPTION",
    "Real-time uptime and status monitoring for self-hosted infrastructure and services.",
  ),
  OG_GUIDES_TITLE: envString(
    "NEXT_PUBLIC_OG_GUIDES_TITLE",
    "Technical Playbooks",
  ),
  OG_GUIDES_SUBTITLE: envString(
    "NEXT_PUBLIC_OG_GUIDES_SUBTITLE",
    "Reference Documentation & Walkthroughs",
  ),
  OG_GUIDES_DESCRIPTION: envString(
    "NEXT_PUBLIC_OG_GUIDES_DESCRIPTION",
    "Implementation guides for Kubernetes, Docker, Terraform, VS Code automation, and infrastructure patterns.",
  ),
  OG_PROJECTS_TITLE: envString("NEXT_PUBLIC_OG_PROJECTS_TITLE", "Projects"),
  OG_PROJECTS_SUBTITLE: envString(
    "NEXT_PUBLIC_OG_PROJECTS_SUBTITLE",
    "Contributions & Gists",
  ),
  OG_PROJECTS_DESCRIPTION: envString(
    "NEXT_PUBLIC_OG_PROJECTS_DESCRIPTION",
    "Dynamic contribution intelligence across repositories and gists, grouped by ownership and use case.",
  ),

  /** Homepage section toggles */
  get HOME_LIVE_SERVICES_ENABLED() {
    return envFlag("HOME_LIVE_SERVICES_ENABLED", true);
  },
  get HOME_PROJECTS_ENABLED() {
    return envFlag("HOME_PROJECTS_ENABLED", true);
  },
  get HOME_GUIDES_ENABLED() {
    return envFlag("HOME_GUIDES_ENABLED", true);
  },
  get HOME_GITHUB_STATS_ENABLED() {
    return envFlag("HOME_GITHUB_STATS_ENABLED", true);
  },
  get HOME_ABOUT_ENABLED() {
    return envFlag("HOME_ABOUT_ENABLED", true);
  },
  get HOME_CONTACT_ENABLED() {
    return envFlag("HOME_CONTACT_ENABLED", true);
  },

  /** Private brain + twin — default off */
  get BRAIN_ENABLED() {
    return envFlag("BRAIN_ENABLED", false);
  },
  BRAIN_BASE_URL: envString("BRAIN_BASE_URL", "http://127.0.0.1:8090"),
  BRAIN_SERVICE_TOKEN: envString("BRAIN_SERVICE_TOKEN", ""),
  get BODENAI_ENABLED() {
    return envFlag("BODENAI_ENABLED", false);
  },
  BODENAI_BASE_URL: envString("BODENAI_BASE_URL", "http://127.0.0.1:8091"),
  BODENAI_SERVICE_TOKEN: envString("BODENAI_SERVICE_TOKEN", ""),
  get BODENAI_UI_PUBLIC() {
    return envFlag("NEXT_PUBLIC_BODENAI_UI", false);
  },

  /** Computed helpers — call as functions */
  get SITE_URL() {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (explicit) return explicit.replace(/\/+$/, "");
    return `${this.SITE_PROTOCOL}://${this.SITE_DOMAIN}`;
  },
  get GITHUB_URL() {
    return `https://github.com/${this.GITHUB_OWNER}`;
  },
  get SEARXNG_URL() {
    return envString("NEXT_PUBLIC_SEARXNG_URL", this.SEARXNG_PUBLIC_URL);
  },
  get SEARXNG_FALLBACK_ENABLED() {
    return (
      envFlag("SEARXNG_FALLBACK_ENABLED", true) &&
      envFlag("NEXT_PUBLIC_SEARXNG_FALLBACK_ENABLED", true)
    );
  },
  getSubdomainUrl(sub: string) {
    return `${this.SITE_PROTOCOL}://${sub}.${this.SITE_DOMAIN}`;
  },
  getRouteUrl(pathname: string) {
    if (!pathname || pathname === "/") return this.SITE_URL;
    return `${this.SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  },
  getSearxngSearchResolverUrl(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return "/search";
    return `/search?q=${encodeURIComponent(trimmed)}`;
  },
  getSearxngSearchUrl(query: string) {
    const baseUrl = this.SEARXNG_URL.replace(/\/+$/, "");
    const rawPath = this.SEARXNG_SEARCH_PATH.trim();
    const searchPath = rawPath
      ? rawPath.startsWith("/")
        ? rawPath
        : `/${rawPath}`
      : "/search";
    return `${baseUrl}${searchPath}?q=${encodeURIComponent(query)}`;
  },
  getFallbackDates: () => {
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    return { createdAt: sixMonthsAgo, updatedAt: now };
  },
} as const;

/**
 * Normalized section structure used by pages for layout configuration
 */
export type NormalizedSection<TId extends string = string> = {
  id: TId;
  label: string;
  enabled: boolean;
  order: number;
};

/**
 * Generic builder for configuring page layout sections.
 * Validates, normalizes, and sorts sections from config with fallback to legacy or defaults.
 *
 * @param layoutConfig - Array from config (HOME_LAYOUT_SECTIONS, ABOUT_LAYOUT_SECTIONS, etc.)
 * @param validIds - Set of valid section IDs for this page
 * @param labelFallbacks - Map of ID → fallback label when config label is empty
 * @param legacyFallback - Optional function to build fallback sections if layoutConfig is empty.
 *                         If not provided, uses all validIds with fallback labels.
 */
export function buildConfiguredSections<TId extends string>(
  layoutConfig: Array<{
    id: unknown;
    label?: string;
    enabled?: boolean;
    order?: number;
  }>,
  validIds: Set<TId>,
  labelFallbacks: Record<TId, string>,
  legacyFallback?: (fallbackIds: TId[]) => NormalizedSection<TId>[],
): NormalizedSection<TId>[] {
  const fromLayout = layoutConfig
    .filter((section): section is typeof section & { id: TId } =>
      validIds.has(section.id as TId),
    )
    .map((section) => ({
      id: section.id,
      label: section.label?.toString().trim() || labelFallbacks[section.id],
      enabled: Boolean(section.enabled),
      order: Number.isFinite(section.order as number)
        ? (section.order as number)
        : 999,
    }))
    .sort((a, b) => a.order - b.order);

  if (fromLayout.length > 0) return fromLayout;

  // Use legacy fallback if provided, otherwise return all valid IDs with fallback labels
  if (legacyFallback) {
    return legacyFallback(Array.from(validIds));
  }

  const fallbackIds = Array.from(validIds);
  return fallbackIds.map((id, index) => ({
    id,
    label: labelFallbacks[id],
    enabled: true,
    order: index + 1,
  }));
}

/**
 * Calculate years of experience from start year
 */
export function getYearsOfExperience(): number {
  const currentYear = new Date().getFullYear();
  return Math.max(0, currentYear - config.EXPERIENCE_START_YEAR);
}

/**
 * Get a human-readable relative time string.
 * Accepts a Date object, an ISO string, or null/undefined.
 * JSON-deserialising an API response turns Date fields into strings,
 * so always coerce to Date before calling any Date methods.
 */
export function getRelativeTime(
  date: Date | string | null | undefined,
): string {
  if (!date) return "unknown";
  const d = date instanceof Date ? date : new Date(date as string);
  if (isNaN(d.getTime())) return "unknown";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  const years = Math.floor(diffDays / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

/**
 * Format date for display.
 * Accepts a Date object, an ISO string, or null/undefined.
 */
export function formatDate(
  date: Date | string | null | undefined,
  format: "short" | "long" | "iso" = "short",
): string {
  if (!date) return "unknown";
  const d = date instanceof Date ? date : new Date(date as string);
  if (isNaN(d.getTime())) return "unknown";
  switch (format) {
    case "short":
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    case "long":
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    case "iso":
      return d.toISOString();
    default:
      return d.toLocaleDateString();
  }
}
