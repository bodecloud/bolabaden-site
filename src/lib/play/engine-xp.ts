import { randomUUID } from "crypto";
import {
  HISTORY_CARDS,
  PLAY_HOSTS,
  PLAY_ROOM_ORDER,
  getBaseRoom,
} from "./content";
import type {
  PlayAccord,
  PlayAnomaly,
  PlayAnchor,
  PlayCommandOutcome,
  PlayCircuit,
  PlayBrief,
  PlayDaemon,
  PlayFile,
  PlayHost,
  PlayHistoryCard,
  PlayIncident,
  PlayKnownRoute,
  PlayLedger,
  PlayMessage,
  PlayMesh,
  PlayNotebookEntry,
  PlayOperation,
  PlayPresence,
  PlayPressureReport,
  PlayReplica,
  PlayRoom,
  PlayRoomId,
  PlayRunbook,
  PlayService,
  PlaySector,
  PlaySnapshot,
  PlayTranscriptLine,
  PlayTrustLink,
  PlayWaypoint,
} from "./types";

export type PlaySession = {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  authenticated: boolean;
  username: string | null;
  shellMode: "nli" | "shell" | "basic" | "monitor";
  sttyMode: "tty" | "dumb";
  pagerEnabled: boolean;
  pagerLines: string[] | null;
  pagerOffset: number;
  roomStack: PlayRoomId[];
  currentRoom: PlayRoomId;
  solved: boolean;
  inventory: string[];
  badges: string[];
  loginHosts: PlayRoomId[];
  rootedRooms: PlayRoomId[];
  discoveredRooms: PlayRoomId[];
  securedRooms: PlayRoomId[];
  hardening: Partial<Record<PlayRoomId, HostHardening>>;
  knownRoutes: Partial<Record<PlayRoomId, PlayRoomId[]>>;
  hostPressure: Partial<Record<PlayRoomId, HostPressure>>;
  notebook: Record<string, PlayNotebookEntry>;
  operations: Record<string, StoredOperation>;
  replicas: Partial<Record<PlayRoomId, StoredReplica>>;
  briefs: Record<string, StoredBrief>;
  daemons: Partial<Record<PlayRoomId, StoredDaemon>>;
  incidents: Record<string, StoredIncident>;
  waypoints: Partial<Record<PlayRoomId, StoredWaypoint>>;
  meshStabilized: boolean;
  trustLinks: Record<string, StoredTrustLink>;
  services: Partial<Record<PlayRoomId, StoredService>>;
  runbooks: Partial<Record<PlayRoomId, StoredRunbook>>;
  sectors: Record<string, StoredSector>;
  accord: StoredAccord | null;
  presence: Record<string, StoredPresence>;
  anomalies: Record<string, StoredAnomaly>;
  anchors: Record<string, StoredAnchor>;
  circuits: Record<string, StoredCircuit>;
  ledger: StoredLedger;
  boards: Partial<Record<PlayRoomId, PlayMessage[]>>;
  inbox: PlayMessage[];
  basicProgram: string | null;
  basicPrograms: Partial<Record<string, string[]>>;
  transcript: PlayTranscriptLine[];
  invalidAttempts: number;
  commandCount: number;
};

type DirectoryEntry = {
  title: string;
  role: string;
  note: string;
};

type HostHardening = {
  audited: boolean;
  patched: boolean;
  firewalled: boolean;
  snapshotted: boolean;
  updatedAt: string;
};

type HostPressure = {
  level: number;
  graceUntilCommand: number;
  lastEvent: string;
  updatedAt: string;
};

type StoredOperation = Omit<PlayOperation, "remainingCommands">;

type StoredReplica = Omit<PlayReplica, "title" | "state">;

type StoredDaemon = Omit<PlayDaemon, "title" | "state">;

type StoredIncident = Omit<PlayIncident, "title">;

type StoredWaypoint = Omit<PlayWaypoint, "title" | "state" | "reason">;

type StoredTrustLink = Omit<PlayTrustLink, "titles" | "state">;

type StoredService = Omit<PlayService, "title" | "state">;

type StoredRunbook = Omit<PlayRunbook, "title" | "state" | "reason">;

type StoredSector = {
  id: string;
  claimedAtCommand: number;
  sweeps: number;
  updatedAtCommand: number;
};

type StoredAccord = {
  completedAtCommand: number;
  score: number;
  summary: string;
};

type StoredPresence = {
  id: string;
  affinity: number;
  state: "idle" | "available" | "helping";
  taskRoom?: PlayRoomId;
  lastSignal: string;
  revealedAtCommand: number;
  updatedAtCommand: number;
};

type StoredAnomaly = {
  id: string;
  state: "active" | "stabilized";
  intensity: number;
  revealedAtCommand: number;
  stabilizedAtCommand?: number;
};

type StoredAnchor = {
  id: string;
  sectorId: string;
  capacity: number;
  heartbeat: number;
  plantedAtCommand: number;
  updatedAtCommand: number;
};

type StoredCircuit = {
  id: string;
  label: string;
  stops: PlayRoomId[];
  uses: number;
  createdAtCommand: number;
  updatedAtCommand: number;
};

type StoredLedger = {
  balance: number;
  earned: number;
  spent: number;
  updatedAtCommand: number;
};

type PresenceDefinition = {
  id: string;
  handle: string;
  title: string;
  room: PlayRoomId;
  reveal: (session: PlaySession) => boolean;
  signal: (session: PlaySession) => string;
};

type AnomalyDefinition = {
  id: string;
  room: PlayRoomId;
  title: string;
  clue: string;
  requirement: string;
  reveal: (session: PlaySession) => boolean;
  canStabilize: (session: PlaySession) => boolean;
};

type StoredBrief = {
  id: string;
  status: "accepted" | "complete";
  acceptedAt: string;
  completedAt?: string;
};

type BriefCheck = {
  label: string;
  test: (session: PlaySession) => boolean;
};

type BriefDefinition = {
  id: string;
  title: string;
  room: PlayRoomId;
  summary: string;
  reward: string;
  checks: BriefCheck[];
  grant: (session: PlaySession) => string[];
};

const MAX_TRANSCRIPT_LINES = 120;
const PAGER_PAGE_SIZE = 6;
const DAEMON_TICK_INTERVAL = 5;
const LINK_TICK_INTERVAL = 7;
const SERVICE_TICK_INTERVAL = 6;

const HELP_LINES = [
  "help / man <cmd> - show commands or a short description",
  "phonebook / pb - list hosts, aliases, and protocols",
  "enter / connect / cd <host> - move to a host",
  "telnet / ssh / rlogin / bbs / ftp / gopher / news / mail <host> - protocol hops",
  "game / irc <host> - extra legacy hops",
  "look / scan / inspect - read the current room",
  "ls / dir [host] - list files on the current or named host",
  "cat / type / more <file> - read a file from the current or named host",
  "board - list the current public board",
  "read / inbox - read board posts or private mail",
  "post / reply / send - write to the board or mailbox",
  "? / help / man - get the command map",
  "login / newuser - enter the shell",
  "hosts / netstat / scores / badges - review the host graph and progress",
  "stty /dumb | /tty - switch shell mode",
  "pager on|off - toggle paging",
  "pager controls: space/j next, b/k back, g top, G bottom, q quit, /term search",
  "porthack / rootkit / root - create a login or claim a host",
  "op <task> / jobs - queue host work across command ticks",
  "audit / patch / firewall / snapshot - harden a rooted host",
  "brace - calm the current lane when pressure builds",
  "basic - enter the BASIC interpreter",
  "call -151 / monitor - enter the low-level monitor",
  "usenet - open the archive reader",
  "zork / zc / zrun - launch Z-Code content",
  "games - show the Z-Code shelf",
  "uupath / uumap / dial - legacy route and dial tools",
  "grep / find <term> - search files and history",
  "trace / traceroute <host> - show the route",
  "notebook / decode / pin - review and work discovered fragments",
  "deploy / sync / replicas - seed and maintain controlled copies",
  "briefs / brief / accept / submit - work durable host briefs",
  "watch / maintain / rotate - inspect and service controlled copies",
  "incidents / triage / restore-node - resolve watched copy faults",
  "mark / marks / jump - save and use proven route waypoints",
  "link / links / rekey - bind warm controlled hosts together",
  "install / services / repair-service - bring controlled host services online",
  "compile / runbooks / runbook - package bounded host upkeep",
  "sectors / sector / claim-sector / sweep-sector - control graph regions",
  "mesh / stabilize - inspect and lock the resilient layer",
  "accord / attune - inspect and close the quiet endgame layer",
  "roster / page / assign - work the quiet contact rail",
  "folds / fold / smooth - inspect and stabilize room anomalies",
  "anchors / anchor / plant-anchor / pulse-anchor - hold claimed regions",
  "circuits / circuit / map-circuit / ride-circuit - save safe route loops",
  "ledger / collect-cache / boost-cache - gather and spend stable capacity",
  "history / today - read the history shelf",
  "uptime / status / who / users / time / date / whoami / pwd / motd / inventory - session state",
  "secure / takeover - seal the current host",
  "whois / finger <name> - look up a host or directory entry",
  "alias / ver - shell shortcuts and build info",
  "echo / say / fortune / run <thing> - ambient shell extras",
  "save / load - session persistence",
  "clear / cls - clear the transcript",
  "camp / tunnel - blocked shortcuts",
  "back - return to the previous room on the stack",
  "solve <phrase> - open the hidden layer",
];

const COMMAND_HELP: Record<string, string> = {
  help: "Show the command list.",
  "?": "Alias for help.",
  man: "Show the command list or a short description.",
  login: "Enter the shell as an existing user.",
  newuser: "Create a new shell user.",
  netstat: "Show the visible host graph and status flags.",
  hosts: "Alias for netstat.",
  scores: "Show badge and progress information.",
  badges: "Alias for scores.",
  stty: "Change the shell mode.",
  pager: "Toggle, report, or advance the pager.",
  wardial: "Discover hidden hosts and number ranges.",
  porthack: "Create a login on an adjacent host.",
  op: "Queue host work across command ticks.",
  jobs: "List queued and completed host work.",
  ops: "Alias for jobs.",
  root: "Claim the current host after logging in.",
  rootkit: "Alias for root.",
  audit: "Review a rooted host before sealing it.",
  patch: "Apply service patches to an audited rooted host.",
  firewall: "Close exposed lanes on a patched rooted host.",
  snapshot: "Take a restore snapshot before sealing a host.",
  restore: "Roll a host back to the latest snapshot state.",
  brace: "Stabilize the current lane and reduce pressure.",
  phonebook: "List the public host directory.",
  pb: "Alias for phonebook.",
  enter: "Move to another host.",
  connect: "Alias for enter.",
  cd: "Alias for enter.",
  basic: "Enter the BASIC interpreter.",
  usenet: "Open the archive reader.",
  games: "Show the games shelf.",
  zork: "Launch the default Z-Code game.",
  zc: "Alias for zork.",
  zrun: "Alias for zork.",
  call: "Enter the low-level monitor with call -151.",
  monitor: "Alias for call -151.",
  uupath: "Show a UUCP-style path.",
  uumap: "Show a UUCP-style map.",
  dial: "Dial a host or number.",
  telnet: "Connect to a host over the simulated telnet lane.",
  ssh: "Connect to a host over the simulated secure lane.",
  rlogin: "Connect to a host over a legacy remote-login lane.",
  bbs: "Connect to the bulletin board layer.",
  ftp: "Connect to the file mirror.",
  gopher: "Connect to the menu tree.",
  news: "Connect to the bulletin wire.",
  mail: "Connect to the quiet inbox.",
  game: "Connect to the games shelf.",
  irc: "Connect to the channel relay.",
  look: "Describe the current room.",
  scan: "Scan for the room's important clue.",
  inspect: "Read the room more closely.",
  ls: "List visible files.",
  dir: "Alias for ls.",
  cat: "Read a file.",
  type: "Alias for cat.",
  more: "Alias for cat.",
  read: "Read board posts or inbox messages.",
  board: "Alias for read on the board rooms.",
  inbox: "Alias for read in the mail room.",
  post: "Write a new public post.",
  reply: "Reply to a public post.",
  send: "Send a private message.",
  grep: "Search files and history for a term.",
  find: "Alias for grep.",
  trace: "Show the route to a host.",
  traceroute: "Alias for trace.",
  notebook: "Review discovered fragments.",
  notes: "Alias for notebook.",
  deploy: "Seed a controlled copy on a sealed host.",
  sync: "Refresh the current host copy and raise its integrity.",
  replicas: "List controlled copies and integrity.",
  copies: "Alias for replicas.",
  briefs: "List durable host briefs.",
  brief: "Read one durable host brief.",
  accept: "Accept a durable host brief.",
  submit: "Submit a ready durable host brief.",
  watch: "Inspect controlled-copy drift.",
  daemons: "Alias for watch.",
  maintain: "Calm drift on a controlled copy.",
  rotate: "Refresh a controlled copy after maintenance.",
  incidents: "List open and recent copy incidents.",
  incident: "Read one copy incident.",
  triage: "Mark an open copy incident as understood.",
  "restore-node": "Restore a triaged copy incident.",
  mark: "Save a proven route as a waypoint.",
  marks: "List saved route waypoints.",
  jump: "Use a safe saved waypoint.",
  link: "Bind the current secured host to another warm secured host through a proven route.",
  links: "List host trust links.",
  rekey: "Refresh a stale or handshake trust link.",
  install: "Bring the current secured host's native service online.",
  services: "List installed host services.",
  service: "Inspect one installed host service.",
  "repair-service": "Refresh an installed host service from its warm copy.",
  compile: "Compile a bounded upkeep runbook from the current online host service.",
  runbooks: "List compiled host runbooks.",
  runbook: "Execute or inspect a host runbook.",
  sectors: "List graph sectors and control readiness.",
  sector: "Inspect one graph sector.",
  "claim-sector": "Claim a sector once enough hosts in it are controlled.",
  "sweep-sector": "Run bounded maintenance across a claimed sector.",
  mesh: "Inspect the resilient layer assembled from secured hosts, copies, briefs, and waypoints.",
  resilience: "Alias for mesh.",
  stabilize: "Lock the resilient layer once enough public-safe signals line up.",
  accord: "Inspect the final calm-state checks assembled from evidence, sectors, services, and mesh health.",
  attune: "Close the final calm-state layer after the backend checks all required signals.",
  roster: "List known quiet contacts and their current host.",
  buddies: "Alias for roster.",
  buddy: "Inspect one quiet contact.",
  page: "Page a known contact from a visible route.",
  assign: "Ask a warmed contact to watch a visible host lane.",
  folds: "List room folds currently visible to the session.",
  fold: "Inspect one visible room fold.",
  smooth: "Stabilize a visible room fold after its room has enough context.",
  anchors: "List planted region anchors.",
  anchor: "Inspect one planted region anchor.",
  "plant-anchor": "Plant an anchor in a claimed sector with stable local support.",
  "pulse-anchor": "Refresh an anchor from its sector support.",
  circuits: "List saved route circuits.",
  circuit: "Inspect one saved route circuit.",
  "map-circuit": "Create a route circuit from proven stops.",
  "ride-circuit": "Traverse a stable circuit with reduced lane pressure.",
  ledger: "Inspect stable capacity collected from proven infrastructure.",
  "collect-cache": "Collect capacity from anchors, circuits, and online services.",
  "boost-cache": "Spend capacity to refresh a visible host.",
  decode: "Decode a discovered fragment.",
  pin: "Pin a discovered fragment.",
  history: "Read the history shelf.",
  today: "Show the current history card.",
  uptime: "Show session uptime.",
  status: "Show a concise status block.",
  who: "List the active simulated operators.",
  users: "Alias for who.",
  time: "Show the in-game time.",
  date: "Alias for time.",
  whoami: "Show the current operator and progress.",
  whois: "Look up a host or directory entry.",
  finger: "Alias for whois.",
  alias: "Show common shortcuts and the current room aliases.",
  ver: "Show the shell version.",
  pwd: "Show the current host path.",
  motd: "Show the current host note.",
  inventory: "Show collected clues.",
  secure: "Seal the current host.",
  takeover: "Alias for secure.",
  echo: "Reflect text back into the shell.",
  say: "Alias for echo.",
  fortune: "Show a short ambient line.",
  run: "Run a shell toy or placeholder program.",
  save: "Report that the session is already persisted.",
  load: "Report that the session is already persisted.",
  clear: "Clear the transcript.",
  cls: "Alias for clear.",
  solve: "Open the hidden layer.",
  back: "Return to the previous room on the stack.",
  camp: "Blocked shortcut: the lane does not allow repeat arrivals to dominate the start.",
  tunnel: "Blocked shortcut: side-channel shortcuts are refused.",
  glitch: "Reveal a glitch event.",
};

const BRIEF_DEFINITIONS: BriefDefinition[] = [
  {
    id: "line-check",
    title: "Line Check",
    room: "phonebook",
    summary: "Prove the first named lane with a recorded route and a local login.",
    reward: "directory mark",
    checks: [
      {
        label: "route to Phonebook recorded",
        test: (session) => Boolean(session.knownRoutes.phonebook),
      },
      {
        label: "Phonebook login present",
        test: (session) => session.loginHosts.includes("phonebook"),
      },
    ],
    grant: (session) => {
      addBadge(session, "brief:line-check");
      return ["Directory mark recorded."];
    },
  },
  {
    id: "shelf-card",
    title: "Shelf Card",
    room: "archive",
    summary: "Turn one archive fragment into worked evidence rather than loose trivia.",
    reward: "question ticker",
    checks: [
      {
        label: "Archive fragment decoded",
        test: (session) =>
          notebookEntries(session).some((entry) => entry.room === "archive" && entry.decoded),
      },
      {
        label: "Archive fragment pinned",
        test: (session) =>
          notebookEntries(session).some((entry) => entry.room === "archive" && entry.pinned),
      },
    ],
    grant: (session) => {
      addDiscovery(session, "qotd");
      addBadge(session, "brief:shelf-card");
      return ["A quiet ticker appears in the directory."];
    },
  },
  {
    id: "warm-copy",
    title: "Warm Copy",
    room: "phonebook",
    summary: "Hold a sealed directory node and keep its copy warm enough to trust.",
    reward: "parser shelf",
    checks: [
      {
        label: "Phonebook sealed",
        test: (session) => session.securedRooms.includes("phonebook"),
      },
      {
        label: "Phonebook copy integrity at least 70%",
        test: (session) => (session.replicas.phonebook?.integrity ?? 0) >= 70,
      },
    ],
    grant: (session) => {
      addDiscovery(session, "zcode");
      addBadge(session, "brief:warm-copy");
      return ["A parser shelf appears in the directory."];
    },
  },
];

const GLITCH_LINES = [
  "A tray icon tears for a frame. The shell says a word it was not asked to say.",
  "The wallpaper ripples, then settles back into the same blue light.",
  "A title bar flickers and leaves a trace of the old desktop name behind.",
  "The pointer stalls. For an instant the lane feels wider than it should.",
];

const SERVICE_KIND_BY_ROOM: Record<PlayRoomId, PlayService["kind"]> = {
  desk: "console",
  archive: "archive",
  phonebook: "resolver",
  bbs: "board",
  ftp: "mirror",
  gopher: "index",
  news: "wire",
  mail: "maildrop",
  games: "arcade",
  lab: "rack",
  irc: "relay",
  qotd: "ticker",
  zcode: "parser",
  relay: "gateway",
  mirror: "warden",
  sysop: "warden",
  vault: "vault",
};

type SectorDefinition = {
  id: string;
  title: string;
  rooms: PlayRoomId[];
  requiredSealed: number;
};

const SECTOR_DEFINITIONS: SectorDefinition[] = [
  {
    id: "foyer",
    title: "Foyer Loop",
    rooms: ["desk", "phonebook", "archive"],
    requiredSealed: 2,
  },
  {
    id: "commons",
    title: "Commons Ring",
    rooms: ["bbs", "mail", "news", "gopher"],
    requiredSealed: 2,
  },
  {
    id: "shelf",
    title: "Shelf Stack",
    rooms: ["ftp", "mirror", "qotd", "zcode"],
    requiredSealed: 2,
  },
  {
    id: "ops",
    title: "Ops Spine",
    rooms: ["lab", "irc", "relay", "sysop"],
    requiredSealed: 2,
  },
];

const DIRECTORY: Record<string, DirectoryEntry> = {
  boden: {
    title: "Boden",
    role: "operator",
    note: "The person behind the session and the one who keeps the calm shell honest.",
  },
  luna: {
    title: "Luna",
    role: "shell name",
    note: "The old name that opens the hidden layer once the archive reveals it.",
  },
  sysop: {
    title: "Sysop",
    role: "warden",
    note: "The host handler who can seal a place only after the route is understood.",
  },
  relay: {
    title: "Relay",
    role: "route node",
    note: "A hop lane that refuses unfair shortcuts and repeat-start pressure.",
  },
  mirror: {
    title: "Mirror",
    role: "integrity node",
    note: "A room that keeps duplicate paths honest.",
  },
  archive: {
    title: "Archive",
    role: "history node",
    note: "The shelf that remembers early-2000s web shape.",
  },
};

const ACTIVE_OPERATORS = [
  "Boden",
  "Nora",
  "Sysop",
  "Relay",
  "Mirror",
  "Archive",
];

const PRESENCE_DEFINITIONS: PresenceDefinition[] = [
  {
    id: "nora",
    handle: "nora",
    title: "Nora",
    room: "bbs",
    reveal: (session) => session.authenticated || session.discoveredRooms.includes("bbs"),
    signal: (session) =>
      session.boards.bbs && session.boards.bbs.length > 0
        ? "keeps the thread index tidy"
        : "idles by the board index",
  },
  {
    id: "luna",
    handle: "luna",
    title: "Luna",
    room: "archive",
    reveal: (session) => session.inventory.includes("luna") || session.solved,
    signal: (session) =>
      notebookEntries(session).some((entry) => entry.decoded)
        ? "waits near the decoded shelf"
        : "is a name in the shelf light",
  },
  {
    id: "mirror",
    handle: "mirror",
    title: "Mirror",
    room: "mirror",
    reveal: (session) => replicaEntries(session).length > 0 || session.discoveredRooms.includes("mirror"),
    signal: (session) =>
      replicaEntries(session).length > 0
        ? "counts copy drift"
        : "watches the duplicate lane",
  },
  {
    id: "relay",
    handle: "relay",
    title: "Relay",
    room: "relay",
    reveal: (session) => waypointEntries(session).length > 0 || session.discoveredRooms.includes("relay"),
    signal: (session) =>
      pressureReport(session).some((entry) => entry.state === "locked")
        ? "listens for locked lanes"
        : "keeps hop rhythm",
  },
  {
    id: "sysop",
    handle: "sysop",
    title: "Sysop",
    room: "sysop",
    reveal: (session) => session.securedRooms.length >= 2 || session.discoveredRooms.includes("sysop"),
    signal: (session) =>
      session.securedRooms.length >= 2
        ? "checks sealed host ledgers"
        : "waits beyond the relay",
  },
];

const ANOMALY_DEFINITIONS: AnomalyDefinition[] = [
  {
    id: "relay-echo",
    room: "relay",
    title: "Relay Echo",
    clue: "Two routes repeat the same hop, but only one leaves a pressure mark.",
    requirement: "record a relay route or calm a locked lane",
    reveal: (session) =>
      pressureReport(session).some((entry) => entry.state === "locked") ||
      Boolean(session.knownRoutes.relay),
    canStabilize: (session) =>
      Boolean(session.knownRoutes.relay) ||
      pressureReport(session).some((entry) => entry.state !== "locked"),
  },
  {
    id: "archive-blue-shift",
    room: "archive",
    title: "Blue Shift",
    clue: "The shelf tint changes after one fragment is read in the old light.",
    requirement: "decode and pin one archive fragment",
    reveal: (session) => session.inventory.includes("luna") || notebookEntries(session).some((entry) => entry.room === "archive"),
    canStabilize: (session) =>
      notebookEntries(session).some((entry) => entry.room === "archive" && entry.decoded && entry.pinned),
  },
  {
    id: "mirror-step",
    room: "mirror",
    title: "Mirror Step",
    clue: "A duplicate line appears one prompt late when copies drift.",
    requirement: "keep one copy warm and quiet its watcher",
    reveal: (session) =>
      replicaEntries(session).some((replica) => replica.integrity < 75) ||
      daemonEntries(session).some((daemon) => daemon.load >= 3),
    canStabilize: (session) =>
      replicaEntries(session).some((replica) => replica.state !== "seeded" && replica.integrity >= 70) &&
      daemonEntries(session).every((daemon) => daemon.load <= 2),
  },
];

const FORTUNES = [
  "The route is the memory.",
  "Calm shells often hide the longest stories.",
  "Every host is easier to trust once it can be named.",
  "The old web liked directories because they could be walked.",
  "A hidden layer is usually just a different way to ask the right question.",
];

type BasicProgram = {
  title: string;
  description: string;
  lines: string[];
  run: string[];
};

const BASIC_PROGRAMS: Record<string, BasicProgram> = {
  "hello.bas": {
    title: "Hello",
    description: "Friendly beginner program.",
    lines: [
      "10 PRINT \"HELLO, WORLD!\"",
      "20 END",
    ],
  run: [
      "HELLO, WORLD!",
      "Classic BASIC keeps the first program small and readable.",
    ],
  },
  "hi-lo.bas": {
    title: "Hi-Lo",
    description: "A quiet number game.",
    lines: [
      "10 PRINT \"GUESS A NUMBER 1-10\"",
      "20 INPUT G",
      "30 PRINT \"CLOSE ENOUGH\"",
    ],
    run: [
      "GUESS A NUMBER 1-10",
      "CLOSE ENOUGH",
    ],
  },
  "advent.bas": {
    title: "Adventure",
    description: "The shell favors exploration.",
    lines: [
      "10 PRINT \"WELCOME TO ADVENTURE\"",
      "20 PRINT \"AT END OF ROAD\"",
      "30 END",
    ],
    run: [
      "WELCOME TO ADVENTURE",
      "AT END OF ROAD",
      "You are standing at the end of a road before a small brick building.",
    ],
  },
  "lunar.bas": {
    title: "Lunar",
    description: "A small landing exercise.",
    lines: [
      "10 PRINT \"FUEL\"",
      "20 PRINT \"THRUST\"",
      "30 END",
    ],
    run: [
      "FUEL",
      "THRUST",
      "The shell keeps the moon gentle.",
    ],
  },
  "tictactoe1.bas": {
    title: "Tic Tac Toe",
    description: "A classic board game loop.",
    lines: [
      "10 PRINT \"X OR O\"",
      "20 END",
    ],
    run: [
      "X OR O",
      "The board is quiet until a move is made.",
    ],
  },
};

type ZCodeGame = {
  title: string;
  description: string;
  output: string[];
};

const ZCODE_GAMES: Record<string, ZCodeGame> = {
  "advent.gam": {
    title: "Adventure",
    description: "A classic parser story.",
    output: [
      "Welcome to Adventure",
      "At End Of Road",
      "You are standing at the end of a road before a small brick building.",
    ],
  },
  "lostpig.gam": {
    title: "Lost Pig",
    description: "A small and calm parser story.",
    output: [
      "Lost Pig",
      "You are in a muddy field.",
      "The parser expects intent, not ornament.",
    ],
  },
  "zork.gam": {
    title: "Zork",
    description: "A big cave and a famous lamp.",
    output: [
      "Zork I",
      "West of House",
      "You are standing in an open field west of a white house.",
    ],
  },
};

const DEFAULT_PROTOCOL_TARGETS: Record<string, PlayRoomId> = {
  telnet: "bbs",
  ssh: "sysop",
  rlogin: "relay",
  bbs: "bbs",
  ftp: "ftp",
  gopher: "gopher",
  news: "news",
  mail: "mail",
  game: "games",
  irc: "irc",
  qotd: "qotd",
  zcode: "zcode",
};

const ADJACENT_HOSTS: Record<PlayRoomId, PlayRoomId[]> = {
  desk: ["archive", "phonebook"],
  archive: ["desk", "phonebook", "relay"],
  phonebook: ["desk", "archive", "bbs", "ftp", "gopher", "news", "mail", "games", "lab", "irc", "qotd"],
  bbs: ["phonebook", "relay"],
  ftp: ["phonebook", "mirror"],
  gopher: ["phonebook", "news"],
  news: ["phonebook", "mail"],
  mail: ["phonebook", "relay", "games"],
  games: ["phonebook", "lab"],
  lab: ["phonebook", "irc", "relay"],
  irc: ["phonebook", "lab"],
  qotd: ["phonebook", "zcode"],
  zcode: ["qotd", "mirror"],
  relay: ["archive", "bbs", "mirror", "sysop", "mail"],
  mirror: ["relay", "sysop"],
  sysop: ["relay", "mirror", "vault"],
  vault: ["sysop"],
};

const HIDDEN_SEED_ROOMS: PlayRoomId[] = ["vault", "qotd", "zcode"];

function isHiddenSeedRoom(roomId: PlayRoomId): boolean {
  return HIDDEN_SEED_ROOMS.includes(roomId);
}

function isVisibleInDirectory(session: PlaySession, roomId: PlayRoomId): boolean {
  if (roomId === "vault") {
    return session.solved;
  }

  return !isHiddenSeedRoom(roomId) || session.discoveredRooms.includes(roomId);
}

const ROOM_LOOKUP = new Map<string, PlayRoomId>();
for (const room of PLAY_HOSTS) {
  ROOM_LOOKUP.set(normalizeText(room.id), room.id);
  ROOM_LOOKUP.set(normalizeText(room.title), room.id);
  for (const alias of room.aliases) {
    ROOM_LOOKUP.set(normalizeText(alias), room.id);
  }
  for (const protocol of room.protocols) {
    ROOM_LOOKUP.set(normalizeText(protocol), room.id);
  }
}

function now() {
  return new Date().toISOString();
}

function secondsSince(isoDate: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000));
}

function line(kind: PlayTranscriptLine["kind"], text: string): PlayTranscriptLine {
  return {
    id: randomUUID(),
    kind,
    text,
    createdAt: now(),
  };
}

function message(
  author: string,
  subject: string,
  body: string,
  createdAt = now(),
): PlayMessage {
  return {
    id: randomUUID(),
    author,
    subject,
    body,
    createdAt,
  };
}

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/["'`.,!?;:()[\]{}]/g, "")
    .replace(/\s+/g, " ");
}

function resolveRoomId(value: string | undefined | null): PlayRoomId | null {
  if (!value) return null;
  const candidate = normalizeText(value);
  return ROOM_LOOKUP.get(candidate) ?? null;
}

function resolveRoomContext(
  value: string | undefined | null,
  fallback: PlayRoomId,
): PlayRoomId {
  return resolveRoomId(value) ?? fallback;
}

function cloneMessages(messages: PlayMessage[]): PlayMessage[] {
  return messages.map((entry) => ({ ...entry }));
}

function getRoomBoard(session: PlaySession, roomId: PlayRoomId): PlayMessage[] {
  const base = getBaseRoom(roomId).board;
  const sessionBoard = session.boards[roomId] ?? [];
  return [...base, ...sessionBoard];
}

function getMailInbox(session: PlaySession): PlayMessage[] {
  return [...getBaseRoom("mail").inbox, ...session.inbox];
}

function visibleFiles(
  room: Pick<PlayRoom, "id" | "files">,
  session: PlaySession,
): PlayFile[] {
  const archiveUnlocked = session.inventory.includes("luna");

  if (room.id === "vault" && !session.solved) {
    return room.files.filter((file) => file.name !== "FUTURE.TXT");
  }

  return room.files.filter(
    (file) => !file.hidden || archiveUnlocked || session.solved,
  );
}

function buildRoom(roomId: PlayRoomId, session: PlaySession): PlayRoom {
  const base = getBaseRoom(roomId);
  const unlocked =
    roomId === "desk" ||
    roomId === "phonebook" ||
    session.discoveredRooms.includes(roomId) ||
    (roomId === "vault" && session.solved);

  const securityState: PlayRoom["securityState"] =
    roomId === "desk"
      ? "braced"
      : session.securedRooms.includes(roomId)
        ? "sealed"
        : session.currentRoom === roomId
          ? "braced"
          : base.securityState;

  const commands =
    roomId === "vault" && !session.solved
      ? ["look", "ls", "cat <file>", "solve <phrase>", "back"]
      : base.commands;

  return {
    ...base,
    unlocked,
    securityState,
    commands,
    files: visibleFiles(base, session),
    board: getRoomBoard(session, roomId),
    inbox: roomId === "mail" ? getMailInbox(session) : [...base.inbox],
  };
}

function buildHosts(session: PlaySession): PlayHost[] {
  return PLAY_HOSTS.filter((host) => isVisibleInDirectory(session, host.id)).map((host) => {
    const secured = session.securedRooms.includes(host.id);
    const logged = session.loginHosts.includes(host.id);
    const rooted = session.rootedRooms.includes(host.id);
    const hardening = session.hardening[host.id];
    const pressure = getPressure(session, host.id);
    return {
      ...host,
      state:
        host.id === "desk"
          ? "secured"
          : secured
            ? "secured"
            : rooted
              ? "rooted"
            : logged
              ? "logged"
            : session.currentRoom === host.id
              ? "braced"
              : "open",
      hardeningState: hardeningState(session, host.id),
      hardeningScore: secured ? 4 : hardeningScore(hardening),
      pressureState: pressureState(pressure.level),
      pressureLevel: pressure.level,
      graceCommands: graceCommands(session, host.id),
    };
  });
}

function hasClue(session: PlaySession, clue: string): boolean {
  return session.inventory.includes(clue);
}

function addClue(session: PlaySession, clue: string): void {
  if (!session.inventory.includes(clue)) {
    session.inventory.push(clue);
  }
}

function addDiscovery(session: PlaySession, roomId: PlayRoomId): void {
  if (!session.discoveredRooms.includes(roomId)) {
    session.discoveredRooms.push(roomId);
  }
}

function addSecure(session: PlaySession, roomId: PlayRoomId): void {
  if (!session.securedRooms.includes(roomId)) {
    session.securedRooms.push(roomId);
  }
}

function addBadge(session: PlaySession, badge: string): void {
  if (!session.badges.includes(badge)) {
    session.badges.push(badge);
  }
}

function addLogin(session: PlaySession, roomId: PlayRoomId): void {
  if (!session.loginHosts.includes(roomId)) {
    session.loginHosts.push(roomId);
  }
}

function hasLogin(session: PlaySession, roomId: PlayRoomId): boolean {
  return session.loginHosts.includes(roomId);
}

function addRoot(session: PlaySession, roomId: PlayRoomId): void {
  if (!session.rootedRooms.includes(roomId)) {
    session.rootedRooms.push(roomId);
  }
}

function hasRoot(session: PlaySession, roomId: PlayRoomId): boolean {
  return session.rootedRooms.includes(roomId);
}

function getHardening(session: PlaySession, roomId: PlayRoomId): HostHardening {
  const existing = session.hardening[roomId];
  if (existing) return existing;

  const created = {
    audited: false,
    patched: false,
    firewalled: false,
    snapshotted: false,
    updatedAt: now(),
  };
  session.hardening[roomId] = created;
  return created;
}

function hardeningScore(entry: HostHardening | undefined): number {
  if (!entry) return 0;
  return [
    entry.audited,
    entry.patched,
    entry.firewalled,
    entry.snapshotted,
  ].filter(Boolean).length;
}

function hardeningState(
  session: PlaySession,
  roomId: PlayRoomId,
): PlayHost["hardeningState"] {
  if (session.securedRooms.includes(roomId)) return "sealed";
  const entry = session.hardening[roomId];
  if (entry?.snapshotted) return "snapshotted";
  if (entry?.firewalled) return "firewalled";
  if (entry?.patched) return "patched";
  if (entry?.audited) return "audited";
  if (session.rootedRooms.includes(roomId)) return "rooted";
  if (session.loginHosts.includes(roomId)) return "foothold";
  return "none";
}

function getPressure(session: PlaySession, roomId: PlayRoomId): HostPressure {
  session.hostPressure ??= {};
  const existing = session.hostPressure[roomId];
  if (existing) return existing;

  const created = {
    level: 0,
    graceUntilCommand: 0,
    lastEvent: "quiet",
    updatedAt: now(),
  };
  session.hostPressure[roomId] = created;
  return created;
}

function pressureState(level: number): PlayPressureReport["state"] {
  if (level >= 5) return "locked";
  if (level >= 3) return "strained";
  if (level >= 1) return "watched";
  return "calm";
}

function graceCommands(session: PlaySession, roomId: PlayRoomId): number {
  return Math.max(0, getPressure(session, roomId).graceUntilCommand - session.commandCount);
}

function adjustPressure(
  session: PlaySession,
  roomId: PlayRoomId,
  delta: number,
  event: string,
): HostPressure {
  const entry = getPressure(session, roomId);
  const sealedOffset = session.securedRooms.includes(roomId) ? -1 : 0;
  entry.level = Math.max(0, Math.min(5, entry.level + delta + sealedOffset));
  entry.lastEvent = event;
  entry.updatedAt = now();
  return entry;
}

function setGrace(session: PlaySession, roomId: PlayRoomId, commands = 2): void {
  const entry = getPressure(session, roomId);
  entry.graceUntilCommand = Math.max(entry.graceUntilCommand, session.commandCount + commands);
  entry.updatedAt = now();
}

function reduceCurrentPressure(
  session: PlaySession,
  amount: number,
  event: string,
): HostPressure {
  return adjustPressure(session, session.currentRoom, -Math.abs(amount), event);
}

function pressureReport(session: PlaySession): PlayPressureReport[] {
  return Object.entries(session.hostPressure ?? {})
    .map(([roomId, entry]) => {
      const room = resolveRoomId(roomId);
      if (!room || !entry || !isVisibleInDirectory(session, room)) return null;
      return {
        room,
        title: getBaseRoom(room).title,
        level: entry.level,
        state: pressureState(entry.level),
        graceCommands: graceCommands(session, room),
        lastEvent: entry.lastEvent,
      };
    })
    .filter((entry): entry is PlayPressureReport => entry !== null)
    .filter((entry) => entry.level > 0 || entry.graceCommands > 0)
    .sort((left, right) => right.level - left.level || left.title.localeCompare(right.title));
}

function currentLaneLocked(session: PlaySession): boolean {
  const pressure = getPressure(session, session.currentRoom);
  return pressureState(pressure.level) === "locked" && graceCommands(session, session.currentRoom) === 0;
}

function notebookId(
  kind: PlayNotebookEntry["kind"],
  roomId: PlayRoomId,
  source: string,
): string {
  const suffix = normalizeText(source)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  return `${kind}:${roomId}:${suffix || "entry"}`;
}

function makeCipher(roomId: PlayRoomId, source: string): string {
  const seed = `${roomId}:${source}`.toUpperCase();
  return Array.from(seed)
    .map((char, index) =>
      ((char.charCodeAt(0) + index * 7) % 36).toString(36).toUpperCase(),
    )
    .join("")
    .slice(0, 18);
}

function addNotebookEntry(
  session: PlaySession,
  entry: Omit<PlayNotebookEntry, "id" | "cipher" | "decoded" | "pinned" | "discoveredAt"> & {
    id?: string;
  },
): PlayNotebookEntry {
  session.notebook ??= {};
  const id = entry.id ?? notebookId(entry.kind, entry.room, entry.source);
  const existing = session.notebook[id];
  if (existing) return existing;

  const created: PlayNotebookEntry = {
    id,
    title: entry.title,
    room: entry.room,
    source: entry.source,
    kind: entry.kind,
    summary: entry.summary,
    cipher: makeCipher(entry.room, entry.source),
    decoded: false,
    pinned: false,
    discoveredAt: now(),
  };
  session.notebook[id] = created;
  return created;
}

function notebookEntries(session: PlaySession): PlayNotebookEntry[] {
  return Object.values(session.notebook ?? {})
    .filter((entry) => isVisibleInDirectory(session, entry.room))
    .map((entry) => ({ ...entry }))
    .sort((left, right) => {
      if (left.pinned !== right.pinned) return left.pinned ? -1 : 1;
      if (left.decoded !== right.decoded) return left.decoded ? -1 : 1;
      return left.discoveredAt.localeCompare(right.discoveredAt);
    });
}

function findNotebookEntry(
  session: PlaySession,
  rawValue: string,
): PlayNotebookEntry | null {
  const needle = normalizeText(rawValue);
  if (!needle) return null;
  return (
    notebookEntries(session).find((entry) => normalizeText(entry.id) === needle) ??
    notebookEntries(session).find((entry) => normalizeText(entry.title).includes(needle)) ??
    notebookEntries(session).find((entry) => normalizeText(entry.source).includes(needle)) ??
    null
  );
}

function captureRoomNote(session: PlaySession, roomId: PlayRoomId, source = "scan"): void {
  const room = getBaseRoom(roomId);
  addNotebookEntry(session, {
    room: roomId,
    kind: "room",
    source,
    title: `${room.title} shape`,
    summary: room.note,
  });
}

function captureFileNote(
  session: PlaySession,
  roomId: PlayRoomId,
  file: PlayFile,
): void {
  addNotebookEntry(session, {
    room: roomId,
    kind: "file",
    source: file.name,
    title: `${getBaseRoom(roomId).title} / ${file.name}`,
    summary: file.summary,
  });
}

function captureHistoryNote(session: PlaySession, card: PlayHistoryCard): void {
  addNotebookEntry(session, {
    room: "archive",
    kind: "history",
    source: card.year,
    title: `${card.year} ${card.title}`,
    summary: card.body,
  });
}

function captureRouteNote(
  session: PlaySession,
  target: PlayRoomId,
  route: PlayRoomId[],
): void {
  addNotebookEntry(session, {
    room: target,
    kind: "route",
    source: route.join(">"),
    title: `Route to ${getBaseRoom(target).title}`,
    summary: route.map((hop) => getBaseRoom(hop).title).join(" -> "),
  });
}

function operationEntries(session: PlaySession): PlayOperation[] {
  return Object.values(session.operations ?? {})
    .map((operation) => ({
      ...operation,
      remainingCommands:
        operation.status === "running"
          ? Math.max(0, operation.completesAtCommand - session.commandCount)
          : 0,
    }))
    .sort((left, right) => {
      if (left.status !== right.status) {
        if (left.status === "running") return -1;
        if (right.status === "running") return 1;
      }
      return left.startedAtCommand - right.startedAtCommand;
    });
}

function operationDuration(action: PlayOperation["action"]): number {
  switch (action) {
    case "porthack":
    case "root":
      return 2;
    case "secure":
      return 2;
    case "audit":
    case "patch":
    case "firewall":
    case "snapshot":
      return 1;
  }
}

function operationLabel(operation: StoredOperation): string {
  return `${operation.action} ${getBaseRoom(operation.target).title}`;
}

function hasRunningOperation(
  session: PlaySession,
  action: PlayOperation["action"],
  target: PlayRoomId,
): boolean {
  return Object.values(session.operations ?? {}).some(
    (operation) =>
      operation.status === "running" &&
      operation.action === action &&
      operation.target === target,
  );
}

function completeOperation(session: PlaySession, operation: StoredOperation): string {
  const title = getBaseRoom(operation.target).title;
  switch (operation.action) {
    case "porthack":
      addLogin(session, operation.target);
      adjustPressure(session, operation.target, 1, "queued login");
      addBadge(session, `op:login:${operation.target}`);
      return `Operation complete: login created on ${title}.`;
    case "root":
      if (!hasLogin(session, operation.target)) {
        operation.status = "failed";
        return `Operation failed: no login on ${title}.`;
      }
      addRoot(session, operation.target);
      addBadge(session, `op:root:${operation.target}`);
      return `Operation complete: ${title} rooted.`;
    case "audit": {
      if (!hasRoot(session, operation.target)) {
        operation.status = "failed";
        return `Operation failed: ${title} is not rooted.`;
      }
      const entry = getHardening(session, operation.target);
      entry.audited = true;
      entry.updatedAt = now();
      addBadge(session, `op:audit:${operation.target}`);
      return `Operation complete: ${title} audited.`;
    }
    case "patch": {
      const entry = getHardening(session, operation.target);
      if (!entry.audited) {
        operation.status = "failed";
        return `Operation failed: ${title} needs audit first.`;
      }
      entry.patched = true;
      entry.updatedAt = now();
      addBadge(session, `op:patch:${operation.target}`);
      return `Operation complete: ${title} patched.`;
    }
    case "firewall": {
      const entry = getHardening(session, operation.target);
      if (!entry.patched) {
        operation.status = "failed";
        return `Operation failed: ${title} needs patch first.`;
      }
      entry.firewalled = true;
      entry.updatedAt = now();
      adjustPressure(session, operation.target, -2, "queued firewall");
      addBadge(session, `op:firewall:${operation.target}`);
      return `Operation complete: ${title} firewall loaded.`;
    }
    case "snapshot": {
      const entry = getHardening(session, operation.target);
      if (!entry.firewalled) {
        operation.status = "failed";
        return `Operation failed: ${title} needs firewall first.`;
      }
      entry.snapshotted = true;
      entry.updatedAt = now();
      adjustPressure(session, operation.target, -2, "queued snapshot");
      addBadge(session, `op:snapshot:${operation.target}`);
      return `Operation complete: ${title} snapshot written.`;
    }
    case "secure": {
      const entry = getHardening(session, operation.target);
      if (!entry.audited || !entry.patched || !entry.firewalled || !entry.snapshotted) {
        operation.status = "failed";
        return `Operation failed: ${title} is not ready to seal.`;
      }
      addSecure(session, operation.target);
      adjustPressure(session, operation.target, -5, "queued seal");
      addBadge(session, `op:seal:${operation.target}`);
      return `Operation complete: ${title} sealed.`;
    }
  }
}

function tickOperations(session: PlaySession): string[] {
  const lines: string[] = [];
  for (const operation of Object.values(session.operations ?? {})) {
    if (operation.status !== "running") continue;
    if (operation.completesAtCommand > session.commandCount) continue;

    operation.status = "complete";
    operation.result = completeOperation(session, operation);
    lines.push(operation.result);
  }
  return lines;
}

function enqueueOperation(
  session: PlaySession,
  action: PlayOperation["action"],
  target: PlayRoomId,
): StoredOperation {
  session.operations ??= {};
  const duration = operationDuration(action);
  const id = `op:${action}:${target}:${session.commandCount}:${Object.keys(session.operations).length}`;
  const operation: StoredOperation = {
    id,
    action,
    target,
    origin: session.currentRoom,
    status: "running",
    startedAtCommand: session.commandCount,
    completesAtCommand: session.commandCount + duration,
    result: `Running ${action} on ${getBaseRoom(target).title}.`,
  };
  session.operations[id] = operation;
  return operation;
}

function handleJobs(session: PlaySession): string[] {
  const operations = operationEntries(session);
  if (operations.length === 0) {
    return ["No operations queued."];
  }

  return [
    `Operations: ${operations.length}`,
    ...operations.map((operation) => {
      const timing =
        operation.status === "running"
          ? `${operation.remainingCommands} ticks`
          : operation.status;
      return `${operation.id} | ${operationLabel(operation)} | ${timing} | ${operation.result}`;
    }),
  ];
}

function replicaState(integrity: number): PlayReplica["state"] {
  if (integrity >= 80) return "stable";
  if (integrity >= 45) return "warm";
  return "seeded";
}

function replicaLevel(integrity: number): number {
  if (integrity >= 90) return 4;
  if (integrity >= 70) return 3;
  if (integrity >= 40) return 2;
  return 1;
}

function replicaEntries(session: PlaySession): PlayReplica[] {
  return Object.values(session.replicas ?? {})
    .filter((entry): entry is StoredReplica => Boolean(entry))
    .filter((entry) => isVisibleInDirectory(session, entry.room))
    .map((entry) => ({
      ...entry,
      title: getBaseRoom(entry.room).title,
      state: replicaState(entry.integrity),
    }))
    .sort((left, right) => right.integrity - left.integrity || left.title.localeCompare(right.title));
}

function daemonState(load: number): PlayDaemon["state"] {
  if (load >= 5) return "fault";
  if (load >= 3) return "noisy";
  if (load >= 1) return "warm";
  return "quiet";
}

function ensureDaemon(session: PlaySession, roomId: PlayRoomId): StoredDaemon {
  session.daemons ??= {};
  const existing = session.daemons[roomId];
  if (existing) return existing;

  const created: StoredDaemon = {
    room: roomId,
    load: 0,
    lastTickCommand: session.commandCount,
    updatedAt: now(),
  };
  session.daemons[roomId] = created;
  return created;
}

function daemonEntries(session: PlaySession): PlayDaemon[] {
  return Object.values(session.daemons ?? {})
    .filter((entry): entry is StoredDaemon => Boolean(entry))
    .filter((entry) => Boolean(session.replicas?.[entry.room]))
    .filter((entry) => isVisibleInDirectory(session, entry.room))
    .map((entry) => ({
      ...entry,
      title: getBaseRoom(entry.room).title,
      state: daemonState(entry.load),
    }))
    .sort((left, right) => right.load - left.load || left.title.localeCompare(right.title));
}

function incidentId(roomId: PlayRoomId): string {
  return `incident:${roomId}`;
}

function incidentEntries(session: PlaySession): PlayIncident[] {
  return Object.values(session.incidents ?? {})
    .filter((entry): entry is StoredIncident => Boolean(entry))
    .filter((entry) => isVisibleInDirectory(session, entry.room))
    .map((entry) => ({
      ...entry,
      title: getBaseRoom(entry.room).title,
    }))
    .sort((left, right) => {
      const rank = { open: 0, triaged: 1, restored: 2 } as const;
      return rank[left.status] - rank[right.status] || right.openedAtCommand - left.openedAtCommand;
    });
}

function openIncident(session: PlaySession, roomId: PlayRoomId, severity: PlayIncident["severity"]): string | null {
  session.incidents ??= {};
  const id = incidentId(roomId);
  const existing = session.incidents[id];
  if (existing && existing.status !== "restored") return null;

  session.incidents[id] = {
    id,
    room: roomId,
    severity,
    status: "open",
    summary:
      severity === "fault"
        ? "A controlled copy has drifted past the safe window."
        : "A controlled copy needs attention before it becomes noisy.",
    openedAtCommand: session.commandCount,
    updatedAt: now(),
  };
  addBadge(session, `incident:${roomId}`);
  return `${getBaseRoom(roomId).title} opened an incident.`;
}

function tickDaemons(session: PlaySession): string[] {
  const lines: string[] = [];
  for (const replica of Object.values(session.replicas ?? {})) {
    if (!replica) continue;
    const daemon = ensureDaemon(session, replica.room);
    if (session.commandCount - daemon.lastTickCommand < DAEMON_TICK_INTERVAL) continue;

    const ticks = Math.floor((session.commandCount - daemon.lastTickCommand) / DAEMON_TICK_INTERVAL);
    daemon.load = Math.min(6, daemon.load + ticks);
    daemon.lastTickCommand += ticks * DAEMON_TICK_INTERVAL;
    daemon.updatedAt = now();

    if (daemon.load >= 3) {
      const before = replica.integrity;
      replica.integrity = Math.max(1, replica.integrity - Math.min(12, daemon.load * 2));
      replica.level = replicaLevel(replica.integrity);
      replica.updatedAt = now();
      if (replica.integrity < before) {
        lines.push(`${getBaseRoom(replica.room).title} copy drifted to ${replica.integrity}%.`);
      }
    }

    if (daemon.load >= 5) {
      const incident = openIncident(session, replica.room, "fault");
      if (incident) lines.push(incident);
    }
  }
  return lines;
}

function replicaSyncGain(session: PlaySession): number {
  const decoded = notebookEntries(session).filter((entry) => entry.decoded).length;
  const pinned = notebookEntries(session).filter((entry) => entry.pinned).length;
  const routes = Object.keys(session.knownRoutes ?? {}).length;
  return Math.min(28, 12 + decoded * 2 + pinned * 3 + Math.floor(routes / 2));
}

function handleDeploy(session: PlaySession): string[] {
  const roomId = session.currentRoom;
  const title = getBaseRoom(roomId).title;

  if (roomId !== "desk" && !session.securedRooms.includes(roomId)) {
    return [`${title} needs a sealed lane before it can hold a copy.`];
  }

  session.replicas ??= {};
  const existing = session.replicas[roomId];
  if (existing) {
    return [
      `${title} already holds a level ${existing.level} copy.`,
      `Integrity ${existing.integrity}%. Use sync to refresh it.`,
    ];
  }

  const integrity = roomId === "desk" ? 55 : 35 + Math.min(25, hardeningScore(session.hardening[roomId]) * 6);
  const created: StoredReplica = {
    room: roomId,
    level: replicaLevel(integrity),
    integrity,
    lastSyncCommand: session.commandCount,
    updatedAt: now(),
  };
  session.replicas[roomId] = created;
  ensureDaemon(session, roomId);
  addBadge(session, `copy:${roomId}`);

  return [
    `Seeded ${title}.`,
    `Copy level ${created.level}; integrity ${created.integrity}%.`,
    "Run sync when the room has learned more.",
  ];
}

function handleSync(session: PlaySession): string[] {
  const roomId = session.currentRoom;
  const title = getBaseRoom(roomId).title;
  const replica = session.replicas?.[roomId];

  if (!replica) {
    return [`No copy is seeded on ${title}.`];
  }

  const before = replica.integrity;
  const gain = replicaSyncGain(session);
  replica.integrity = Math.min(100, replica.integrity + gain);
  replica.level = replicaLevel(replica.integrity);
  replica.lastSyncCommand = session.commandCount;
  replica.updatedAt = now();
  const daemon = ensureDaemon(session, roomId);
  daemon.load = Math.max(0, daemon.load - 1);
  daemon.updatedAt = now();

  if (replica.integrity >= 80) {
    addBadge(session, `stable:${roomId}`);
  }

  return [
    `${title} sync complete.`,
    `Integrity ${before}% -> ${replica.integrity}% (+${replica.integrity - before}).`,
    `Copy level ${replica.level}; state ${replicaState(replica.integrity)}.`,
  ];
}

function handleReplicas(session: PlaySession): string[] {
  const replicas = replicaEntries(session);
  if (replicas.length === 0) {
    return ["No copies seeded."];
  }

  const average = Math.round(
    replicas.reduce((total, replica) => total + replica.integrity, 0) / replicas.length,
  );
  return [
    `Copies: ${replicas.length}; average integrity ${average}%.`,
    ...replicas.map(
      (replica) =>
        `${replica.title}: level ${replica.level}, ${replica.integrity}%, ${replica.state}, last sync ${replica.lastSyncCommand}`,
    ),
  ];
}

function resolveControlledRoom(session: PlaySession, rawValue: string): PlayRoomId {
  return resolveRoomId(rawValue) ?? session.currentRoom;
}

function handleWatch(session: PlaySession): string[] {
  const daemons = daemonEntries(session);
  if (daemons.length === 0) {
    return ["No controlled copies are being watched."];
  }

  return [
    `Watch: ${daemons.length} controlled ${daemons.length === 1 ? "copy" : "copies"}.`,
    ...daemons.map(
      (daemon) =>
        `${daemon.title}: ${daemon.state}, load ${daemon.load}/6, last tick ${daemon.lastTickCommand}`,
    ),
  ];
}

function handleMaintain(session: PlaySession, rawValue: string): string[] {
  const roomId = resolveControlledRoom(session, rawValue);
  const replica = session.replicas?.[roomId];
  if (!replica) {
    return [`No controlled copy on ${getBaseRoom(roomId).title}.`];
  }

  const daemon = ensureDaemon(session, roomId);
  const before = daemon.load;
  daemon.load = Math.max(0, daemon.load - 2);
  daemon.updatedAt = now();
  adjustPressure(session, roomId, -1, "maintenance");

  return [
    `${getBaseRoom(roomId).title} maintenance complete.`,
    `Load ${before}/6 -> ${daemon.load}/6; state ${daemonState(daemon.load)}.`,
  ];
}

function handleRotate(session: PlaySession, rawValue: string): string[] {
  const roomId = resolveControlledRoom(session, rawValue);
  const replica = session.replicas?.[roomId];
  if (!replica) {
    return [`No controlled copy on ${getBaseRoom(roomId).title}.`];
  }

  const daemon = ensureDaemon(session, roomId);
  if (daemon.load > 2) {
    return [`${getBaseRoom(roomId).title} is too noisy. Run maintain first.`];
  }

  const open = session.incidents?.[incidentId(roomId)];
  if (open && open.status !== "restored") {
    return [`${getBaseRoom(roomId).title} has an unresolved incident.`];
  }

  const before = replica.integrity;
  replica.integrity = Math.min(100, replica.integrity + 6);
  replica.level = replicaLevel(replica.integrity);
  replica.updatedAt = now();
  daemon.load = 0;
  daemon.lastTickCommand = session.commandCount;
  daemon.updatedAt = now();

  return [
    `${getBaseRoom(roomId).title} rotation complete.`,
    `Integrity ${before}% -> ${replica.integrity}%; load reset.`,
  ];
}

function handleIncidents(session: PlaySession): string[] {
  const incidents = incidentEntries(session);
  if (incidents.length === 0) {
    return ["No incidents recorded."];
  }

  return [
    `Incidents: ${incidents.filter((incident) => incident.status !== "restored").length} active, ${incidents.filter((incident) => incident.status === "restored").length} restored.`,
    ...incidents.map(
      (incident) =>
        `${incident.id} | ${incident.title} | ${incident.severity} | ${incident.status} | opened ${incident.openedAtCommand}`,
    ),
  ];
}

function findIncident(session: PlaySession, rawValue: string): StoredIncident | null {
  const roomId = resolveRoomId(rawValue);
  const needle = normalizeText(rawValue);
  return (
    (roomId ? session.incidents?.[incidentId(roomId)] : null) ??
    Object.values(session.incidents ?? {}).find((incident) => normalizeText(incident.id) === needle) ??
    Object.values(session.incidents ?? {}).find((incident) => normalizeText(getBaseRoom(incident.room).title).includes(needle)) ??
    null
  );
}

function handleIncident(session: PlaySession, rawValue: string): string[] {
  const incident = findIncident(session, rawValue);
  if (!incident) {
    return ["Usage: incident <host-or-id>."];
  }

  return [
    `${getBaseRoom(incident.room).title} incident`,
    `Status: ${incident.status}`,
    `Severity: ${incident.severity}`,
    incident.summary,
    `Opened at command ${incident.openedAtCommand}.`,
  ];
}

function handleTriage(session: PlaySession, rawValue: string): string[] {
  const incident = findIncident(session, rawValue);
  if (!incident) {
    return ["Usage: triage <host-or-id>."];
  }

  if (incident.status === "restored") {
    return [`${getBaseRoom(incident.room).title} is already restored.`];
  }

  incident.status = "triaged";
  incident.updatedAt = now();
  const daemon = ensureDaemon(session, incident.room);
  daemon.load = Math.max(0, daemon.load - 1);
  daemon.updatedAt = now();
  return [
    `${getBaseRoom(incident.room).title} incident triaged.`,
    `Load now ${daemon.load}/6.`,
  ];
}

function handleRestoreNode(session: PlaySession, rawValue: string): string[] {
  const incident = findIncident(session, rawValue);
  if (!incident) {
    return ["Usage: restore-node <host-or-id>."];
  }

  if (incident.status === "open") {
    return [`Triage ${getBaseRoom(incident.room).title} before restore.`];
  }

  if (incident.status === "restored") {
    return [`${getBaseRoom(incident.room).title} is already restored.`];
  }

  const replica = session.replicas?.[incident.room];
  const daemon = ensureDaemon(session, incident.room);
  if (replica) {
    replica.integrity = Math.min(100, replica.integrity + 10);
    replica.level = replicaLevel(replica.integrity);
    replica.updatedAt = now();
  }
  daemon.load = 0;
  daemon.lastTickCommand = session.commandCount;
  daemon.updatedAt = now();
  incident.status = "restored";
  incident.updatedAt = now();
  addBadge(session, `restored:${incident.room}`);

  return [
    `${getBaseRoom(incident.room).title} restored.`,
    replica ? `Integrity now ${replica.integrity}%.` : "No copy was present.",
  ];
}

function briefDefinition(rawValue: string): BriefDefinition | null {
  const needle = normalizeText(rawValue);
  if (!needle) return null;
  return (
    BRIEF_DEFINITIONS.find((brief) => normalizeText(brief.id) === needle) ??
    BRIEF_DEFINITIONS.find((brief) => normalizeText(brief.title).includes(needle)) ??
    null
  );
}

function briefEntries(session: PlaySession): PlayBrief[] {
  return BRIEF_DEFINITIONS.map((definition) => {
    const stored = session.briefs?.[definition.id];
    const progress = definition.checks.map((check) =>
      `${check.test(session) ? "[x]" : "[ ]"} ${check.label}`,
    );
    const ready = definition.checks.every((check) => check.test(session));
    return {
      id: definition.id,
      title: definition.title,
      room: definition.room,
      summary: definition.summary,
      reward: definition.reward,
      status: stored?.status ?? "available",
      progress,
      ready,
      acceptedAt: stored?.acceptedAt,
      completedAt: stored?.completedAt,
    };
  }).sort((left, right) => {
    const rank = { accepted: 0, available: 1, complete: 2 } as const;
    return rank[left.status] - rank[right.status] || left.title.localeCompare(right.title);
  });
}

function handleBriefs(session: PlaySession): string[] {
  const briefs = briefEntries(session);
  return [
    `Briefs: ${briefs.filter((brief) => brief.status !== "complete").length} open, ${briefs.filter((brief) => brief.status === "complete").length} complete.`,
    ...briefs.map((brief) => {
      const marker = brief.ready && brief.status !== "complete" ? "ready" : brief.status;
      return `${brief.id} | ${brief.title} | ${marker} | ${getBaseRoom(brief.room).title}`;
    }),
  ];
}

function handleBrief(session: PlaySession, rawValue: string): string[] {
  const definition = briefDefinition(rawValue);
  if (!definition) {
    return ["Usage: brief <id>."];
  }

  const entry = briefEntries(session).find((brief) => brief.id === definition.id)!;
  return [
    `${entry.title} (${entry.id})`,
    entry.summary,
    `Room: ${getBaseRoom(entry.room).title}`,
    `Status: ${entry.status}${entry.ready && entry.status !== "complete" ? " / ready" : ""}`,
    `Reward: ${entry.reward}`,
    ...entry.progress,
  ];
}

function handleAcceptBrief(session: PlaySession, rawValue: string): string[] {
  const definition = briefDefinition(rawValue);
  if (!definition) {
    return ["Usage: accept <brief-id>."];
  }

  session.briefs ??= {};
  const stored = session.briefs[definition.id];
  if (stored?.status === "complete") {
    return [`${definition.title} is already complete.`];
  }

  if (stored) {
    return [`${definition.title} is already accepted.`];
  }

  session.briefs[definition.id] = {
    id: definition.id,
    status: "accepted",
    acceptedAt: now(),
  };
  return [`Accepted ${definition.title}.`, `Use brief ${definition.id} to inspect it.`];
}

function handleSubmitBrief(session: PlaySession, rawValue: string): string[] {
  const definition = briefDefinition(rawValue);
  if (!definition) {
    return ["Usage: submit <brief-id>."];
  }

  const stored = session.briefs?.[definition.id];
  if (!stored) {
    return [`Accept ${definition.id} before submitting it.`];
  }

  if (stored.status === "complete") {
    return [`${definition.title} is already complete.`];
  }

  const missing = definition.checks.filter((check) => !check.test(session));
  if (missing.length > 0) {
    return [
      `${definition.title} is not ready.`,
      ...missing.map((check) => `[ ] ${check.label}`),
    ];
  }

  stored.status = "complete";
  stored.completedAt = now();
  const rewards = definition.grant(session);
  return [
    `${definition.title} complete.`,
    ...rewards,
  ];
}

function handleOperation(session: PlaySession, rawValue: string): string[] {
  const [actionRaw, ...rest] = rawValue.trim().split(/\s+/);
  const normalized = normalizeText(actionRaw ?? "");
  const action =
    normalized === "seal" || normalized === "secure"
      ? "secure"
      : normalized === "login"
        ? "porthack"
        : normalized;

  if (
    action !== "porthack" &&
    action !== "root" &&
    action !== "audit" &&
    action !== "patch" &&
    action !== "firewall" &&
    action !== "snapshot" &&
    action !== "secure"
  ) {
    return ["Usage: op porthack <host> | op root | op audit | op patch | op firewall | op snapshot | op secure."];
  }

  const target =
    action === "porthack"
      ? resolveRoomId(rest.join(" "))
      : resolveRoomId(rest.join(" ")) ?? session.currentRoom;

  if (!target) {
    return ["Usage: op porthack <adjacent-host>."];
  }

  if (action === "porthack" && !session.authenticated) {
    adjustPressure(session, session.currentRoom, 1, "queued login denied");
    return ["Login first. Operations run from the shell prompt."];
  }

  if (action === "porthack" && !isAdjacentHost(session.currentRoom, target)) {
    adjustPressure(session, session.currentRoom, 2, "queued remote login refused");
    return [`${getBaseRoom(target).title} is not adjacent to ${getBaseRoom(session.currentRoom).title}.`];
  }

  if (action !== "porthack" && target !== session.currentRoom) {
    return ["Queued host work targets the current room unless it is a porthack."];
  }

  if (hasRunningOperation(session, action, target)) {
    return [`Operation already running: ${action} ${getBaseRoom(target).title}.`];
  }

  const operation = enqueueOperation(session, action, target);
  return [
    `Queued ${operationLabel(operation)}.`,
    `Completes in ${operationDuration(action)} command ticks.`,
    operation.id,
  ];
}

function requireRootedHost(session: PlaySession): string[] | null {
  if (session.currentRoom === "desk") {
    return ["The desktop is already local. Use a host room for hardening."];
  }

  if (!hasRoot(session, session.currentRoom)) {
    return ["Root the current host before changing its hardening state."];
  }

  return null;
}

function isAdjacentHost(from: PlayRoomId, to: PlayRoomId): boolean {
  return ADJACENT_HOSTS[from].includes(to);
}

function findVisibleRoute(
  session: PlaySession,
  from: PlayRoomId,
  to: PlayRoomId,
): PlayRoomId[] | null {
  if (from === to) return [from];

  const queue: PlayRoomId[][] = [[from]];
  const visited = new Set<PlayRoomId>([from]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1]!;

    for (const next of ADJACENT_HOSTS[current]) {
      if (visited.has(next)) continue;
      if (next !== to && !isVisibleInDirectory(session, next)) continue;

      const nextPath = [...path, next];
      if (next === to) return nextPath;

      visited.add(next);
      queue.push(nextPath);
    }
  }

  return null;
}

function rememberRoute(
  session: PlaySession,
  target: PlayRoomId,
  route: PlayRoomId[],
): void {
  if (route.length > 1) {
    session.knownRoutes ??= {};
    session.knownRoutes[target] = route;
  }
}

function buildKnownRoutes(session: PlaySession): PlayKnownRoute[] {
  return Object.entries(session.knownRoutes ?? {})
    .map(([target, hops]) => {
      const roomId = resolveRoomId(target);
      if (!roomId || !hops || !isVisibleInDirectory(session, roomId)) {
        return null;
      }

      return {
        target: roomId,
        title: getBaseRoom(roomId).title,
        hops: [...hops],
      };
    })
    .filter((route): route is PlayKnownRoute => route !== null)
    .sort((left, right) => left.title.localeCompare(right.title));
}

function waypointState(
  session: PlaySession,
  roomId: PlayRoomId,
): Pick<PlayWaypoint, "state" | "reason"> {
  if (!isVisibleInDirectory(session, roomId)) {
    return { state: "blocked", reason: "not visible" };
  }

  const incident = session.incidents?.[incidentId(roomId)];
  if (incident && incident.status !== "restored") {
    return { state: "blocked", reason: "incident" };
  }

  const daemon = session.daemons?.[roomId];
  if (daemon && daemon.load > 2) {
    return { state: "blocked", reason: "watch noisy" };
  }

  if (currentLaneLocked(session)) {
    return { state: "blocked", reason: "current lane locked" };
  }

  return { state: "ready", reason: "ready" };
}

function waypointEntries(session: PlaySession): PlayWaypoint[] {
  return Object.values(session.waypoints ?? {})
    .filter((entry): entry is StoredWaypoint => Boolean(entry))
    .filter((entry) => isVisibleInDirectory(session, entry.room))
    .map((entry) => ({
      ...entry,
      title: getBaseRoom(entry.room).title,
      ...waypointState(session, entry.room),
    }))
    .sort((left, right) => {
      if (left.state !== right.state) return left.state === "ready" ? -1 : 1;
      return left.title.localeCompare(right.title);
    });
}

function handleMark(session: PlaySession, rawValue: string): string[] {
  const roomId = resolveRoomId(rawValue) ?? session.currentRoom;
  const route = session.knownRoutes?.[roomId];
  if (!route || route.length < 2) {
    return [`No proven route to ${getBaseRoom(roomId).title}.`];
  }

  if (!isVisibleInDirectory(session, roomId)) {
    return ["That host is not in the public map yet."];
  }

  session.waypoints ??= {};
  session.waypoints[roomId] = {
    room: roomId,
    hops: [...route],
    addedAtCommand: session.commandCount,
  };
  addBadge(session, `mark:${roomId}`);
  return [
    `Marked ${getBaseRoom(roomId).title}.`,
    route.map((hop) => getBaseRoom(hop).title).join(" -> "),
  ];
}

function handleMarks(session: PlaySession): string[] {
  const waypoints = waypointEntries(session);
  if (waypoints.length === 0) {
    return ["No waypoints marked."];
  }

  return [
    `Waypoints: ${waypoints.length}`,
    ...waypoints.map(
      (waypoint) =>
        `${waypoint.title}: ${waypoint.state}, ${waypoint.reason}, ${waypoint.hops.map((hop) => hop.toUpperCase()).join(">")}`,
    ),
  ];
}

function handleJump(session: PlaySession, rawValue: string): string[] {
  const roomId = resolveRoomId(rawValue);
  if (!roomId) {
    return ["Usage: jump <marked-host>."];
  }

  const waypoint = session.waypoints?.[roomId];
  if (!waypoint) {
    return [`No waypoint marked for ${getBaseRoom(roomId).title}.`];
  }

  const state = waypointState(session, roomId);
  if (state.state !== "ready") {
    return [`${getBaseRoom(roomId).title} waypoint blocked: ${state.reason}.`];
  }

  const origin = session.currentRoom;
  pushRoom(session, roomId);
  clearPager(session);
  addDiscovery(session, roomId);
  adjustPressure(session, origin, 1, "waypoint jump");
  return [
    `Jumped to ${getBaseRoom(roomId).title}.`,
    waypoint.hops.map((hop) => getBaseRoom(hop).title).join(" -> "),
  ];
}

function circuitId(label: string): string {
  return `circuit:${normalizeText(label).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "route"}`;
}

function circuitState(
  session: PlaySession,
  circuit: Pick<StoredCircuit, "stops">,
): Pick<PlayCircuit, "state" | "quality" | "reason"> {
  if (circuit.stops.length < 2) {
    return { state: "broken", quality: 0, reason: "needs two stops" };
  }

  const hidden = circuit.stops.find((stop) => !isVisibleInDirectory(session, stop));
  if (hidden) return { state: "broken", quality: 0, reason: `${getBaseRoom(hidden).title} hidden` };

  const missingRoute = circuit.stops.find((stop) => stop !== session.currentRoom && !session.knownRoutes?.[stop]);
  if (missingRoute) return { state: "draft", quality: 25, reason: `${getBaseRoom(missingRoute).title} route not proven` };

  const blocked = circuit.stops.find((stop) => waypointState(session, stop).state !== "ready");
  if (blocked) return { state: "broken", quality: 25, reason: `${getBaseRoom(blocked).title} ${waypointState(session, blocked).reason}` };

  const stableStops = circuit.stops.filter((stop) => session.securedRooms.includes(stop)).length;
  const markedStops = circuit.stops.filter((stop) => Boolean(session.waypoints?.[stop])).length;
  const quality = Math.min(100, 45 + stableStops * 15 + markedStops * 10 + Math.max(0, circuit.stops.length - 2) * 5);
  return { state: quality >= 65 ? "stable" : "draft", quality, reason: quality >= 65 ? "stable" : "needs marks or sealed stops" };
}

function circuitEntries(session: PlaySession): PlayCircuit[] {
  return Object.values(session.circuits ?? {})
    .filter((entry): entry is StoredCircuit => Boolean(entry))
    .map((entry) => ({
      ...entry,
      titles: entry.stops.map((stop) => getBaseRoom(stop).title),
      ...circuitState(session, entry),
    }))
    .sort((left, right) => {
      const rank = { stable: 0, draft: 1, broken: 2 } as const;
      return rank[left.state] - rank[right.state] || right.quality - left.quality || left.label.localeCompare(right.label);
    });
}

function findCircuit(session: PlaySession, rawValue: string): StoredCircuit | null {
  const needle = normalizeText(rawValue);
  if (!needle) return null;
  return (
    Object.values(session.circuits ?? {}).find((entry) => normalizeText(entry.id) === needle) ??
    Object.values(session.circuits ?? {}).find((entry) => normalizeText(entry.label).includes(needle)) ??
    null
  );
}

function parseCircuitStops(rawValue: string): { label: string; stops: PlayRoomId[] } | null {
  const separator = rawValue.indexOf(":");
  const labelPart = separator >= 0 ? rawValue.slice(0, separator) : "route";
  const stopsPart = separator >= 0 ? rawValue.slice(separator + 1) : rawValue;
  const stops = (stopsPart ?? "")
    .split(/[>,]+|\s+to\s+|\s+/i)
    .map((part) => resolveRoomId(part))
    .filter((roomId): roomId is PlayRoomId => Boolean(roomId));
  if (stops.length < 2) return null;
  return { label: labelPart.trim() || stops.map((stop) => getBaseRoom(stop).title).join("-"), stops };
}

function handleCircuits(session: PlaySession): string[] {
  const entries = circuitEntries(session);
  if (entries.length === 0) return ["No circuits mapped."];
  return [
    `Circuits: ${entries.filter((entry) => entry.state === "stable").length}/${entries.length} stable.`,
    ...entries.map((entry) => `${entry.id} | ${entry.state} | ${entry.quality}% | ${entry.titles.join(" > ")} | uses ${entry.uses}`),
  ];
}

function handleCircuit(session: PlaySession, rawValue: string): string[] {
  const circuit = findCircuit(session, rawValue);
  if (!circuit) return ["Usage: circuit <label>."];
  const entry = circuitEntries(session).find((candidate) => candidate.id === circuit.id);
  if (!entry) return ["Circuit slipped out of range."];
  return [
    `${entry.label} (${entry.id})`,
    `State: ${entry.state}`,
    `Quality: ${entry.quality}%`,
    `Reason: ${entry.reason}`,
    `Stops: ${entry.titles.join(" -> ")}`,
    `Uses: ${entry.uses}`,
  ];
}

function handleMapCircuit(session: PlaySession, rawValue: string): string[] {
  const parsed = parseCircuitStops(rawValue);
  if (!parsed) return ["Usage: map-circuit <label>: <host> <host> [host]."];
  const uniqueStops = new Set(parsed.stops);
  if (uniqueStops.size !== parsed.stops.length) return ["Circuit stops must not repeat."];
  const hidden = parsed.stops.find((stop) => !isVisibleInDirectory(session, stop));
  if (hidden) return [`${getBaseRoom(hidden).title} is not visible enough to map.`];
  const missing = parsed.stops.find((stop) => stop !== session.currentRoom && !session.knownRoutes?.[stop]);
  if (missing) return [`Trace ${getBaseRoom(missing).title} before mapping this circuit.`];

  const id = circuitId(parsed.label);
  session.circuits ??= {};
  const existing = session.circuits[id];
  session.circuits[id] = {
    id,
    label: parsed.label,
    stops: parsed.stops,
    uses: existing?.uses ?? 0,
    createdAtCommand: existing?.createdAtCommand ?? session.commandCount,
    updatedAtCommand: session.commandCount,
  };
  const state = circuitState(session, session.circuits[id]);
  addBadge(session, `circuit:${id.replace(/^circuit:/, "")}`);
  return [
    `Mapped ${parsed.label}.`,
    `${state.state} ${state.quality}%: ${state.reason}.`,
    parsed.stops.map((stop) => getBaseRoom(stop).title).join(" -> "),
  ];
}

function handleRideCircuit(session: PlaySession, rawValue: string): string[] {
  const circuit = findCircuit(session, rawValue);
  if (!circuit) return ["Usage: ride-circuit <label>."];
  const state = circuitState(session, circuit);
  if (state.state !== "stable") {
    return [`${circuit.label} is ${state.state}: ${state.reason}.`];
  }
  const destination = circuit.stops[circuit.stops.length - 1]!;
  const origin = session.currentRoom;
  pushRoom(session, destination);
  clearPager(session);
  circuit.uses += 1;
  circuit.updatedAtCommand = session.commandCount;
  adjustPressure(session, origin, -1, "circuit departure");
  adjustPressure(session, destination, -1, "circuit arrival");
  addBadge(session, `ride:${circuit.id.replace(/^circuit:/, "")}`);
  return [
    `Rode ${circuit.label} to ${getBaseRoom(destination).title}.`,
    circuit.stops.map((stop) => getBaseRoom(stop).title).join(" -> "),
  ];
}

function ledgerIncome(session: PlaySession): number {
  const anchors = anchorEntries(session);
  const stableCircuits = circuitEntries(session).filter((circuit) => circuit.state === "stable");
  const onlineServices = serviceEntries(session).filter((service) => service.state === "online");
  const readyRunbooks = runbookEntries(session).filter((runbook) => runbook.state === "ready");
  return Math.min(
    40,
    anchors.reduce((total, anchor) => total + Math.max(1, Math.floor(anchor.capacity / 20)), 0) +
      stableCircuits.length * 3 +
      onlineServices.length * 2 +
      readyRunbooks.length,
  );
}

function ledgerCapacity(session: PlaySession): number {
  const anchors = anchorEntries(session);
  const stableCircuits = circuitEntries(session).filter((circuit) => circuit.state === "stable");
  return 25 + anchors.length * 20 + stableCircuits.length * 10;
}

function ledgerState(session: PlaySession): PlayLedger {
  const income = ledgerIncome(session);
  const capacity = ledgerCapacity(session);
  const balance = Math.min(capacity, session.ledger?.balance ?? 0);
  return {
    balance,
    earned: session.ledger?.earned ?? 0,
    spent: session.ledger?.spent ?? 0,
    capacity,
    income,
    state: balance === 0 ? "empty" : income >= 8 ? "flow" : "trickle",
    updatedAtCommand: session.ledger?.updatedAtCommand ?? 0,
  };
}

function handleLedger(session: PlaySession): string[] {
  const ledger = ledgerState(session);
  return [
    `Ledger: ${ledger.balance}/${ledger.capacity} ${ledger.state}.`,
    `Income: ${ledger.income}`,
    `Earned: ${ledger.earned}`,
    `Spent: ${ledger.spent}`,
  ];
}

function handleCollectCache(session: PlaySession): string[] {
  const income = ledgerIncome(session);
  if (income <= 0) return ["No stable capacity to collect yet."];
  const capacity = ledgerCapacity(session);
  const before = session.ledger.balance;
  const gained = Math.min(income, Math.max(0, capacity - before));
  session.ledger.balance = before + gained;
  session.ledger.earned += gained;
  session.ledger.updatedAtCommand = session.commandCount;
  addBadge(session, "ledger:collect");
  return [
    `Collected ${gained} cache.`,
    `Balance ${before}/${capacity} -> ${session.ledger.balance}/${capacity}.`,
  ];
}

function handleBoostCache(session: PlaySession, rawValue: string): string[] {
  const target = resolveRoomId(rawValue) ?? session.currentRoom;
  if (!isVisibleInDirectory(session, target)) return [`${getBaseRoom(target).title} is not visible enough to boost.`];
  const cost = 10;
  if ((session.ledger?.balance ?? 0) < cost) {
    return [`Need ${cost} cache.`];
  }

  const before = session.ledger.balance;
  session.ledger.balance -= cost;
  session.ledger.spent += cost;
  session.ledger.updatedAtCommand = session.commandCount;
  const pressureBefore = getPressure(session, target).level;
  adjustPressure(session, target, -3, "cache boost");
  const service = session.services?.[target];
  if (service) {
    service.health = Math.min(100, service.health + 8);
    service.updatedAtCommand = session.commandCount;
  }
  const replica = session.replicas?.[target];
  if (replica) {
    replica.integrity = Math.min(100, replica.integrity + 6);
    replica.level = replicaLevel(replica.integrity);
    replica.updatedAt = now();
  }
  addBadge(session, `boost:${target}`);
  return [
    `Boosted ${getBaseRoom(target).title}.`,
    `Cache ${before} -> ${session.ledger.balance}.`,
    `Pressure ${pressureBefore}/5 -> ${getPressure(session, target).level}/5.`,
  ];
}

function trustLinkId(left: PlayRoomId, right: PlayRoomId): string {
  return [left, right].sort().join(":");
}

function trustLinkState(integrity: number): PlayTrustLink["state"] {
  if (integrity >= 80) return "trusted";
  if (integrity >= 45) return "handshake";
  return "stale";
}

function warmReplica(session: PlaySession, roomId: PlayRoomId): StoredReplica | null {
  const replica = session.replicas?.[roomId];
  if (!replica || replica.integrity < 70) return null;
  return replica;
}

function trustLinkEntries(session: PlaySession): PlayTrustLink[] {
  return Object.values(session.trustLinks ?? {})
    .filter((entry): entry is StoredTrustLink => Boolean(entry))
    .filter((entry) => entry.endpoints.every((roomId) => isVisibleInDirectory(session, roomId)))
    .map((entry) => ({
      ...entry,
      titles: [
        getBaseRoom(entry.endpoints[0]).title,
        getBaseRoom(entry.endpoints[1]).title,
      ] as [string, string],
      state: trustLinkState(entry.integrity),
    }))
    .sort((left, right) => {
      if (left.state !== right.state) return left.state === "trusted" ? -1 : 1;
      return right.integrity - left.integrity || left.id.localeCompare(right.id);
    });
}

function linkBlockers(session: PlaySession, from: PlayRoomId, to: PlayRoomId): string[] {
  const blockers: string[] = [];
  if (from === to) blockers.push("choose another host");
  if (!session.securedRooms.includes(from)) blockers.push(`${getBaseRoom(from).title} is not sealed`);
  if (!session.securedRooms.includes(to)) blockers.push(`${getBaseRoom(to).title} is not sealed`);
  if (!warmReplica(session, from)) blockers.push(`${getBaseRoom(from).title} copy is not warm`);
  if (!warmReplica(session, to)) blockers.push(`${getBaseRoom(to).title} copy is not warm`);
  if (!session.knownRoutes?.[to] && !isAdjacentHost(from, to)) {
    blockers.push(`route to ${getBaseRoom(to).title} is not proven`);
  }

  for (const roomId of [from, to]) {
    const incident = session.incidents?.[incidentId(roomId)];
    if (incident && incident.status !== "restored") {
      blockers.push(`${getBaseRoom(roomId).title} has an incident`);
    }

    const daemon = session.daemons?.[roomId];
    if (daemon && daemon.load > 2) {
      blockers.push(`${getBaseRoom(roomId).title} watcher is noisy`);
    }
  }

  return blockers;
}

function handleLink(session: PlaySession, rawValue: string): string[] {
  const target = resolveRoomId(rawValue);
  if (!target) {
    return ["Usage: link <secured-host>."];
  }

  const source = session.currentRoom;
  const blockers = linkBlockers(session, source, target);
  if (blockers.length > 0) {
    return [
      `Cannot link ${getBaseRoom(source).title} to ${getBaseRoom(target).title}.`,
      ...blockers.map((blocker) => `- ${blocker}`),
    ];
  }

  session.trustLinks ??= {};
  const id = trustLinkId(source, target);
  const existing = session.trustLinks[id];
  if (existing) {
    return [
      `${getBaseRoom(existing.endpoints[0]).title} <-> ${getBaseRoom(existing.endpoints[1]).title} already linked.`,
      `Integrity ${existing.integrity}%; state ${trustLinkState(existing.integrity)}.`,
    ];
  }

  const sourceReplica = warmReplica(session, source)!;
  const targetReplica = warmReplica(session, target)!;
  const integrity = Math.min(88, Math.max(55, Math.round((sourceReplica.integrity + targetReplica.integrity) / 2)));
  session.trustLinks[id] = {
    id,
    endpoints: [source, target].sort() as [PlayRoomId, PlayRoomId],
    integrity,
    createdAtCommand: session.commandCount,
    updatedAtCommand: session.commandCount,
  };
  addBadge(session, `link:${id}`);

  return [
    `Linked ${getBaseRoom(source).title} <-> ${getBaseRoom(target).title}.`,
    `Integrity ${integrity}%; state ${trustLinkState(integrity)}.`,
  ];
}

function handleLinks(session: PlaySession): string[] {
  const links = trustLinkEntries(session);
  if (links.length === 0) {
    return ["No host links recorded."];
  }

  return [
    `Links: ${links.length}`,
    ...links.map(
      (link) =>
        `${link.titles[0]} <-> ${link.titles[1]} | ${link.integrity}% | ${link.state} | updated ${link.updatedAtCommand}`,
    ),
  ];
}

function handleRekey(session: PlaySession, rawValue: string): string[] {
  const target = resolveRoomId(rawValue);
  if (!target) {
    return ["Usage: rekey <linked-host>."];
  }

  const id = trustLinkId(session.currentRoom, target);
  const link = session.trustLinks?.[id];
  if (!link) {
    return [`No link between ${getBaseRoom(session.currentRoom).title} and ${getBaseRoom(target).title}.`];
  }

  const blockers = linkBlockers(session, session.currentRoom, target);
  if (blockers.length > 0) {
    return [
      `Cannot rekey ${getBaseRoom(session.currentRoom).title} <-> ${getBaseRoom(target).title}.`,
      ...blockers.map((blocker) => `- ${blocker}`),
    ];
  }

  const before = link.integrity;
  link.integrity = Math.min(100, link.integrity + 16);
  link.updatedAtCommand = session.commandCount;
  addBadge(session, `rekey:${id}`);
  return [
    `Rekeyed ${getBaseRoom(link.endpoints[0]).title} <-> ${getBaseRoom(link.endpoints[1]).title}.`,
    `Integrity ${before}% -> ${link.integrity}%; state ${trustLinkState(link.integrity)}.`,
  ];
}

function tickTrustLinks(session: PlaySession): string[] {
  const lines: string[] = [];
  for (const link of Object.values(session.trustLinks ?? {})) {
    if (!link) continue;
    if (session.commandCount - link.updatedAtCommand < LINK_TICK_INTERVAL) continue;

    const ticks = Math.floor((session.commandCount - link.updatedAtCommand) / LINK_TICK_INTERVAL);
    const pressure = link.endpoints.some((roomId) => getPressure(session, roomId).level >= 3) ? 3 : 0;
    const noise = link.endpoints.some((roomId) => (session.daemons?.[roomId]?.load ?? 0) > 2) ? 4 : 0;
    const incident = link.endpoints.some((roomId) => {
      const open = session.incidents?.[incidentId(roomId)];
      return open && open.status !== "restored";
    }) ? 5 : 0;
    const decay = Math.max(1, ticks * (1 + pressure + noise + incident));
    const before = link.integrity;
    link.integrity = Math.max(1, link.integrity - decay);
    link.updatedAtCommand += ticks * LINK_TICK_INTERVAL;

    if (trustLinkState(before) !== trustLinkState(link.integrity)) {
      lines.push(
        `${getBaseRoom(link.endpoints[0]).title} <-> ${getBaseRoom(link.endpoints[1]).title} link is ${trustLinkState(link.integrity)}.`,
      );
    }
  }
  return lines;
}

function serviceState(health: number): PlayService["state"] {
  if (health >= 70) return "online";
  if (health >= 35) return "degraded";
  return "offline";
}

function serviceEntries(session: PlaySession): PlayService[] {
  return Object.values(session.services ?? {})
    .filter((entry): entry is StoredService => Boolean(entry))
    .filter((entry) => isVisibleInDirectory(session, entry.room))
    .map((entry) => ({
      ...entry,
      title: `${getBaseRoom(entry.room).title} ${entry.kind}`,
      state: serviceState(entry.health),
    }))
    .sort((left, right) => {
      if (left.state !== right.state) return left.state === "online" ? -1 : 1;
      return right.health - left.health || left.title.localeCompare(right.title);
    });
}

function serviceBlockers(session: PlaySession, roomId: PlayRoomId): string[] {
  const blockers: string[] = [];
  if (!session.securedRooms.includes(roomId)) blockers.push(`${getBaseRoom(roomId).title} is not sealed`);
  if (!warmReplica(session, roomId)) blockers.push(`${getBaseRoom(roomId).title} copy is not warm`);

  const incident = session.incidents?.[incidentId(roomId)];
  if (incident && incident.status !== "restored") blockers.push(`${getBaseRoom(roomId).title} has an incident`);

  const daemon = session.daemons?.[roomId];
  if (daemon && daemon.load > 2) blockers.push(`${getBaseRoom(roomId).title} watcher is noisy`);

  return blockers;
}

function handleInstallService(session: PlaySession): string[] {
  const roomId = session.currentRoom;
  const kind = SERVICE_KIND_BY_ROOM[roomId];
  const blockers = serviceBlockers(session, roomId);
  if (blockers.length > 0) {
    return [
      `Cannot install ${getBaseRoom(roomId).title} ${kind}.`,
      ...blockers.map((blocker) => `- ${blocker}`),
    ];
  }

  session.services ??= {};
  const existing = session.services[roomId];
  if (existing) {
    return [
      `${getBaseRoom(roomId).title} ${existing.kind} already installed.`,
      `Health ${existing.health}%; state ${serviceState(existing.health)}.`,
    ];
  }

  const replica = warmReplica(session, roomId)!;
  const service: StoredService = {
    id: `service:${roomId}`,
    room: roomId,
    kind,
    health: Math.min(90, Math.max(60, replica.integrity + 8)),
    installedAtCommand: session.commandCount,
    updatedAtCommand: session.commandCount,
  };
  session.services[roomId] = service;
  addBadge(session, `service:${roomId}`);
  return [
    `Installed ${getBaseRoom(roomId).title} ${kind}.`,
    `Health ${service.health}%; state ${serviceState(service.health)}.`,
  ];
}

function findService(session: PlaySession, rawValue: string): StoredService | null {
  const roomId = resolveRoomId(rawValue);
  if (roomId) return session.services?.[roomId] ?? null;
  const needle = normalizeText(rawValue);
  return (
    Object.values(session.services ?? {}).find((service) => normalizeText(service.id) === needle) ??
    Object.values(session.services ?? {}).find((service) => normalizeText(service.kind).includes(needle)) ??
    null
  );
}

function handleServices(session: PlaySession): string[] {
  const services = serviceEntries(session);
  if (services.length === 0) {
    return ["No host services installed."];
  }

  return [
    `Services: ${services.filter((service) => service.state === "online").length}/${services.length} online.`,
    ...services.map(
      (service) =>
        `${service.title} | ${service.health}% | ${service.state} | updated ${service.updatedAtCommand}`,
    ),
  ];
}

function handleService(session: PlaySession, rawValue: string): string[] {
  const service = findService(session, rawValue);
  if (!service) {
    return ["Usage: service <host-or-kind>."];
  }

  return [
    `${getBaseRoom(service.room).title} ${service.kind}`,
    `Health: ${service.health}%`,
    `State: ${serviceState(service.health)}`,
    `Installed: ${service.installedAtCommand}`,
    `Updated: ${service.updatedAtCommand}`,
  ];
}

function handleRepairService(session: PlaySession, rawValue: string): string[] {
  const service = rawValue.trim() ? findService(session, rawValue) : session.services?.[session.currentRoom] ?? null;
  if (!service) {
    return ["Usage: repair-service [host-or-kind]."];
  }

  const blockers = serviceBlockers(session, service.room);
  if (blockers.length > 0) {
    return [
      `Cannot repair ${getBaseRoom(service.room).title} ${service.kind}.`,
      ...blockers.map((blocker) => `- ${blocker}`),
    ];
  }

  const before = service.health;
  service.health = Math.min(100, service.health + 18);
  service.updatedAtCommand = session.commandCount;
  addBadge(session, `repair:${service.room}`);
  return [
    `Repaired ${getBaseRoom(service.room).title} ${service.kind}.`,
    `Health ${before}% -> ${service.health}%; state ${serviceState(service.health)}.`,
  ];
}

function tickServices(session: PlaySession): string[] {
  const lines: string[] = [];
  for (const service of Object.values(session.services ?? {})) {
    if (!service) continue;
    if (session.commandCount - service.updatedAtCommand < SERVICE_TICK_INTERVAL) continue;

    const ticks = Math.floor((session.commandCount - service.updatedAtCommand) / SERVICE_TICK_INTERVAL);
    const daemonLoad = session.daemons?.[service.room]?.load ?? 0;
    const pressure = getPressure(session, service.room).level;
    const incident = session.incidents?.[incidentId(service.room)];
    const incidentPenalty = incident && incident.status !== "restored" ? 4 : 0;
    const decay = Math.max(1, ticks * (1 + Math.floor(daemonLoad / 2) + Math.floor(pressure / 2) + incidentPenalty));
    const before = service.health;
    service.health = Math.max(1, service.health - decay);
    service.updatedAtCommand += ticks * SERVICE_TICK_INTERVAL;

    if (serviceState(before) !== serviceState(service.health)) {
      lines.push(`${getBaseRoom(service.room).title} ${service.kind} is ${serviceState(service.health)}.`);
    }
  }
  return lines;
}

function runbookState(
  session: PlaySession,
  roomId: PlayRoomId,
): Pick<PlayRunbook, "state" | "reason"> {
  const service = session.services?.[roomId];
  if (!service) return { state: "blocked", reason: "missing service" };
  if (serviceState(service.health) !== "online") return { state: "blocked", reason: "service not online" };
  if (!warmReplica(session, roomId)) return { state: "blocked", reason: "copy not warm" };

  const incident = session.incidents?.[incidentId(roomId)];
  if (incident && incident.status !== "restored") return { state: "blocked", reason: "incident" };

  return { state: "ready", reason: "ready" };
}

function runbookEntries(session: PlaySession): PlayRunbook[] {
  return Object.values(session.runbooks ?? {})
    .filter((entry): entry is StoredRunbook => Boolean(entry))
    .filter((entry) => isVisibleInDirectory(session, entry.room))
    .map((entry) => ({
      ...entry,
      title: `${getBaseRoom(entry.room).title} upkeep`,
      ...runbookState(session, entry.room),
    }))
    .sort((left, right) => {
      if (left.state !== right.state) return left.state === "ready" ? -1 : 1;
      return right.runs - left.runs || left.title.localeCompare(right.title);
    });
}

function handleCompileRunbook(session: PlaySession): string[] {
  const roomId = session.currentRoom;
  const service = session.services?.[roomId];
  if (!service) {
    return [`Install ${getBaseRoom(roomId).title}'s service before compiling a runbook.`];
  }

  const state = runbookState(session, roomId);
  if (state.state !== "ready") {
    return [`Cannot compile ${getBaseRoom(roomId).title}: ${state.reason}.`];
  }

  session.runbooks ??= {};
  const existing = session.runbooks[roomId];
  const steps = ["maintain watcher", "sync warm copy", `repair ${service.kind}`];
  session.runbooks[roomId] = {
    id: `runbook:${roomId}`,
    room: roomId,
    steps,
    runs: existing?.runs ?? 0,
    compiledAtCommand: existing?.compiledAtCommand ?? session.commandCount,
    updatedAtCommand: session.commandCount,
  };
  addBadge(session, `runbook:${roomId}`);
  return [
    `Compiled ${getBaseRoom(roomId).title} upkeep.`,
    ...steps.map((step, index) => `${index + 1}. ${step}`),
  ];
}

function findRunbook(session: PlaySession, rawValue: string): StoredRunbook | null {
  const roomId = resolveRoomId(rawValue);
  if (roomId) return session.runbooks?.[roomId] ?? null;
  const needle = normalizeText(rawValue);
  return (
    Object.values(session.runbooks ?? {}).find((runbook) => normalizeText(runbook.id) === needle) ??
    Object.values(session.runbooks ?? {}).find((runbook) => normalizeText(getBaseRoom(runbook.room).title).includes(needle)) ??
    null
  );
}

function handleRunbooks(session: PlaySession): string[] {
  const runbooks = runbookEntries(session);
  if (runbooks.length === 0) {
    return ["No runbooks compiled."];
  }

  return [
    `Runbooks: ${runbooks.filter((runbook) => runbook.state === "ready").length}/${runbooks.length} ready.`,
    ...runbooks.map(
      (runbook) =>
        `${runbook.title} | ${runbook.state} | ${runbook.reason} | runs ${runbook.runs}`,
    ),
  ];
}

function handleRunbook(session: PlaySession, rawValue: string): string[] {
  const runbook = rawValue.trim() ? findRunbook(session, rawValue) : session.runbooks?.[session.currentRoom] ?? null;
  if (!runbook) {
    return ["Usage: runbook <host>."];
  }

  const state = runbookState(session, runbook.room);
  if (state.state !== "ready") {
    return [`${getBaseRoom(runbook.room).title} upkeep blocked: ${state.reason}.`];
  }

  const lines: string[] = [`Running ${getBaseRoom(runbook.room).title} upkeep.`];
  const daemon = ensureDaemon(session, runbook.room);
  const loadBefore = daemon.load;
  daemon.load = Math.max(0, daemon.load - 2);
  daemon.updatedAt = now();
  lines.push(`Watcher ${loadBefore}/6 -> ${daemon.load}/6.`);

  const replica = session.replicas?.[runbook.room];
  if (replica) {
    const before = replica.integrity;
    replica.integrity = Math.min(100, replica.integrity + Math.ceil(replicaSyncGain(session) / 2));
    replica.level = replicaLevel(replica.integrity);
    replica.lastSyncCommand = session.commandCount;
    replica.updatedAt = now();
    lines.push(`Copy ${before}% -> ${replica.integrity}%.`);
  }

  const service = session.services?.[runbook.room];
  if (service) {
    const before = service.health;
    service.health = Math.min(100, service.health + 10);
    service.updatedAtCommand = session.commandCount;
    lines.push(`${service.kind} ${before}% -> ${service.health}%.`);
  }

  runbook.runs += 1;
  runbook.updatedAtCommand = session.commandCount;
  adjustPressure(session, runbook.room, -1, "runbook upkeep");
  addBadge(session, `run:${runbook.room}`);
  return lines;
}

function sectorDefinition(rawValue: string): SectorDefinition | null {
  const needle = normalizeText(rawValue);
  if (!needle) return null;
  return (
    SECTOR_DEFINITIONS.find((sector) => normalizeText(sector.id) === needle) ??
    SECTOR_DEFINITIONS.find((sector) => normalizeText(sector.title).includes(needle)) ??
    null
  );
}

function sectorSupport(session: PlaySession, sector: SectorDefinition): number {
  const onlineServiceRooms = new Set(
    serviceEntries(session)
      .filter((service) => service.state === "online")
      .map((service) => service.room),
  );
  const readyRunbookRooms = new Set(
    runbookEntries(session)
      .filter((runbook) => runbook.state === "ready")
      .map((runbook) => runbook.room),
  );
  const trustedLinks = trustLinkEntries(session).filter((link) => link.state === "trusted");
  const linkSupport = trustedLinks.filter((link) =>
    link.endpoints.every((roomId) => sector.rooms.includes(roomId)),
  ).length;
  const serviceSupport = sector.rooms.filter((roomId) => onlineServiceRooms.has(roomId)).length;
  const runbookSupport = sector.rooms.filter((roomId) => readyRunbookRooms.has(roomId)).length;
  return serviceSupport + runbookSupport + linkSupport;
}

function sectorEntries(session: PlaySession): PlaySector[] {
  return SECTOR_DEFINITIONS.map((definition) => {
    const visibleRooms = definition.rooms.filter((roomId) => isVisibleInDirectory(session, roomId));
    const sealed = visibleRooms.filter((roomId) => session.securedRooms.includes(roomId)).length;
    const support = sectorSupport(session, definition);
    const stored = session.sectors?.[definition.id];
    const state: PlaySector["state"] = stored
      ? "claimed"
      : sealed >= definition.requiredSealed && support > 0
        ? "ready"
        : "blocked";
    const reason =
      state === "claimed"
        ? "claimed"
        : sealed < definition.requiredSealed
          ? `${definition.requiredSealed - sealed} more sealed`
          : support < 1
            ? "needs service/link/runbook"
            : "ready";

    return {
      id: definition.id,
      title: definition.title,
      rooms: [...definition.rooms],
      titles: definition.rooms.map((roomId) => getBaseRoom(roomId).title),
      requiredSealed: definition.requiredSealed,
      sealed,
      support,
      state,
      reason,
      claimedAtCommand: stored?.claimedAtCommand,
      sweeps: stored?.sweeps ?? 0,
      updatedAtCommand: stored?.updatedAtCommand,
    };
  }).sort((left, right) => {
    const rank = { ready: 0, claimed: 1, blocked: 2 } as const;
    return rank[left.state] - rank[right.state] || left.title.localeCompare(right.title);
  });
}

function handleSectors(session: PlaySession): string[] {
  const sectors = sectorEntries(session);
  return [
    `Sectors: ${sectors.filter((sector) => sector.state === "claimed").length}/${sectors.length} claimed.`,
    ...sectors.map(
      (sector) =>
        `${sector.id} | ${sector.title} | ${sector.state} | sealed ${sector.sealed}/${sector.requiredSealed} | support ${sector.support} | ${sector.reason}`,
    ),
  ];
}

function handleSector(session: PlaySession, rawValue: string): string[] {
  const definition = sectorDefinition(rawValue);
  if (!definition) {
    return ["Usage: sector <id>."];
  }

  const sector = sectorEntries(session).find((entry) => entry.id === definition.id)!;
  return [
    `${sector.title} (${sector.id})`,
    `State: ${sector.state}`,
    `Reason: ${sector.reason}`,
    `Sealed: ${sector.sealed}/${sector.requiredSealed}`,
    `Support: ${sector.support}`,
    `Sweeps: ${sector.sweeps}`,
    `Rooms: ${sector.titles.join(", ")}`,
  ];
}

function handleClaimSector(session: PlaySession, rawValue: string): string[] {
  const definition = sectorDefinition(rawValue);
  if (!definition) {
    return ["Usage: claim-sector <id>."];
  }

  const sector = sectorEntries(session).find((entry) => entry.id === definition.id)!;
  if (sector.state === "claimed") {
    return [`${sector.title} is already claimed.`];
  }
  if (sector.state !== "ready") {
    return [`${sector.title} is not ready: ${sector.reason}.`];
  }

  session.sectors ??= {};
  session.sectors[definition.id] = {
    id: definition.id,
    claimedAtCommand: session.commandCount,
    sweeps: 0,
    updatedAtCommand: session.commandCount,
  };
  addBadge(session, `sector:${definition.id}`);
  return [
    `Claimed ${sector.title}.`,
    `Rooms: ${sector.titles.join(", ")}`,
  ];
}

function handleSweepSector(session: PlaySession, rawValue: string): string[] {
  const definition = sectorDefinition(rawValue);
  if (!definition) {
    return ["Usage: sweep-sector <id>."];
  }

  const stored = session.sectors?.[definition.id];
  if (!stored) {
    return [`Claim ${definition.title} before sweeping it.`];
  }

  const lines = [`Sweeping ${definition.title}.`];
  for (const roomId of definition.rooms) {
    if (!isVisibleInDirectory(session, roomId)) continue;
    const daemon = session.daemons?.[roomId];
    const replica = session.replicas?.[roomId];
    const service = session.services?.[roomId];
    if (!daemon && !replica && !service) continue;

    if (daemon) {
      const before = daemon.load;
      daemon.load = Math.max(0, daemon.load - 1);
      daemon.updatedAt = now();
      if (before !== daemon.load) lines.push(`${getBaseRoom(roomId).title} watcher ${before}/6 -> ${daemon.load}/6.`);
    }
    if (replica) {
      const before = replica.integrity;
      replica.integrity = Math.min(100, replica.integrity + 4);
      replica.level = replicaLevel(replica.integrity);
      replica.updatedAt = now();
      if (before !== replica.integrity) lines.push(`${getBaseRoom(roomId).title} copy ${before}% -> ${replica.integrity}%.`);
    }
    if (service) {
      const before = service.health;
      service.health = Math.min(100, service.health + 5);
      service.updatedAtCommand = session.commandCount;
      if (before !== service.health) lines.push(`${getBaseRoom(roomId).title} ${service.kind} ${before}% -> ${service.health}%.`);
    }
    adjustPressure(session, roomId, -1, "sector sweep");
  }

  stored.sweeps += 1;
  stored.updatedAtCommand = session.commandCount;
  addBadge(session, `sweep:${definition.id}`);
  return lines.length > 1 ? lines : [...lines, "No active upkeep targets in this sector."];
}

function anchorId(sectorId: string): string {
  return `anchor:${sectorId}`;
}

function anchorState(capacity: number, heartbeat: number): PlayAnchor["state"] {
  if (capacity >= 60 && heartbeat >= 80) return "bright";
  if (capacity >= 35 && heartbeat >= 50) return "steady";
  return "weak";
}

function anchorCapacity(session: PlaySession, definition: SectorDefinition): number {
  const sector = sectorEntries(session).find((entry) => entry.id === definition.id);
  const stableCopies = definition.rooms.filter((roomId) => (session.replicas?.[roomId]?.integrity ?? 0) >= 70).length;
  const onlineServices = definition.rooms.filter((roomId) => serviceState(session.services?.[roomId]?.health ?? 0) === "online").length;
  const readyRunbooks = definition.rooms.filter((roomId) => runbookState(session, roomId).state === "ready").length;
  const sweeps = sector?.sweeps ?? 0;
  return Math.min(100, ((sector?.support ?? 0) * 10) + stableCopies * 12 + onlineServices * 10 + readyRunbooks * 8 + sweeps * 4);
}

function anchorBlockers(session: PlaySession, definition: SectorDefinition): string[] {
  const sector = sectorEntries(session).find((entry) => entry.id === definition.id);
  const blockers: string[] = [];
  if (sector?.state !== "claimed") blockers.push("claim sector");
  if ((sector?.support ?? 0) < 2) blockers.push("add sector support");
  if (!definition.rooms.some((roomId) => (session.replicas?.[roomId]?.integrity ?? 0) >= 70)) blockers.push("warm one local copy");
  if (!definition.rooms.some((roomId) => serviceState(session.services?.[roomId]?.health ?? 0) === "online")) blockers.push("bring one local service online");
  if (!definition.rooms.some((roomId) => runbookState(session, roomId).state === "ready")) blockers.push("compile one local runbook");
  if (definition.rooms.some((roomId) => {
    const incident = session.incidents?.[incidentId(roomId)];
    return incident && incident.status !== "restored";
  })) blockers.push("restore local incidents");
  return blockers;
}

function anchorEntries(session: PlaySession): PlayAnchor[] {
  return Object.values(session.anchors ?? {})
    .filter((entry): entry is StoredAnchor => Boolean(entry))
    .map((entry) => {
      const definition = SECTOR_DEFINITIONS.find((sector) => sector.id === entry.sectorId);
      const capacity = definition ? Math.max(entry.capacity, anchorCapacity(session, definition)) : entry.capacity;
      return {
        id: entry.id,
        sectorId: entry.sectorId,
        sectorTitle: definition?.title ?? entry.sectorId,
        state: anchorState(capacity, entry.heartbeat),
        capacity,
        heartbeat: entry.heartbeat,
        rooms: definition ? [...definition.rooms] : [],
        plantedAtCommand: entry.plantedAtCommand,
        updatedAtCommand: entry.updatedAtCommand,
      };
    })
    .sort((left, right) => right.capacity - left.capacity || left.sectorTitle.localeCompare(right.sectorTitle));
}

function findAnchor(session: PlaySession, rawValue: string): StoredAnchor | null {
  const definition = sectorDefinition(rawValue);
  if (definition) return session.anchors?.[anchorId(definition.id)] ?? null;
  const needle = normalizeText(rawValue);
  return (
    Object.values(session.anchors ?? {}).find((entry) => normalizeText(entry.id) === needle) ??
    Object.values(session.anchors ?? {}).find((entry) => normalizeText(entry.sectorId) === needle) ??
    null
  );
}

function handleAnchors(session: PlaySession): string[] {
  const anchors = anchorEntries(session);
  if (anchors.length === 0) return ["No anchors planted."];
  return [
    `Anchors: ${anchors.length}.`,
    ...anchors.map((entry) => `${entry.id} | ${entry.sectorTitle} | ${entry.state} | capacity ${entry.capacity}% | heartbeat ${entry.heartbeat}%`),
  ];
}

function handleAnchor(session: PlaySession, rawValue: string): string[] {
  const anchor = findAnchor(session, rawValue);
  if (!anchor) return ["Usage: anchor <sector>."];
  const entry = anchorEntries(session).find((candidate) => candidate.id === anchor.id);
  if (!entry) return ["Anchor slipped out of range."];
  return [
    `${entry.sectorTitle} (${entry.id})`,
    `State: ${entry.state}`,
    `Capacity: ${entry.capacity}%`,
    `Heartbeat: ${entry.heartbeat}%`,
    `Rooms: ${entry.rooms.map((roomId) => getBaseRoom(roomId).title).join(", ")}`,
  ];
}

function handlePlantAnchor(session: PlaySession, rawValue: string): string[] {
  const definition = sectorDefinition(rawValue);
  if (!definition) return ["Usage: plant-anchor <sector>."];
  const id = anchorId(definition.id);
  if (session.anchors?.[id]) return [`${definition.title} already has an anchor.`];
  const blockers = anchorBlockers(session, definition);
  if (blockers.length > 0) {
    return [
      `${definition.title} is not ready for an anchor.`,
      ...blockers.map((blocker) => `- ${blocker}`),
    ];
  }

  const capacity = anchorCapacity(session, definition);
  session.anchors ??= {};
  session.anchors[id] = {
    id,
    sectorId: definition.id,
    capacity,
    heartbeat: 70,
    plantedAtCommand: session.commandCount,
    updatedAtCommand: session.commandCount,
  };
  addBadge(session, `anchor:${definition.id}`);
  return [
    `Planted ${definition.title} anchor.`,
    `Capacity ${capacity}%; heartbeat 70%.`,
  ];
}

function handlePulseAnchor(session: PlaySession, rawValue: string): string[] {
  const anchor = findAnchor(session, rawValue);
  if (!anchor) return ["Usage: pulse-anchor <sector>."];
  const definition = SECTOR_DEFINITIONS.find((sector) => sector.id === anchor.sectorId);
  if (!definition) return ["Anchor sector is missing."];

  const blockers = anchorBlockers(session, definition).filter((blocker) => blocker !== "claim sector");
  if (blockers.includes("restore local incidents")) {
    return [
      `${definition.title} pulse is blocked.`,
      "- restore local incidents",
    ];
  }

  const beforeCapacity = anchor.capacity;
  const beforeHeartbeat = anchor.heartbeat;
  anchor.capacity = Math.max(anchor.capacity, anchorCapacity(session, definition));
  anchor.heartbeat = Math.min(100, anchor.heartbeat + Math.max(8, sectorSupport(session, definition) * 4));
  anchor.updatedAtCommand = session.commandCount;
  for (const roomId of definition.rooms) {
    adjustPressure(session, roomId, -1, "anchor pulse");
  }
  addBadge(session, `pulse:${definition.id}`);
  return [
    `Pulsed ${definition.title} anchor.`,
    `Capacity ${beforeCapacity}% -> ${anchor.capacity}%.`,
    `Heartbeat ${beforeHeartbeat}% -> ${anchor.heartbeat}%.`,
  ];
}

function meshState(session: PlaySession): PlayMesh {
  const securedCount = session.securedRooms.filter((roomId) => isVisibleInDirectory(session, roomId)).length;
  const replicas = replicaEntries(session);
  const completedBriefs = briefEntries(session).filter((brief) => brief.status === "complete");
  const readyWaypoints = waypointEntries(session).filter((waypoint) => waypoint.state === "ready");
  const incidents = incidentEntries(session).filter((incident) => incident.status !== "restored");
  const noisyDaemons = daemonEntries(session).filter((daemon) => daemon.load > 2);
  const lockedLanes = pressureReport(session).filter((entry) => entry.state === "locked");
  const trustedLinks = trustLinkEntries(session).filter((link) => link.state === "trusted");
  const onlineServices = serviceEntries(session).filter((service) => service.state === "online");
  const readyRunbooks = runbookEntries(session).filter((runbook) => runbook.state === "ready");
  const claimedSectors = sectorEntries(session).filter((sector) => sector.state === "claimed");
  const anchors = anchorEntries(session);
  const stableCircuits = circuitEntries(session).filter((circuit) => circuit.state === "stable");
  const averageIntegrity =
    replicas.length > 0
      ? Math.round(replicas.reduce((total, replica) => total + replica.integrity, 0) / replicas.length)
      : 0;
  const stableCopies = replicas.filter((replica) => replica.integrity >= 70);

  const blockers: string[] = [];
  if (securedCount < 2) blockers.push("seal another host");
  if (stableCopies.length < 1) blockers.push("keep one copy warm");
  if (completedBriefs.length < 1) blockers.push("complete one brief");
  if (readyWaypoints.length < 1) blockers.push("mark one clear route");
  if (incidents.length > 0) blockers.push("restore active incidents");
  if (noisyDaemons.length > 0) blockers.push("quiet noisy watchers");
  if (lockedLanes.length > 0) blockers.push("brace locked lanes");

  const securePoints = Math.min(30, securedCount * 12);
  const replicaPoints = replicas.length > 0 ? Math.min(30, Math.round(averageIntegrity * 0.35)) : 0;
  const briefPoints = Math.min(20, completedBriefs.length * 12);
  const waypointPoints = Math.min(10, readyWaypoints.length * 8);
  const linkPoints = Math.min(10, trustedLinks.length * 8);
  const servicePoints = Math.min(10, onlineServices.length * 5);
  const runbookPoints = Math.min(8, readyRunbooks.length * 4);
  const sectorPoints = Math.min(10, claimedSectors.length * 5);
  const anchorPoints = Math.min(10, anchors.reduce((total, anchor) => total + Math.round(anchor.capacity / 25), 0));
  const circuitPoints = Math.min(8, stableCircuits.length * 4);
  const quietPoints = replicas.length > 0 && incidents.length === 0 && noisyDaemons.length === 0 ? 10 : 0;
  const penalty = incidents.length * 15 + noisyDaemons.length * 8 + lockedLanes.length * 8;
  const score = Math.max(
    0,
    Math.min(100, securePoints + replicaPoints + briefPoints + waypointPoints + linkPoints + servicePoints + runbookPoints + sectorPoints + anchorPoints + circuitPoints + quietPoints - penalty),
  );
  const tier: PlayMesh["tier"] =
    score >= 85 ? "redundant" : score >= 65 ? "steady" : score >= 35 ? "forming" : "fragile";

  return {
    score,
    tier,
    stabilized: Boolean(session.meshStabilized) && blockers.length === 0,
    blockers,
    signals: [
      `${securedCount} sealed ${securedCount === 1 ? "host" : "hosts"}`,
      replicas.length > 0
        ? `${replicas.length} ${replicas.length === 1 ? "copy" : "copies"} at ${averageIntegrity}% avg`
        : "no copies",
      `${completedBriefs.length} complete ${completedBriefs.length === 1 ? "brief" : "briefs"}`,
      `${readyWaypoints.length} clear ${readyWaypoints.length === 1 ? "waypoint" : "waypoints"}`,
      `${trustedLinks.length} trusted ${trustedLinks.length === 1 ? "link" : "links"}`,
      `${onlineServices.length} online ${onlineServices.length === 1 ? "service" : "services"}`,
      `${readyRunbooks.length} ready ${readyRunbooks.length === 1 ? "runbook" : "runbooks"}`,
      `${claimedSectors.length} claimed ${claimedSectors.length === 1 ? "sector" : "sectors"}`,
      `${anchors.length} planted ${anchors.length === 1 ? "anchor" : "anchors"}`,
      `${stableCircuits.length} stable ${stableCircuits.length === 1 ? "circuit" : "circuits"}`,
      incidents.length === 0 ? "incidents clear" : `${incidents.length} active incidents`,
      noisyDaemons.length === 0 ? "watchers quiet" : `${noisyDaemons.length} noisy watchers`,
    ],
  };
}

function handleMesh(session: PlaySession): string[] {
  const mesh = meshState(session);
  return [
    `Mesh: ${mesh.tier} (${mesh.score}/100)${mesh.stabilized ? " / stable" : ""}.`,
    "Signals:",
    ...mesh.signals.map((signal) => `- ${signal}`),
    mesh.blockers.length > 0 ? "Blockers:" : "Blockers: none.",
    ...mesh.blockers.map((blocker) => `- ${blocker}`),
  ];
}

function handleStabilize(session: PlaySession): string[] {
  const mesh = meshState(session);

  if (mesh.blockers.length > 0) {
    return [
      `Mesh holds at ${mesh.score}/100.`,
      ...mesh.blockers.map((blocker) => `- ${blocker}`),
    ];
  }

  if (mesh.score < 70) {
    return [
      `Mesh holds at ${mesh.score}/100.`,
      "The layer is still too thin.",
    ];
  }

  session.meshStabilized = true;
  addBadge(session, "mesh:stable");
  return [
    `Mesh stabilized at ${mesh.score}/100.`,
    "Routes, copies, and watchers settle into a quieter shape.",
  ];
}

function accordState(session: PlaySession): PlayAccord {
  const mesh = meshState(session);
  const claimedSectors = sectorEntries(session).filter((sector) => sector.state === "claimed");
  const notes = notebookEntries(session);
  const decodedNotes = notes.filter((entry) => entry.decoded);
  const pinnedNotes = notes.filter((entry) => entry.pinned);
  const trustedLinks = trustLinkEntries(session).filter((link) => link.state === "trusted");
  const onlineServices = serviceEntries(session).filter((service) => service.state === "online");
  const readyRunbooks = runbookEntries(session).filter((runbook) => runbook.state === "ready");
  const activeIncidents = incidentEntries(session).filter((incident) => incident.status !== "restored");
  const noisyDaemons = daemonEntries(session).filter((daemon) => daemon.load > 2);
  const lockedLanes = pressureReport(session).filter((entry) => entry.state === "locked");

  const checks: PlayAccord["checks"] = [
    {
      id: "mesh",
      label: "Layer stable",
      passed: mesh.stabilized && mesh.score >= 70 && mesh.blockers.length === 0,
      detail: `${mesh.tier} ${mesh.score}/100${mesh.stabilized ? ", stable" : ""}`,
    },
    {
      id: "sector",
      label: "Region held",
      passed: claimedSectors.length >= 1,
      detail: `${claimedSectors.length}/${SECTOR_DEFINITIONS.length} claimed`,
    },
    {
      id: "evidence",
      label: "Fragment understood",
      passed: decodedNotes.length >= 1 && pinnedNotes.length >= 1,
      detail: `${decodedNotes.length} decoded, ${pinnedNotes.length} pinned`,
    },
    {
      id: "trust",
      label: "Trust lane live",
      passed: trustedLinks.length >= 1,
      detail: `${trustedLinks.length} trusted`,
    },
    {
      id: "service",
      label: "Upkeep loop ready",
      passed: onlineServices.length >= 1 && readyRunbooks.length >= 1,
      detail: `${onlineServices.length} online, ${readyRunbooks.length} ready`,
    },
    {
      id: "calm",
      label: "Faults quiet",
      passed: activeIncidents.length === 0 && noisyDaemons.length === 0 && lockedLanes.length === 0,
      detail: `${activeIncidents.length} incidents, ${noisyDaemons.length} noisy, ${lockedLanes.length} locked`,
    },
  ];

  const passedCount = checks.filter((check) => check.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  const ready = passedCount === checks.length;
  const completed = Boolean(session.accord);
  const tier: PlayAccord["tier"] = ready ? "clear" : score >= 50 ? "warming" : "cold";

  return {
    ready,
    completed,
    completedAtCommand: session.accord?.completedAtCommand,
    score: completed ? Math.max(score, session.accord?.score ?? score) : score,
    tier: completed ? "clear" : tier,
    checks,
    summary: completed
      ? (session.accord?.summary ?? "The layer is quiet.")
      : ready
        ? "The layer is quiet enough to close."
        : "The layer is still arranging itself.",
  };
}

function handleAccord(session: PlaySession): string[] {
  const accord = accordState(session);
  return [
    `Accord: ${accord.tier} (${accord.score}/100)${accord.completed ? " / closed" : ""}.`,
    accord.summary,
    ...accord.checks.map((check) => `${check.passed ? "[x]" : "[ ]"} ${check.label}: ${check.detail}`),
  ];
}

function handleAttune(session: PlaySession): string[] {
  const accord = accordState(session);
  if (accord.completed) {
    return [
      `Accord already closed at command ${accord.completedAtCommand ?? "unknown"}.`,
      accord.summary,
    ];
  }

  if (!accord.ready) {
    return [
      `Accord holds at ${accord.score}/100.`,
      ...accord.checks
        .filter((check) => !check.passed)
        .map((check) => `- ${check.label}: ${check.detail}`),
    ];
  }

  session.accord = {
    completedAtCommand: session.commandCount,
    score: accord.score,
    summary: "The layer is quiet, named, and able to hold its own shape.",
  };
  addBadge(session, "accord:clear");
  return [
    `Accord closed at ${accord.score}/100.`,
    session.accord.summary,
  ];
}

function presenceDefinition(rawValue: string): PresenceDefinition | null {
  const needle = normalizeText(rawValue);
  if (!needle) return null;
  return (
    PRESENCE_DEFINITIONS.find((entry) => normalizeText(entry.id) === needle) ??
    PRESENCE_DEFINITIONS.find((entry) => normalizeText(entry.handle) === needle) ??
    PRESENCE_DEFINITIONS.find((entry) => normalizeText(entry.title).includes(needle)) ??
    null
  );
}

function ensurePresence(session: PlaySession, definition: PresenceDefinition): StoredPresence {
  session.presence ??= {};
  const existing = session.presence[definition.id];
  if (existing) {
    existing.lastSignal = definition.signal(session);
    existing.updatedAtCommand = session.commandCount;
    return existing;
  }

  const created: StoredPresence = {
    id: definition.id,
    affinity: 10,
    state: "idle",
    lastSignal: definition.signal(session),
    revealedAtCommand: session.commandCount,
    updatedAtCommand: session.commandCount,
  };
  session.presence[definition.id] = created;
  return created;
}

function visiblePresenceEntries(session: PlaySession): PlayPresence[] {
  return PRESENCE_DEFINITIONS.flatMap((definition) => {
    const stored = session.presence?.[definition.id];
    const visible = definition.reveal(session) || Boolean(stored);
    if (!visible || !isVisibleInDirectory(session, definition.room)) return [];

    const entry = ensurePresence(session, definition);
    const taskRoom = entry.taskRoom;
    return [{
      id: definition.id,
      handle: definition.handle,
      title: definition.title,
      room: definition.room,
      roomTitle: getBaseRoom(definition.room).title,
      state: entry.state,
      affinity: entry.affinity,
      taskRoom,
      taskTitle: taskRoom ? getBaseRoom(taskRoom).title : undefined,
      lastSignal: entry.lastSignal,
      revealedAtCommand: entry.revealedAtCommand,
      updatedAtCommand: entry.updatedAtCommand,
    }];
  }).sort((left, right) => {
    const rank = { helping: 0, available: 1, idle: 2, hidden: 3 } as const;
    return rank[left.state] - rank[right.state] || left.handle.localeCompare(right.handle);
  });
}

function canReachPresence(session: PlaySession, definition: PresenceDefinition): boolean {
  return (
    session.currentRoom === definition.room ||
    Boolean(session.knownRoutes[definition.room]) ||
    ADJACENT_HOSTS[session.currentRoom]?.includes(definition.room) ||
    session.securedRooms.includes(definition.room)
  );
}

function handleRoster(session: PlaySession): string[] {
  const entries = visiblePresenceEntries(session);
  if (entries.length === 0) {
    return ["Roster quiet."];
  }

  return [
    `Roster: ${entries.length} known.`,
    ...entries.map((entry) =>
      `${entry.handle} | ${entry.state} | ${entry.roomTitle} | ${entry.affinity}% | ${entry.taskTitle ? `watching ${entry.taskTitle}` : entry.lastSignal}`,
    ),
  ];
}

function handleBuddy(session: PlaySession, rawValue: string): string[] {
  const definition = presenceDefinition(rawValue);
  if (!definition) return ["Usage: buddy <handle>."];
  const entry = visiblePresenceEntries(session).find((presence) => presence.id === definition.id);
  if (!entry) return [`${definition.handle} is not on the roster.`];

  return [
    `${entry.title} (${entry.handle})`,
    `Host: ${entry.roomTitle}`,
    `State: ${entry.state}`,
    `Affinity: ${entry.affinity}%`,
    `Signal: ${entry.lastSignal}`,
    entry.taskTitle ? `Task: watching ${entry.taskTitle}` : "Task: none",
  ];
}

function handlePagePresence(session: PlaySession, rawValue: string): string[] {
  const definition = presenceDefinition(rawValue);
  if (!definition) return ["Usage: page <handle>."];
  if (!definition.reveal(session) && !session.presence?.[definition.id]) {
    return [`${definition.handle} is not on the roster.`];
  }
  if (!isVisibleInDirectory(session, definition.room)) {
    return [`${definition.handle} is behind an unlisted host.`];
  }
  if (!canReachPresence(session, definition)) {
    return [`No clean route to ${definition.title}. Trace ${definition.room} first.`];
  }

  const entry = ensurePresence(session, definition);
  const before = entry.affinity;
  entry.affinity = Math.min(100, entry.affinity + 15);
  entry.state = entry.affinity >= 25 ? "available" : "idle";
  entry.lastSignal = definition.signal(session);
  entry.updatedAtCommand = session.commandCount;
  addBadge(session, `page:${definition.id}`);
  return [
    `${definition.title} answers from ${getBaseRoom(definition.room).title}.`,
    `${before}% -> ${entry.affinity}%.`,
    entry.lastSignal,
  ];
}

function handleAssignPresence(session: PlaySession, rawValue: string): string[] {
  const [handleValue, ...targetParts] = rawValue.split(/\s+/);
  const definition = presenceDefinition(handleValue ?? "");
  const target = resolveRoomId(targetParts.join(" ")) ?? session.currentRoom;
  if (!definition) return ["Usage: assign <handle> [host]."];
  if (!isVisibleInDirectory(session, target)) return [`${getBaseRoom(target).title} is not visible enough to watch.`];

  const entry = ensurePresence(session, definition);
  if (entry.affinity < 25) {
    return [`Page ${definition.handle} before assigning a watch.`];
  }

  if (!session.securedRooms.includes(target) && !session.knownRoutes[target] && target !== session.currentRoom) {
    return [`Trace or secure ${getBaseRoom(target).title} before assigning a watch.`];
  }

  const pressure = getPressure(session, target);
  const before = pressure.level;
  adjustPressure(session, target, -2, `${definition.handle} watch`);
  entry.state = "helping";
  entry.taskRoom = target;
  entry.affinity = Math.min(100, entry.affinity + 5);
  entry.lastSignal = `watching ${getBaseRoom(target).title}`;
  entry.updatedAtCommand = session.commandCount;
  addBadge(session, `assign:${definition.id}`);
  return [
    `${definition.title} watches ${getBaseRoom(target).title}.`,
    `Pressure ${before}/5 -> ${getPressure(session, target).level}/5.`,
  ];
}

function anomalyDefinition(rawValue: string): AnomalyDefinition | null {
  const needle = normalizeText(rawValue);
  if (!needle) return null;
  return (
    ANOMALY_DEFINITIONS.find((entry) => normalizeText(entry.id) === needle) ??
    ANOMALY_DEFINITIONS.find((entry) => normalizeText(entry.title).includes(needle)) ??
    ANOMALY_DEFINITIONS.find((entry) => normalizeText(entry.room) === needle) ??
    null
  );
}

function anomalyIntensity(session: PlaySession, definition: AnomalyDefinition): number {
  const pressure = getPressure(session, definition.room).level;
  const daemon = session.daemons?.[definition.room]?.load ?? 0;
  const replica = session.replicas?.[definition.room]?.integrity;
  const replicaDrift = replica === undefined ? 0 : Math.max(0, Math.ceil((80 - replica) / 10));
  const context = notebookEntries(session).filter((entry) => entry.room === definition.room).length;
  return Math.max(1, Math.min(9, pressure + daemon + replicaDrift + (context > 0 ? 1 : 0)));
}

function ensureAnomaly(session: PlaySession, definition: AnomalyDefinition): StoredAnomaly {
  session.anomalies ??= {};
  const existing = session.anomalies[definition.id];
  if (existing) {
    existing.intensity = existing.state === "stabilized" ? 0 : anomalyIntensity(session, definition);
    return existing;
  }

  const created: StoredAnomaly = {
    id: definition.id,
    state: "active",
    intensity: anomalyIntensity(session, definition),
    revealedAtCommand: session.commandCount,
  };
  session.anomalies[definition.id] = created;
  return created;
}

function anomalyEntries(session: PlaySession): PlayAnomaly[] {
  return ANOMALY_DEFINITIONS.flatMap((definition) => {
    const stored = session.anomalies?.[definition.id];
    const visible = definition.reveal(session) || Boolean(stored);
    if (!visible || !isVisibleInDirectory(session, definition.room)) return [];
    const entry = ensureAnomaly(session, definition);
    return [{
      id: definition.id,
      room: definition.room,
      title: definition.title,
      roomTitle: getBaseRoom(definition.room).title,
      state: entry.state,
      intensity: entry.state === "stabilized" ? 0 : entry.intensity,
      clue: definition.clue,
      requirement: definition.requirement,
      revealedAtCommand: entry.revealedAtCommand,
      stabilizedAtCommand: entry.stabilizedAtCommand,
    }];
  }).sort((left, right) => {
    const rank = { active: 0, latent: 1, stabilized: 2 } as const;
    return rank[left.state] - rank[right.state] || right.intensity - left.intensity || left.title.localeCompare(right.title);
  });
}

function captureAnomalyNote(session: PlaySession, definition: AnomalyDefinition): void {
  addNotebookEntry(session, {
    room: definition.room,
    kind: "room",
    source: definition.id,
    title: `${definition.title} fold`,
    summary: definition.clue,
  });
}

function handleFolds(session: PlaySession): string[] {
  const entries = anomalyEntries(session);
  if (entries.length === 0) return ["No visible folds."];

  return [
    `Folds: ${entries.filter((entry) => entry.state !== "stabilized").length}/${entries.length} active.`,
    ...entries.map((entry) =>
      `${entry.id} | ${entry.roomTitle} | ${entry.state} | ${entry.intensity}/9 | ${entry.requirement}`,
    ),
  ];
}

function handleFold(session: PlaySession, rawValue: string): string[] {
  const definition = anomalyDefinition(rawValue);
  if (!definition) return ["Usage: fold <id>."];
  const entry = anomalyEntries(session).find((candidate) => candidate.id === definition.id);
  if (!entry) return [`${definition.title} is not visible.`];

  captureAnomalyNote(session, definition);
  return [
    `${entry.title} (${entry.id})`,
    `Host: ${entry.roomTitle}`,
    `State: ${entry.state}`,
    `Intensity: ${entry.intensity}/9`,
    `Clue: ${entry.clue}`,
    `Requirement: ${entry.requirement}`,
  ];
}

function handleSmooth(session: PlaySession, rawValue: string): string[] {
  const definition = anomalyDefinition(rawValue);
  if (!definition) return ["Usage: smooth <id>."];
  const entry = anomalyEntries(session).find((candidate) => candidate.id === definition.id);
  if (!entry) return [`${definition.title} is not visible.`];

  const stored = ensureAnomaly(session, definition);
  if (stored.state === "stabilized") {
    return [`${definition.title} is already smooth.`];
  }
  if (!definition.canStabilize(session)) {
    return [
      `${definition.title} still catches.`,
      `Need: ${definition.requirement}.`,
    ];
  }

  const before = getPressure(session, definition.room).level;
  adjustPressure(session, definition.room, -3, `${definition.id} smoothed`);
  stored.state = "stabilized";
  stored.intensity = 0;
  stored.stabilizedAtCommand = session.commandCount;
  captureAnomalyNote(session, definition);
  addBadge(session, `fold:${definition.id}`);
  return [
    `${definition.title} smoothed.`,
    `Pressure ${before}/5 -> ${getPressure(session, definition.room).level}/5.`,
  ];
}

function clearPager(session: PlaySession): void {
  session.pagerLines = null;
  session.pagerOffset = 0;
}

function pushRoom(session: PlaySession, roomId: PlayRoomId): void {
  if (session.currentRoom !== roomId) {
    session.roomStack.push(session.currentRoom);
  }
  session.currentRoom = roomId;
  setGrace(session, roomId);
}

function popRoom(session: PlaySession): PlayRoomId {
  const previous = session.roomStack.pop();
  if (previous) {
    session.currentRoom = previous;
  } else {
    session.currentRoom = "desk";
  }
  return session.currentRoom;
}

function pagerState(session: PlaySession): {
  pending: boolean;
  page: number;
  total: number;
} {
  const total = session.pagerLines?.length ?? 0;
  if (!session.pagerLines || total === 0) {
    return { pending: false, page: 0, total: 0 };
  }

  return {
    pending: session.pagerOffset < total,
    page: Math.min(Math.ceil(session.pagerOffset / PAGER_PAGE_SIZE), Math.ceil(total / PAGER_PAGE_SIZE)),
    total,
  };
}

function paginateReplies(session: PlaySession, replies: string[]): string[] {
  if (!session.pagerEnabled || replies.length <= PAGER_PAGE_SIZE) {
    clearPager(session);
    return replies;
  }

  session.pagerLines = [...replies];
  session.pagerOffset = PAGER_PAGE_SIZE;
  return [...replies.slice(0, PAGER_PAGE_SIZE), "--More--"];
}

function continuePager(
  session: PlaySession,
  control: string,
): string[] | null {
  if (!session.pagerLines || session.pagerLines.length === 0) {
    return null;
  }

  const total = session.pagerLines.length;
  const currentStart = Math.max(0, session.pagerOffset - PAGER_PAGE_SIZE);
  const currentEnd = Math.min(total, session.pagerOffset);

  switch (control) {
    case "q":
      clearPager(session);
      return ["Pager dismissed."];
    case "space":
    case "j": {
      if (session.pagerOffset >= total) {
        clearPager(session);
        return ["Pager dismissed."];
      }
      const nextStart = session.pagerOffset;
      session.pagerOffset = Math.min(total, session.pagerOffset + PAGER_PAGE_SIZE);
      const nextEnd = session.pagerOffset;
      const page = session.pagerLines.slice(nextStart, nextEnd);
      const more = session.pagerOffset < total;
      if (!more) {
        clearPager(session);
      }
      return more ? [...page, "--More--"] : page;
    }
    case "b":
    case "k": {
      const previousStart = Math.max(0, currentStart - PAGER_PAGE_SIZE);
      session.pagerOffset = currentStart;
      const page = session.pagerLines.slice(previousStart, currentStart);
      if (previousStart === 0) {
        session.pagerOffset = Math.max(PAGER_PAGE_SIZE, currentStart);
      }
      return page.length > 0 ? [...page, "--More--"] : ["At beginning."];
    }
    case "g":
      session.pagerOffset = PAGER_PAGE_SIZE;
      return [...session.pagerLines.slice(0, PAGER_PAGE_SIZE), "--More--"];
    case "G": {
      const pageSize = PAGER_PAGE_SIZE;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const start = (totalPages - 1) * pageSize;
      const end = total;
      session.pagerOffset = end;
      const page = session.pagerLines.slice(start, end);
      clearPager(session);
      return page;
    }
    default:
      if (control.startsWith("/")) {
        const needle = normalizeText(control.slice(1));
        if (!needle) return ["Usage: /<term>."];
        const matches = session.pagerLines.filter((line) => normalizeText(line).includes(needle));
        return matches.length > 0 ? matches : [`No pager matches for ${needle}.`];
      }
      return null;
  }
}

function listBadges(session: PlaySession): string[] {
  if (session.badges.length === 0) {
    return ["No badges yet."];
  }

  return session.badges.map((badge, index) => `${index + 1}. ${badge}`);
}

function handleLogin(session: PlaySession, rawValue: string, newUser = false): string[] {
  const requested = normalizeText(rawValue);
  const name = requested || "guest";
  session.authenticated = true;
  session.shellMode = "shell";
  session.username = name;
  addBadge(session, newUser ? "newuser" : "login");
  return newUser
    ? [`New user registered: ${name}`, "The shell is open and the @ prompt is active."]
    : [`Logged in as ${name}`, "The shell is open and the @ prompt is active."];
}

function getShellPrompt(session: PlaySession): string {
  if (session.shellMode === "monitor") {
    return "*";
  }

  if (session.shellMode === "basic") {
    return ">";
  }

  return session.authenticated ? "@" : ".";
}

function handleNetstat(session: PlaySession): string[] {
  return [
    `user: ${session.username ?? "guest"}`,
    `prompt: ${getShellPrompt(session)}`,
    `stty: ${session.sttyMode}`,
    `pager: ${session.pagerEnabled ? "on" : "off"}`,
    `badges: ${session.badges.length}`,
    `hosts visible: ${session.discoveredRooms.length}/${PLAY_ROOM_ORDER.length}`,
    `hosts secured: ${session.securedRooms.length}`,
    `pressure events: ${pressureReport(session).length}`,
    ...PLAY_ROOM_ORDER.map((roomId) => {
      const discovered = session.discoveredRooms.includes(roomId) ? "*" : " ";
      const secured = session.securedRooms.includes(roomId) ? "!" : " ";
      const pressure = getPressure(session, roomId);
      const suffix = pressure.level > 0 ? ` | ${pressureState(pressure.level)} ${pressure.level}/5` : "";
      return `${discovered}${secured} ${getBaseRoom(roomId).title}${suffix}`;
    }),
  ];
}

function handleScores(session: PlaySession): string[] {
  return [
    `user: ${session.username ?? "guest"}`,
    `badges earned: ${session.badges.length}`,
    ...listBadges(session),
  ];
}

function handleStty(session: PlaySession, rawValue: string): string[] {
  const normalized = normalizeText(rawValue);
  if (!normalized) {
    return [`stty ${session.sttyMode}`, "Use stty /dumb or stty /tty."];
  }

  if (normalized === "/dumb" || normalized === "dumb") {
    session.sttyMode = "dumb";
    return ["stty set to dumb", "The shell is now flatter and more screen-reader friendly."];
  }

  if (normalized === "/tty" || normalized === "tty") {
    session.sttyMode = "tty";
    return ["stty set to tty", "The shell is now in the richer terminal mode."];
  }

  return ["Usage: stty /dumb or stty /tty."];
}

function handlePager(session: PlaySession, rawValue: string): string[] {
  const normalized = normalizeText(rawValue);
  if (!normalized) {
    return [`pager ${session.pagerEnabled ? "on" : "off"}`];
  }

  if (normalized === "on" || normalized === "1" || normalized === "true") {
    session.pagerEnabled = true;
    clearPager(session);
    return ["pager enabled"];
  }

  if (normalized === "off" || normalized === "0" || normalized === "false") {
    session.pagerEnabled = false;
    clearPager(session);
    return ["pager disabled"];
  }

  return ["Usage: pager on|off."];
}

function handleWardial(session: PlaySession): string[] {
  if (!session.authenticated) {
    return ["Login first. Wardialing is part of the hacker loop."];
  }

  addBadge(session, "wardial");
  addDiscovery(session, "qotd");
  addDiscovery(session, "zcode");

  return [
    "Wardial sweep complete.",
    "Discovered numbers: 800-555-0149, 800-555-0190.",
    "New hosts surfaced: QOTD, Z-Code.",
  ];
}

function handleLogout(session: PlaySession): string[] {
  session.authenticated = false;
  session.username = null;
  session.shellMode = "nli";
  clearPager(session);
  return ["Logged out.", "The prompt has dropped back to NLI mode."];
}

function handlePorthack(session: PlaySession, rawValue: string): string[] {
  if (!session.authenticated) {
    adjustPressure(session, session.currentRoom, 1, "unauthenticated porthack");
    return ["Login first. The porthack lane only opens for authenticated users."];
  }

  const target = resolveRoomId(rawValue);
  if (!target) {
    return ["Usage: porthack <adjacent host>."];
  }

  if (!isAdjacentHost(session.currentRoom, target)) {
    adjustPressure(session, session.currentRoom, 2, "remote porthack refused");
    return [
      `${getBaseRoom(target).title} is not adjacent to ${getBaseRoom(session.currentRoom).title}.`,
      "The porthack only works on neighboring hosts.",
    ];
  }

  addLogin(session, target);
  adjustPressure(session, target, 1, "new login");
  addBadge(session, `login:${target}`);
  return [
    `Login created on ${getBaseRoom(target).title}.`,
    "Use enter to move there, then root if you want to claim the host.",
  ];
}

function handleRoot(session: PlaySession, rawValue: string): string[] {
  const normalized = rawValue.trim();
  const target = normalized ? resolveRoomId(normalized) : session.currentRoom;
  if (!target) {
    return ["Usage: root <host>."];
  }

  if (target !== session.currentRoom) {
    return ["Root applies to the current host only."];
  }

  if (!hasLogin(session, target)) {
    return ["No login exists here yet. Use porthack on an adjacent host first."];
  }

  addRoot(session, target);
  addBadge(session, `root:${target}`);
  return [
    `${getBaseRoom(target).title} is now rooted.`,
    "Audit, patch, firewall, and snapshot the host before sealing it.",
  ];
}

function handleAudit(session: PlaySession): string[] {
  const denied = requireRootedHost(session);
  if (denied) return denied;

  const entry = getHardening(session, session.currentRoom);
  entry.audited = true;
  entry.updatedAt = now();
  reduceCurrentPressure(session, 1, "audit");
  addBadge(session, `audit:${session.currentRoom}`);
  return [
    `${getBaseRoom(session.currentRoom).title} audit complete.`,
    "Open services, writable drops, and old protocol lanes have been inventoried.",
  ];
}

function handlePatch(session: PlaySession): string[] {
  const denied = requireRootedHost(session);
  if (denied) return denied;

  const entry = getHardening(session, session.currentRoom);
  if (!entry.audited) {
    return ["Audit the host before patching it."];
  }

  entry.patched = true;
  entry.updatedAt = now();
  reduceCurrentPressure(session, 1, "patch");
  addBadge(session, `patch:${session.currentRoom}`);
  return [
    `${getBaseRoom(session.currentRoom).title} patch set applied.`,
    "Known daemons, upload paths, and board scripts now match the local baseline.",
  ];
}

function handleFirewall(session: PlaySession): string[] {
  const denied = requireRootedHost(session);
  if (denied) return denied;

  const entry = getHardening(session, session.currentRoom);
  if (!entry.patched) {
    return ["Patch the host before applying the firewall rules."];
  }

  entry.firewalled = true;
  entry.updatedAt = now();
  reduceCurrentPressure(session, 2, "firewall");
  addBadge(session, `firewall:${session.currentRoom}`);
  return [
    `${getBaseRoom(session.currentRoom).title} firewall rules loaded.`,
    "Only named protocol lanes remain reachable; shortcut traffic is dropped.",
  ];
}

function handleSnapshotHost(session: PlaySession): string[] {
  const denied = requireRootedHost(session);
  if (denied) return denied;

  const entry = getHardening(session, session.currentRoom);
  if (!entry.firewalled) {
    return ["Firewall the host before taking the sealed snapshot."];
  }

  entry.snapshotted = true;
  entry.updatedAt = now();
  reduceCurrentPressure(session, 2, "snapshot");
  addBadge(session, `snapshot:${session.currentRoom}`);
  return [
    `${getBaseRoom(session.currentRoom).title} snapshot written.`,
    "The host can now be sealed without leaving a brittle rollback story.",
  ];
}

function handleRestoreHost(session: PlaySession): string[] {
  const denied = requireRootedHost(session);
  if (denied) return denied;

  const entry = getHardening(session, session.currentRoom);
  if (!entry.snapshotted) {
    return ["No host snapshot is available here yet."];
  }

  entry.patched = true;
  entry.firewalled = true;
  entry.updatedAt = now();
  reduceCurrentPressure(session, 3, "restore");
  addBadge(session, `restore:${session.currentRoom}`);
  return [
    `${getBaseRoom(session.currentRoom).title} restored from snapshot.`,
    "Patch and firewall state remain intact.",
  ];
}

function canSealCurrentHost(session: PlaySession): string[] | null {
  const denied = requireRootedHost(session);
  if (denied) return denied;

  const entry = session.hardening[session.currentRoom];
  if (!entry?.audited) return ["Audit the host before sealing it."];
  if (!entry.patched) return ["Patch the host before sealing it."];
  if (!entry.firewalled) return ["Load firewall rules before sealing it."];
  if (!entry.snapshotted) return ["Take a snapshot before sealing it."];
  return null;
}

function buildRoomDetail(roomId: PlayRoomId, session: PlaySession): string[] {
  switch (roomId) {
    case "desk":
      return [
        "The desktop is steady. The cursor blinks like a metronome.",
        "Use phonebook to see the host list, or enter archive to pull the first clue.",
      ];
    case "archive":
      return [
        "The archive keeps the early-2000s notes intact.",
        "The first shelf points at a blue shell from 2001. That name is the first lock.",
      ];
    case "phonebook":
      return [
        "This is the memory of the network: a name list, not a feed.",
        "The path is easier to remember when the aliases stay small and plain.",
      ];
    case "bbs":
      return [
        "The board feels like a lobby from the dial-up years.",
        "Threads are archived because the room values memory over noise.",
        "Use read, post, and reply to work the board without leaving the shell.",
      ];
    case "ftp":
      return [
        "The mirror keeps files honest.",
        "Shareware, release notes, and public drops sit here like stacked disks.",
      ];
    case "gopher":
      return [
        "The menu tree is numbered on purpose.",
        "The route matters because the route is part of the memory.",
      ];
    case "news":
      return [
        "The wire stays calm enough to read.",
        "It is a bulletin stream, not a hypnotic feed.",
        "Use read and reply if you want to join the thread without breaking the pace.",
      ];
    case "mail":
      return [
        "The mailbox is quiet by design.",
        "Some hosts are for direct contact and should not be public spectacles.",
        "Use inbox, read, and send to keep the traffic private.",
      ];
    case "games":
      return [
        "The arcade shelf keeps the old shareware feeling intact.",
        "Games are stored like little time capsules instead of a storefront.",
      ];
    case "lab":
      return [
        "The hosting rack makes infrastructure feel explainable.",
        "Every cable on the rack is a sentence the room can still read later.",
      ];
    case "irc":
      return [
        "The relay room moves quickly but still keeps the nicknames legible.",
        "Short lines are the point: the room should feel like a conversation, not a feed.",
      ];
    case "qotd":
      return [
        "The question ticker keeps the room calm and curious.",
        "Some answers only appear when the prompt is patient.",
      ];
    case "zcode":
      return [
        "The interactive fiction shelf rewards verbs and memory.",
        "The parser likes intent more than ornament.",
      ];
    case "relay":
      return [
        "The relay refuses shortcut paths and repeat-start pressure.",
        "Fresh arrivals get grace windows so the lane stays fair.",
      ];
    case "mirror":
      return [
        "The mirror keeps duplicates honest.",
        "If the room feels like it is folding, the right answer is to brace it.",
      ];
    case "sysop":
      return [
        "Containment lives here.",
        "The admin layer seals hosts only after the path is understood.",
      ];
    case "vault":
      return session.solved
        ? [
            "The vault is open.",
            "The rest of the world will connect later; for now the room is only calm, not empty.",
          ]
        : [
            "The vault stays shut.",
            "You are missing the old shell name, and the shelf knows it.",
          ];
  }
}

function buildStatusLines(session: PlaySession): string[] {
  const openHosts = PLAY_HOSTS.length - session.securedRooms.length;
  const mesh = meshState(session);
  const accord = accordState(session);
  const presence = visiblePresenceEntries(session);
  const anomalies = anomalyEntries(session);
  const anchors = anchorEntries(session);
  const circuits = circuitEntries(session);
  return [
    `user: ${session.username ?? "guest"}`,
    `auth: ${session.authenticated ? "yes" : "no"}`,
    `prompt: ${getShellPrompt(session)}`,
    `mode: ${session.shellMode}`,
    `room: ${getBaseRoom(session.currentRoom).title}`,
    `stty: ${session.sttyMode}`,
    `pager: ${session.pagerEnabled ? "on" : "off"}`,
    `logins: ${session.loginHosts.length}`,
    `rooted hosts: ${session.rootedRooms.length}`,
    `routes known: ${Object.keys(session.knownRoutes ?? {}).length}`,
    `operations: ${operationEntries(session).filter((operation) => operation.status === "running").length}`,
    `copies: ${replicaEntries(session).length}`,
    `briefs complete: ${briefEntries(session).filter((brief) => brief.status === "complete").length}/${BRIEF_DEFINITIONS.length}`,
    `watch load: ${daemonEntries(session).reduce((total, daemon) => total + daemon.load, 0)}`,
    `incidents active: ${incidentEntries(session).filter((incident) => incident.status !== "restored").length}`,
    `waypoints: ${waypointEntries(session).length}`,
    `links: ${trustLinkEntries(session).filter((link) => link.state === "trusted").length}/${trustLinkEntries(session).length}`,
    `services: ${serviceEntries(session).filter((service) => service.state === "online").length}/${serviceEntries(session).length}`,
    `runbooks: ${runbookEntries(session).filter((runbook) => runbook.state === "ready").length}/${runbookEntries(session).length}`,
    `sectors: ${sectorEntries(session).filter((sector) => sector.state === "claimed").length}/${sectorEntries(session).length}`,
    `mesh: ${mesh.tier} (${mesh.score}/100${mesh.stabilized ? ", stable" : ""})`,
    `accord: ${accord.tier} (${accord.score}/100${accord.completed ? ", closed" : ""})`,
    `roster: ${presence.filter((entry) => entry.state === "helping").length} helping/${presence.length}`,
    `folds: ${anomalies.filter((entry) => entry.state !== "stabilized").length} active/${anomalies.length}`,
    `anchors: ${anchors.length}`,
    `circuits: ${circuits.filter((entry) => entry.state === "stable").length}/${circuits.length} stable`,
    `current pressure: ${pressureState(getPressure(session, session.currentRoom).level)} (${getPressure(session, session.currentRoom).level}/5, grace ${graceCommands(session, session.currentRoom)})`,
    `hosts secured: ${session.securedRooms.length}/${PLAY_HOSTS.length}`,
    `current hardening: ${hardeningState(session, session.currentRoom)} (${session.securedRooms.includes(session.currentRoom) ? 4 : hardeningScore(session.hardening[session.currentRoom])}/4)`,
    `open nodes: ${openHosts}`,
    `clues collected: ${session.inventory.length}`,
    `solved: ${session.solved ? "yes" : "no"}`,
    `uptime: ${secondsSince(session.createdAt)}s`,
  ];
}

function pushResponse(
  session: PlaySession,
  kind: PlayTranscriptLine["kind"],
  text: string,
) {
  session.transcript.push(line(kind, text));
  if (session.transcript.length > MAX_TRANSCRIPT_LINES) {
    session.transcript.splice(0, session.transcript.length - MAX_TRANSCRIPT_LINES);
  }
}

function buildPhonebookLines(session: PlaySession): string[] {
  return [
    "Phonebook:",
    ...PLAY_HOSTS.filter((host) => isVisibleInDirectory(session, host.id)).map((host) => {
      const state =
        host.id === "desk"
          ? "secured"
          : session.securedRooms.includes(host.id)
            ? "secured"
            : session.currentRoom === host.id
              ? "braced"
              : "open";
      return `- ${host.title} (${host.id}) | ${host.protocols.join(", ")} | ${state}`;
    }),
  ];
}

function buildRouteLines(session: PlaySession, from: PlayRoomId, to: PlayRoomId): string[] {
  const route = findVisibleRoute(session, from, to);
  if (!route) {
    return [`No visible route to ${getBaseRoom(to).title}.`];
  }

  rememberRoute(session, to, route);
  captureRouteNote(session, to, route);
  return [
    `Route to ${getBaseRoom(to).title}:`,
    route.map((hop, index) => `${index + 1}. ${getBaseRoom(hop).title}`).join(" -> "),
  ];
}

function buildWhoisLines(session: PlaySession, query: string, detailed = true): string[] {
  const key = normalizeText(query);
  if (!key) return ["Usage: whois <name>."];

  const room = resolveRoomId(key);
  if (room) {
    if (!isVisibleInDirectory(session, room)) {
      return [`No record for ${query}.`];
    }
    const host = PLAY_HOSTS.find((entry) => entry.id === room);
    if (!host) return [`No record for ${query}.`];
    return [
      `${host.title} / ${host.role}`,
      host.detail,
      `aliases: ${host.aliases.join(", ")}`,
      `protocols: ${host.protocols.join(", ")}`,
    ];
  }

  const entry = DIRECTORY[key];
  if (entry) {
    return detailed
      ? [entry.title, entry.role, entry.note]
      : [`${entry.title} / ${entry.role}`];
  }

  return [`No record for ${query}.`];
}

function buildTodayLines(session: PlaySession): string[] {
  const card = HISTORY_CARDS[session.commandCount % HISTORY_CARDS.length];
  return [
    `Today in the archive: ${card.year}`,
    card.title,
    card.body,
  ];
}

function buildDirectoryHelp(topic: string): string[] {
  const entry = COMMAND_HELP[normalizeText(topic)];
  if (!entry) return [`No help entry for ${topic}.`];
  return [entry];
}

function formatMessageHeader(message: PlayMessage, index: number): string {
  const stamp = new Date(message.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${index + 1}. ${message.subject} — ${message.author} (${stamp})`;
}

function listMessages(messages: PlayMessage[]): string[] {
  if (messages.length === 0) {
    return ["Nothing here yet."];
  }

  return messages.map((message, index) => formatMessageHeader(message, index));
}

function readMessage(messages: PlayMessage[], value: string): string[] {
  if (!value.trim()) {
    return listMessages(messages);
  }

  const index = Number.parseInt(value, 10);
  if (!Number.isInteger(index) || index < 1 || index > messages.length) {
    return [`No message number ${value}.`];
  }

  const message = messages[index - 1];
  if (!message) {
    return [`No message number ${value}.`];
  }

  return [
    `${message.subject} — ${message.author}`,
    new Date(message.createdAt).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    message.body,
  ];
}

function captureMessageNote(
  session: PlaySession,
  roomId: PlayRoomId,
  message: PlayMessage,
): void {
  addNotebookEntry(session, {
    room: roomId,
    kind: "message",
    source: message.subject,
    title: `${getBaseRoom(roomId).title} / ${message.subject}`,
    summary: `${message.author}: ${message.body}`,
  });
}

function parseSubjectBody(rawValue: string): { subject: string; body: string } {
  const trimmed = rawValue.trim();
  if (!trimmed.includes(":")) {
    return {
      subject: "untitled",
      body: trimmed,
    };
  }

  const [subject, ...rest] = trimmed.split(":");
  return {
    subject: subject.trim() || "untitled",
    body: rest.join(":").trim(),
  };
}

function parseRecipientMessage(rawValue: string): {
  recipient: string;
  subject: string;
  body: string;
} {
  const trimmed = rawValue.trim();
  const [recipient, ...rest] = trimmed.split(/\s+/);
  const restValue = rest.join(" ").trim();
  const parsed = parseSubjectBody(restValue);
  return {
    recipient: recipient ?? "",
    subject: parsed.subject,
    body: parsed.body,
  };
}

function appendBoardPost(
  session: PlaySession,
  roomId: PlayRoomId,
  entry: PlayMessage,
): void {
  session.boards[roomId] = [...(session.boards[roomId] ?? []), entry];
}

function appendInboxMessage(session: PlaySession, entry: PlayMessage): void {
  session.inbox = [...session.inbox, entry];
}

function listVisibleFiles(room: PlayRoom, session: PlaySession): string[] {
  const files = visibleFiles(room, session);
  if (files.length === 0) return ["No visible files."];
  return files.map((file) => file.hidden ? `${file.name} (hidden)` : file.name);
}

function findFileOnRoom(room: PlayRoom, target: string, session: PlaySession): PlayFile | null {
  const normalized = normalizeText(target);
  const files = visibleFiles(room, session);
  return (
    files.find((file) => normalizeText(file.name) === normalized) ??
    files.find((file) => normalizeText(file.name).startsWith(normalized))
  ) ?? null;
}

function parseHostAndFile(target: string, defaultRoom: PlayRoomId): {
  host: PlayRoomId;
  file: string;
} {
  const trimmed = target.trim();
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex > 0) {
    const host = resolveRoomId(trimmed.slice(0, slashIndex)) ?? defaultRoom;
    return { host, file: trimmed.slice(slashIndex + 1).trim() };
  }
  return { host: defaultRoom, file: trimmed };
}

function handleScan(session: PlaySession): string[] {
  const room = buildRoom(session.currentRoom, session);
  const lines: string[] = [room.summary];
  captureRoomNote(session, session.currentRoom);

  switch (session.currentRoom) {
    case "desk":
      lines.push("Visible rooms: archive, phonebook, bbs, ftp, gopher, news, mail, relay, mirror, sysop.");
      lines.push("More rooms are tucked into games, lab, and irc.");
      lines.push("The vault is hidden until the old shell name is spoken.");
      break;
    case "archive":
      if (!hasClue(session, "luna")) {
        addClue(session, "luna");
        lines.push("A faded label surfaces from the archive: the shell name is Luna.");
      }
      lines.push("The hidden file can now be read if you know the name.");
      break;
    case "relay":
      if (!hasClue(session, "grace")) {
        addClue(session, "grace");
      }
      lines.push("The lane teaches grace: no repeat-start pressure, no side exits, only clean turns.");
      break;
    case "mirror":
      if (!hasClue(session, "seal")) {
        addClue(session, "seal");
      }
      lines.push("The mirror yields a note: seal the room after the route is understood.");
      break;
    case "phonebook":
      lines.push("The directory is the map. The map is the memory.");
      break;
    case "bbs":
      lines.push("Threads are stored here like local history.");
      break;
    case "ftp":
      lines.push("Shareware mirrors and release notes keep the room busy.");
      break;
    case "gopher":
      lines.push("The numbered tree is a clue in itself.");
      break;
    case "news":
      lines.push("The bulletin wire stays readable and slow.");
      break;
    case "mail":
      lines.push("The inbox is quiet; this room prefers direct contact.");
      break;
    case "games":
      lines.push("The arcade shelf keeps old installs and score cards within reach.");
      break;
    case "lab":
      lines.push("The lab turns network work into something you can point at.");
      break;
    case "irc":
      lines.push("The channel relay is fast, sparse, and easy to memorize.");
      break;
    case "qotd":
      lines.push("The ticker has a question for anyone willing to read slowly.");
      break;
    case "zcode":
      lines.push("Parser fiction and interpreters live here in a quiet pile.");
      break;
    case "sysop":
      lines.push("Containment and sealing become possible here.");
      break;
    case "vault":
      lines.push("The vault is the calm place where phase II will eventually connect outward.");
      break;
  }

  return lines;
}

function handleInspect(session: PlaySession): string[] {
  const lines = buildRoomDetail(session.currentRoom, session);
  if (session.currentRoom === "archive" && !hasClue(session, "luna")) {
    lines.push("A second glance catches the old desktop word again: Luna.");
  }
  if (session.currentRoom === "relay") {
    lines.push("The corridor refuses shortcuts and keeps the footing fair.");
  }
  if (session.currentRoom === "games") {
    lines.push("Shareware boxes and save files make the shelf feel played in.");
  }
  if (session.currentRoom === "lab") {
    lines.push("The bench carries the smell of old drives and honest labels.");
  }
  if (session.currentRoom === "irc") {
    lines.push("Nicknames flicker through the room but the lines stay spare.");
  }
  if (session.currentRoom === "qotd") {
    lines.push("The ticker asks one question and waits patiently for an answer.");
  }
  if (session.currentRoom === "zcode") {
    lines.push("The interpreter room rewards commands that sound like intent.");
  }
  if (session.currentRoom === "mirror") {
    lines.push("Every duplicate path gets checked before it can spread.");
  }
  if (session.currentRoom === "vault" && session.solved) {
    lines.push("The vault answers with a soft click and a calmer room beyond.");
  }
  return lines;
}

function handleHistory(session: PlaySession): string[] {
  if (session.currentRoom === "desk") {
    return [
      "The shelf is across the room. Enter archive to read the history cards.",
    ];
  }

  if (session.currentRoom !== "archive") {
    return ["The archive is the place for that. It keeps the old years readable."];
  }

  addClue(session, "luna");
  HISTORY_CARDS.forEach((card) => captureHistoryNote(session, card));
  return HISTORY_CARDS.map((card) => `${card.year} | ${card.title} — ${card.body}`);
}

function handleStatus(session: PlaySession): string[] {
  return buildStatusLines(session);
}

function handleInventory(session: PlaySession): string[] {
  if (session.inventory.length === 0) {
    return ["No clues yet. The archive knows the first one."];
  }

  return [
    `Clues: ${session.inventory.join(", ")}`,
    session.solved
      ? "The hidden layer is open."
      : "One answer still needs the old shell name.",
  ];
}

function handleNotebook(session: PlaySession, rawValue: string): string[] {
  const entries = notebookEntries(session);
  if (entries.length === 0) {
    return ["Notebook is empty.", "Scan rooms, read files, trace routes, or read history."];
  }

  const detail = rawValue.trim() ? findNotebookEntry(session, rawValue) : null;
  if (rawValue.trim() && !detail) {
    return [`No notebook entry matching ${rawValue}.`];
  }

  if (detail) {
    return [
      `${detail.title} [${detail.id}]`,
      `${detail.kind} / ${getBaseRoom(detail.room).title} / ${detail.source}`,
      detail.decoded ? detail.summary : `cipher ${detail.cipher}`,
      detail.pinned ? "pinned" : "unpinned",
    ];
  }

  return [
    `Notebook entries: ${entries.length}`,
    ...entries.map((entry, index) => {
      const flags = `${entry.pinned ? "*" : " "}${entry.decoded ? "!" : " "}`;
      return `${String(index + 1).padStart(2, "0")}. ${flags} ${entry.id} | ${entry.title}`;
    }),
  ];
}

function handleDecode(session: PlaySession, rawValue: string): string[] {
  const entry = findNotebookEntry(session, rawValue);
  if (!entry) {
    return ["Usage: decode <notebook-id-or-title>."];
  }

  const stored = session.notebook[entry.id];
  if (!stored) return ["Notebook entry slipped out of range."];

  stored.decoded = true;
  addBadge(session, `decode:${stored.kind}`);
  return [
    `${stored.title}`,
    stored.summary,
    `cipher ${stored.cipher}`,
  ];
}

function handlePin(session: PlaySession, rawValue: string): string[] {
  const entry = findNotebookEntry(session, rawValue);
  if (!entry) {
    return ["Usage: pin <notebook-id-or-title>."];
  }

  const stored = session.notebook[entry.id];
  if (!stored) return ["Notebook entry slipped out of range."];

  stored.pinned = !stored.pinned;
  return [
    `${stored.pinned ? "Pinned" : "Unpinned"} ${stored.title}.`,
    stored.id,
  ];
}

function handleWhoAmI(session: PlaySession): string[] {
  return [
    `Operator: ${session.username ?? "guest"}`,
    `Session: ${session.sessionId.slice(0, 8)}`,
    `Current host: ${getBaseRoom(session.currentRoom).title}`,
    `Auth: ${session.authenticated ? "logged in" : "NLI lobby"}`,
    `Shell: ${session.shellMode}`,
    `STTY: ${session.sttyMode}`,
    `Pager: ${session.pagerEnabled ? "on" : "off"}`,
    `Logins: ${session.loginHosts.length}`,
    `Rooted: ${session.rootedRooms.length}`,
    `Current hardening: ${hardeningState(session, session.currentRoom)}`,
    `Clues: ${session.inventory.length}`,
    `Badges: ${session.badges.length}`,
    session.solved ? "Hidden layer: open" : "Hidden layer: closed",
  ];
}

function handleWho(): string[] {
  return [
    "Active operators:",
    ...ACTIVE_OPERATORS.map((name, index) => `${index + 1}. ${name}`),
  ];
}

function handleTime(): string[] {
  const nowValue = new Date();
  return [
    nowValue.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    nowValue.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  ];
}

function handleBoard(session: PlaySession): string[] {
  const room = session.currentRoom;
  if (room !== "bbs" && room !== "news") {
    return ["There is no public board in this room."];
  }
  return listMessages(buildRoom(room, session).board);
}

function handleRead(session: PlaySession, rawValue: string): string[] {
  const room = session.currentRoom;
  if (room === "mail") {
    const messages = buildRoom(room, session).inbox;
    const index = Number.parseInt(rawValue, 10);
    if (Number.isInteger(index) && messages[index - 1]) {
      captureMessageNote(session, room, messages[index - 1]);
    }
    return readMessage(messages, rawValue);
  }
  if (room === "bbs" || room === "news") {
    const messages = buildRoom(room, session).board;
    const index = Number.parseInt(rawValue, 10);
    if (Number.isInteger(index) && messages[index - 1]) {
      captureMessageNote(session, room, messages[index - 1]);
    }
    return readMessage(messages, rawValue);
  }
  return ["There is nothing to read here yet."];
}

function handlePost(session: PlaySession, rawValue: string): string[] {
  const room = session.currentRoom;
  if (room !== "bbs" && room !== "news") {
    return ["Posting only works on the board rooms."];
  }

  if (!rawValue.trim()) {
    return ["Usage: post <subject>: <body>."];
  }

  const parsed = parseSubjectBody(rawValue);
  if (!parsed.body) {
    return ["Usage: post <subject>: <body>."];
  }

  const entry = message("Boden", parsed.subject, parsed.body);
  appendBoardPost(session, room, entry);
  return [
    `Posted to ${getBaseRoom(room).title}.`,
    formatMessageHeader(entry, buildRoom(room, session).board.length - 1),
  ];
}

function handleReply(session: PlaySession, rawValue: string): string[] {
  const room = session.currentRoom;
  if (room !== "bbs" && room !== "news") {
    return ["Reply only works on the board rooms."];
  }

  const board = buildRoom(room, session).board;
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return ["Usage: reply <n>: <body>."];
  }

  const [targetRaw, ...rest] = trimmed.split(/\s+/);
  const target = Number.parseInt(targetRaw.replace(/:$/, ""), 10);
  if (!Number.isInteger(target) || target < 1 || target > board.length) {
    return [`No thread number ${targetRaw}.`];
  }

  const thread = board[target - 1];
  const bodyValue = rest.join(" ").trim();
  const parsed = bodyValue.includes(":")
    ? parseSubjectBody(bodyValue)
    : { subject: `re: ${thread.subject}`, body: bodyValue };

  if (!parsed.body) {
    return ["Usage: reply <n>: <body>."];
  }

  const entry = message("Boden", parsed.subject, parsed.body);
  appendBoardPost(session, room, entry);
  return [
    `Replied to ${thread.subject}.`,
    formatMessageHeader(entry, buildRoom(room, session).board.length - 1),
  ];
}

function handleInbox(session: PlaySession): string[] {
  if (session.currentRoom !== "mail") {
    return ["The inbox belongs in the mail room."];
  }

  return listMessages(buildRoom("mail", session).inbox);
}

function handleSend(session: PlaySession, rawValue: string): string[] {
  if (session.currentRoom !== "mail") {
    return ["Sending only works from the mail room."];
  }

  const parsed = parseRecipientMessage(rawValue);
  if (!parsed.recipient || !parsed.body) {
    return ["Usage: send <recipient> <subject>: <body>."];
  }

  const recipient = resolveRoomId(parsed.recipient) ?? parsed.recipient;
  const entry = message("Boden", parsed.subject, parsed.body);
  appendInboxMessage(session, entry);
  const recipientRoom = resolveRoomId(parsed.recipient);
  const recipientLabel = recipientRoom
    ? getBaseRoom(recipientRoom).title
    : recipient;
  return [
    `Sent to ${recipientLabel}.`,
    formatMessageHeader(entry, buildRoom("mail", session).inbox.length - 1),
  ];
}

function handleEcho(rawValue: string): string[] {
  if (!rawValue.trim()) {
    return [""];
  }
  return [rawValue];
}

function handleFortune(): string[] {
  const pick = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  return [pick];
}

function handleRun(session: PlaySession, rawValue: string): string[] {
  const target = normalizeProgramName(rawValue);
  if (!target) {
    return ["Usage: run <thing>."];
  }

  const basicRun = getBasicRunLines(session, target);
  if (basicRun) {
    addBadge(session, "basic");
    return [
      `Running ${target}.`,
      ...basicRun,
    ];
  }

  if (ZCODE_GAMES[target]) {
    addBadge(session, "zcode");
    return [
      `Running ${target}.`,
      ...ZCODE_GAMES[target].output,
    ];
  }

  return [
    `Running ${rawValue}.`,
    "No program is actually needed to keep the shell honest.",
  ];
}

function searchCorpus(session: PlaySession, term: string): string[] {
  const query = normalizeText(term);
  if (!query) {
    return ["Usage: grep <term>."];
  }

  const matches: string[] = [];
  for (const roomId of PLAY_ROOM_ORDER) {
    const room = buildRoom(roomId, session);
    const sourceParts = [
      room.title,
      room.subtitle,
      room.summary,
      room.note,
      room.aliases.join(" "),
      room.protocols.join(" "),
      ...room.files.flatMap((file) => [file.name, file.summary, file.body]),
      ...room.board.flatMap((post) => [post.author, post.subject, post.body]),
      ...room.inbox.flatMap((post) => [post.author, post.subject, post.body]),
    ];
    const hit = sourceParts.some((value) => normalizeText(value).includes(query));
    if (hit) {
      matches.push(`${room.title} matched "${term}"`);
    }
  }

  for (const card of HISTORY_CARDS) {
    if (
      normalizeText(card.year).includes(query) ||
      normalizeText(card.title).includes(query) ||
      normalizeText(card.body).includes(query)
    ) {
      matches.push(`history ${card.year}: ${card.title}`);
    }
  }

  for (const [key, entry] of Object.entries(DIRECTORY)) {
    if (
      normalizeText(key).includes(query) ||
      normalizeText(entry.title).includes(query) ||
      normalizeText(entry.role).includes(query) ||
      normalizeText(entry.note).includes(query)
    ) {
      matches.push(`${entry.title} / ${entry.role}`);
    }
  }

  return matches.length > 0 ? matches : [`No matches for ${term}.`];
}

function handlePwd(session: PlaySession): string[] {
  return [getBaseRoom(session.currentRoom).title];
}

function handleMotd(session: PlaySession): string[] {
  const room = buildRoom(session.currentRoom, session);
  return [room.note, ...buildRoomDetail(session.currentRoom, session).slice(0, 1)];
}

function handleSave(session: PlaySession): string[] {
  return [
    `Session saved: ${session.sessionId}`,
    "The shell already keeps the state server-side and on disk, so there is nothing extra to do.",
  ];
}

function handleLoad(session: PlaySession): string[] {
  return [
    `Session loaded: ${session.sessionId}`,
    "The shell state is already present on the server and can be reloaded from disk.",
  ];
}

function handleAlias(session: PlaySession): string[] {
  const room = getBaseRoom(session.currentRoom);
  return [
    `Room aliases: ${room.aliases.join(", ")}`,
    `Protocol shortcuts: ${room.protocols.join(", ")}`,
    "Common shell shortcuts: enter, connect, cd, ls, cat, trace, uupath, phonebook, hosts, board, read, post, reply, inbox, send, secure, clear, call -151.",
    "Classic shell shortcuts: ?, login, newuser, basic, monitor, usenet, zork, games, netstat, scores, badges, stty, pager, porthack, rootkit, root, audit, patch, firewall, snapshot.",
  ];
}

function handleVersion(): string[] {
  return [
    "XP Desk shell v2",
    "Nostalgic Windows-era skin, backend-authoritative state, and a command surface built for old-host culture.",
  ];
}

function handleCall(session: PlaySession, rawValue: string): string[] {
  if (!session.authenticated) {
    return ["Login first. The monitor attaches to the shell prompt."];
  }

  const normalized = normalizeText(rawValue);
  if (normalized !== "-151" && normalized !== "151" && normalized !== "monitor") {
    return ["Usage: call -151."];
  }

  session.shellMode = "monitor";
  return ["Entering monitor.", "*"];
}

function handleMonitorRegisters(session: PlaySession): string[] {
  const room = buildRoom(session.currentRoom, session);
  return [
    "A=00 X=01 Y=00 P=24 SP=FF",
    `PC=${session.currentRoom === "desk" ? "2000" : `2${room.id.length.toString().padStart(3, "0")}`}`,
    `ROOM=${room.title.toUpperCase()}`,
    `STATE=${session.solved ? "OPEN" : session.inventory[0]?.toUpperCase() ?? "IDLE"}`,
  ];
}

function handleMonitorDump(session: PlaySession, rawValue: string): string[] {
  const room = buildRoom(session.currentRoom, session);
  const anchor = rawValue.trim().toUpperCase() || "2000";
  const payload = [
    room.title,
    room.summary,
    room.note,
    session.username ?? "guest",
    session.solved ? "vault open" : "vault closed",
  ].join(" | ");
  const bytes = Array.from(payload.toUpperCase()).map((char) =>
    char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"),
  );

  return [
    `D ${anchor}`,
    `2000  ${bytes.slice(0, 8).join(" ")}`,
    `2010  ${bytes.slice(8, 16).join(" ")}`,
    `2020  ${bytes.slice(16, 24).join(" ")}`,
    `2030  ${bytes.slice(24, 32).join(" ")}`,
  ];
}

function handleMonitorListing(session: PlaySession, rawValue: string): string[] {
  const room = buildRoom(session.currentRoom, session);
  const anchor = rawValue.trim().toUpperCase() || room.id.toUpperCase();
  return [
    `L ${anchor}`,
    `0000  JSR ${room.title.toUpperCase()}`,
    `0003  JSR ${session.authenticated ? "AUTH" : "LOGIN"}`,
    `0006  JSR ${session.shellMode === "monitor" ? "MON" : "NEXT"}`,
    "0009  RTS",
  ];
}

function handleMonitorCommand(session: PlaySession, verb: string, restValue: string): string[] {
  switch (verb) {
    case "?":
    case "help":
      return [
        "Monitor commands:",
        "  d [addr]   dump the current synthetic memory",
        "  l [addr]   list the current synthetic code",
        "  r          show the register pane",
        "  g [addr]   resume the shell",
        "  quit/exit  return to the shell",
      ];
    case "d":
      return handleMonitorDump(session, restValue);
    case "l":
      return handleMonitorListing(session, restValue);
    case "r":
      return handleMonitorRegisters(session);
    case "g":
      session.shellMode = "shell";
      return [
        restValue ? `Run ${restValue}.` : "Run complete.",
        "Returning to the shell.",
      ];
    case "quit":
    case "exit":
      session.shellMode = "shell";
      return ["Exit monitor.", "The shell returns to @ mode."];
    default:
      session.invalidAttempts += 1;
      return [
        `Unknown monitor command: ${verb}`,
        "Type ? or help for the monitor commands.",
      ];
  }
}

function normalizeProgramName(rawValue: string): string {
  return rawValue.trim().toLowerCase();
}

function listBasicPrograms(session: PlaySession): string[] {
  const savedNames = Object.keys(session.basicPrograms).sort();
  const names = [...Object.keys(BASIC_PROGRAMS), ...savedNames];
  return Array.from(new Set(names)).sort();
}

function formatBasicListing(program: BasicProgram): string[] {
  return [
    `Classic BASIC program: ${program.title}`,
    `Description: ${program.description}`,
    ...program.lines,
  ];
}

function getBasicSource(session: PlaySession, name: string): string[] | null {
  return session.basicPrograms[name] ?? BASIC_PROGRAMS[name]?.lines ?? null;
}

function getBasicDescription(session: PlaySession, name: string): string {
  return BASIC_PROGRAMS[name]?.description ?? "User saved program.";
}

function getBasicRunLines(session: PlaySession, name: string): string[] | null {
  return BASIC_PROGRAMS[name]?.run ?? getBasicSource(session, name);
}

function handleBasicEntry(session: PlaySession): string[] {
  if (!session.authenticated) {
    return ["Login first. The BASIC interpreter hangs off the shell prompt."];
  }

  session.shellMode = "basic";
  session.basicProgram = null;
  return [
    "Classic BASIC interpreter ready.",
    ">",
  ];
}

function handleBasicHelp(): string[] {
  return [
    "Command, one of the following:",
    "  delete  dir     help    list    load    quit    run     renumber",
    "  save",
  ];
}

function handleBasicList(session: PlaySession): string[] {
  if (!session.basicProgram) {
    return ["No program in memory."];
  }

  const source = getBasicSource(session, session.basicProgram);

  if (!source || source.length === 0) {
    return [`Program ${session.basicProgram} is empty.`];
  }

  return [
    `Listing ${session.basicProgram}:`,
    ...source.map((line, index) => `${String((index + 1) * 10).padStart(4, " ")}  ${line}`),
  ];
}

function handleBasicDir(session: PlaySession): string[] {
  return [
    "BASIC programs:",
    ...listBasicPrograms(session).map((name) => {
      const description = getBasicDescription(session, name);
      return `- ${name} | ${description}`;
    }),
  ];
}

function handleBasicLoad(session: PlaySession, rawValue: string): string[] {
  const file = normalizeProgramName(rawValue);
  if (!file) {
    return ["Usage: load <file>."];
  }

  const source = getBasicSource(session, file);
  if (!source) {
    return [`No BASIC program named ${file}.`];
  }

  session.basicProgram = file;
  const header = BASIC_PROGRAMS[file]
    ? formatBasicListing(BASIC_PROGRAMS[file])
    : [`Classic BASIC program: ${file}`, "Description: User saved program.", ...source];
  return ["Ok", ...header];
}

function handleBasicSave(session: PlaySession, rawValue: string): string[] {
  const file = normalizeProgramName(rawValue);
  if (!file) {
    return ["Usage: save <file>."];
  }

  if (!session.basicProgram) {
    return ["No program in memory to save."];
  }

  const source = getBasicSource(session, session.basicProgram);
  if (!source) {
    return [`No BASIC program named ${session.basicProgram}.`];
  }

  session.basicPrograms[file] = [...source];
  return [`Saved ${file}.`, `Program copied from ${session.basicProgram}.`];
}

function handleBasicDelete(session: PlaySession, rawValue: string): string[] {
  const file = normalizeProgramName(rawValue);
  if (!file) {
    return ["Usage: delete <file>."];
  }

  if (!session.basicPrograms[file]) {
    return [`No saved program named ${file}.`];
  }

  delete session.basicPrograms[file];
  if (session.basicProgram === file) {
    session.basicProgram = null;
  }
  return [`Deleted ${file}.`];
}

function handleBasicRenumber(rawValue: string): string[] {
  const trimmed = normalizeText(rawValue);
  return trimmed
    ? [`Renumbered program with start/inc ${trimmed}.`]
    : ["Renumbered program in memory."];
}

function handleBasicRun(session: PlaySession, rawValue: string): string[] {
  const requested = normalizeProgramName(rawValue);
  const file = requested || session.basicProgram;
  if (!file) {
    return ["Usage: run <program>."];
  }

  const runLines = getBasicRunLines(session, file);
  if (!runLines) {
    return [`No BASIC program named ${file}.`];
  }

  session.basicProgram = file;
  return [
    `Running ${file}.`,
    ...runLines,
  ];
}

function handleBasicCommand(session: PlaySession, verb: string, restValue: string): string[] {
  switch (verb) {
    case "?":
    case "help":
      return handleBasicHelp();
    case "dir":
      return handleBasicDir(session);
    case "list":
      return handleBasicList(session);
    case "load":
      return handleBasicLoad(session, restValue);
    case "save":
      return handleBasicSave(session, restValue);
    case "delete":
      return handleBasicDelete(session, restValue);
    case "renumber":
      return handleBasicRenumber(restValue);
    case "run":
      return handleBasicRun(session, restValue);
    case "quit":
    case "exit":
      session.shellMode = "shell";
      return ["Exit BASIC.", "The shell returns to @ mode."];
    default:
      session.invalidAttempts += 1;
      return [
        `Unknown BASIC command: ${verb}`,
        "Type ? or help for the interpreter commands.",
      ];
  }
}

function handleUsenet(session: PlaySession): string[] {
  return [
    "USENET archive:",
    "Use read, post, and reply in the news room for bulletin traffic.",
    "The archive keeps the slower history, and the wire keeps the current thread.",
    ...buildRoomDetail("news", session).slice(0, 1),
  ];
}

function handleGamesCommand(session: PlaySession): string[] {
  return [
    "Z-Code shelf:",
    ...Object.entries(ZCODE_GAMES).map(([name, game]) => `- ${name} | ${game.title} | ${game.description}`),
  ];
}

function handleZCodeLaunch(session: PlaySession, rawValue: string): string[] {
  const requested = normalizeProgramName(rawValue);
  const file = requested || "zork.gam";
  const game = ZCODE_GAMES[file];
  if (!game) {
    return [`No Z-Code game named ${file}.`, "Try games for the shelf list."];
  }

  addBadge(session, "zcode");
  return [
    `Running ${file}.`,
    ...game.output,
  ];
}

function handleUuPath(session: PlaySession, rawValue: string): string[] {
  return handleTrace(session, rawValue);
}

function handleUuMap(session: PlaySession): string[] {
  return handleNetstat(session);
}

function handleDial(session: PlaySession, rawValue: string): string[] {
  const normalized = normalizeText(rawValue);
  if (!normalized) {
    return ["Usage: dial <host-or-number>."];
  }

  const host = resolveRoomId(normalized);
  if (host) {
    return [
      `dialing ${getBaseRoom(host).title}`,
      ...handleMove(session, host),
    ];
  }

  return [
    `dialing ${normalized}`,
    "Connected to a calm echo of the line.",
  ];
}

function handleSolve(session: PlaySession, rawValue: string): string[] {
  const answer = normalizeText(rawValue);
  if (!answer) {
    return ["Type solve <phrase>."];
  }

  if (answer !== "luna") {
    session.invalidAttempts += 1;
    adjustPressure(session, session.currentRoom, 1, "bad solve");
    return [
      "That does not line up with the archive.",
      "The room wants the old shell name, not a guess.",
    ];
  }

  session.solved = true;
  addDiscovery(session, "vault");
  addClue(session, "vault-key");
  addBadge(session, "solver");
  return [
    "The hidden layer opens.",
    "The archive, relay, and mirror can now be sealed in the right order.",
  ];
}

function handleSecure(session: PlaySession): string[] {
  if (session.currentRoom === "desk") {
    return ["The desktop is already braced."];
  }

  if (session.currentRoom === "vault" && !session.solved) {
    return ["The vault is not ready yet."];
  }

  const denied = canSealCurrentHost(session);
  if (denied) return denied;

  addSecure(session, session.currentRoom);
  reduceCurrentPressure(session, 5, "sealed");
  addBadge(session, `seal:${session.currentRoom}`);
  return [
    `${getBaseRoom(session.currentRoom).title} is sealed.`,
    "Foothold, root, audit, patch, firewall, and snapshot are all recorded server-side.",
  ];
}

function handleTakeover(session: PlaySession): string[] {
  if (session.currentRoom === "desk") {
    return ["The desktop is already under control."];
  }

  if (session.currentRoom === "vault" && !session.solved) {
    return ["The vault will not accept takeover until the shell name is solved."];
  }

  return handleSecure(session);
}

function handleMove(session: PlaySession, value: string): string[] {
  const roomId = resolveRoomId(value);
  if (!roomId) {
    session.invalidAttempts += 1;
    return [
      `Unknown host: ${value}. Try desktop, archive, phonebook, bbs, ftp, gopher, news, mail, games, lab, irc, relay, mirror, sysop, or vault.`,
    ];
  }

  if (roomId === "vault" && !session.solved) {
    return ["The vault stays locked until the old shell name is solved."];
  }

  if (!isVisibleInDirectory(session, roomId)) {
    return ["That host is not in the public map yet."];
  }

  if (!isAdjacentHost(session.currentRoom, roomId) && session.currentRoom !== roomId) {
    if (currentLaneLocked(session)) {
      return [
        `${getBaseRoom(session.currentRoom).title} is saturated.`,
        "Move through a named neighboring host or brace the lane before taking a longer route.",
      ];
    }

    const route = findVisibleRoute(session, session.currentRoom, roomId);
    if (!route || route.length < 2) {
      return [`No visible route to ${getBaseRoom(roomId).title}.`];
    }

    rememberRoute(session, roomId, route);
    adjustPressure(session, session.currentRoom, 1, "long route");
    const nextHop = route[1]!;
    pushRoom(session, nextHop);
    clearPager(session);
    addDiscovery(session, nextHop);
    const hopRoom = buildRoom(nextHop, session);
    return [
      `Route recorded to ${getBaseRoom(roomId).title}.`,
      `Advanced one hop to ${hopRoom.title}.`,
      ...buildRoomDetail(nextHop, session).slice(0, 2),
    ];
  }

  const previousRoom = session.currentRoom;
  pushRoom(session, roomId);
  clearPager(session);
  addDiscovery(session, roomId);
  rememberRoute(session, roomId, [previousRoom, roomId]);
  if (previousRoom !== roomId) {
    adjustPressure(session, previousRoom, -1, "clean hop");
  }
  const room = buildRoom(roomId, session);
  const detail = buildRoomDetail(roomId, session);
  const lines = [`Moved to ${room.title}.`, ...detail];

  if (roomId === "archive" && !hasClue(session, "luna")) {
    lines.push("The first shelf is the important one.");
  }

  return lines;
}

function handleProtocolConnect(
  session: PlaySession,
  verb: string,
  rawValue: string,
): string[] {
  const target = rawValue ? resolveRoomId(rawValue) : DEFAULT_PROTOCOL_TARGETS[verb];
  if (!target) {
    return [`Usage: ${verb} <host>.`, "Try phonebook for the available hosts."];
  }
  const lines = [`${verb.toUpperCase()} ${getBaseRoom(target).title}`];
  lines.push(...handleMove(session, target));
  return lines;
}

function handleLs(session: PlaySession, rawValue: string): string[] {
  const targetRoom = rawValue ? resolveRoomContext(rawValue, session.currentRoom) : session.currentRoom;
  const room = buildRoom(targetRoom, session);
  return [
    `${room.title}:`,
    ...listVisibleFiles(room, session),
  ];
}

function handleCat(session: PlaySession, rawValue: string): string[] {
  if (!rawValue) {
    return ["Usage: cat <file> or cat <host>/<file>."];
  }

  const { host, file } = parseHostAndFile(rawValue, session.currentRoom);
  const room = buildRoom(host, session);
  const target = findFileOnRoom(room, file, session);

  if (!target) {
    return [`No readable file named ${file} on ${room.title}.`];
  }

  if (target.hidden && host === "archive" && !hasClue(session, "luna")) {
    return ["The file is hidden until the archive clue is collected."];
  }

  if (target.hidden && host === "vault" && !session.solved) {
    return ["The vault keeps that file tucked away until the shell name is solved."];
  }

  captureFileNote(session, host, target);
  return [`${target.name}`, target.summary, target.body];
}

function handleTrace(session: PlaySession, rawValue: string): string[] {
  const target = rawValue ? resolveRoomId(rawValue) : session.currentRoom;
  if (!target) {
    return ["Usage: trace <host>."];
  }
  if (!isVisibleInDirectory(session, target)) {
    return ["That host is not in the public map yet."];
  }
  reduceCurrentPressure(session, 1, "trace");
  return buildRouteLines(session, session.currentRoom, target);
}

function handleBrace(session: PlaySession): string[] {
  const pressure = reduceCurrentPressure(session, 2, "brace");
  setGrace(session, session.currentRoom, 2);
  addBadge(session, `brace:${session.currentRoom}`);
  return [
    `${getBaseRoom(session.currentRoom).title} steadied.`,
    `Pressure is now ${pressureState(pressure.level)} (${pressure.level}/5).`,
    "The lane has a short grace window.",
  ];
}

function handleClear(session: PlaySession): string[] {
  clearPager(session);
  session.transcript = [
    line("system", "Screen cleared."),
    line("system", "The desktop is still listening."),
  ];
  return ["Screen cleared."];
}

function handleGlitch(session: PlaySession): string[] {
  const pick = GLITCH_LINES[session.invalidAttempts % GLITCH_LINES.length];
  return [pick];
}

function handleUptime(session: PlaySession): string[] {
  return [
    `session uptime: ${secondsSince(session.createdAt)}s`,
    `current host: ${getBaseRoom(session.currentRoom).title}`,
    `secured hosts: ${session.securedRooms.length}`,
  ];
}

function handleBack(session: PlaySession): string[] {
  const previous = popRoom(session);
  clearPager(session);
  const room = buildRoom(previous, session);
  return [
    `Returned to ${room.title}.`,
    ...buildRoomDetail(previous, session).slice(0, 2),
  ];
}

function handlePhonebook(session: PlaySession): string[] {
  return buildPhonebookLines(session);
}

function handleMan(topic: string): string[] {
  if (!topic.trim()) {
    return HELP_LINES;
  }
  return buildDirectoryHelp(topic);
}

function handleUnknown(session: PlaySession, verbRaw: string): string[] {
  session.invalidAttempts += 1;
  adjustPressure(session, session.currentRoom, 1, "unknown command");
  const lines = [
    `Unknown command: ${verbRaw}`,
    "Type help, phonebook, or enter archive to begin moving.",
  ];
  if (session.invalidAttempts % 3 === 0) {
    lines.push(GLITCH_LINES[session.invalidAttempts % GLITCH_LINES.length]);
  }
  return lines;
}

export function createSession(sessionId: string = randomUUID()): PlaySession {
  const boards: Partial<Record<PlayRoomId, PlayMessage[]>> = {};
  for (const roomId of PLAY_ROOM_ORDER) {
    boards[roomId] = [];
  }

  const session: PlaySession = {
    sessionId,
    createdAt: now(),
    updatedAt: now(),
    authenticated: false,
    username: null,
    shellMode: "nli",
    sttyMode: "tty",
    pagerEnabled: true,
    pagerLines: null,
    pagerOffset: 0,
    roomStack: [],
    currentRoom: "desk",
    solved: false,
    inventory: [],
    badges: [],
    loginHosts: [],
    rootedRooms: [],
    discoveredRooms: PLAY_ROOM_ORDER.filter((roomId) => !isHiddenSeedRoom(roomId)),
    securedRooms: ["desk"],
    hardening: {},
    knownRoutes: {},
    hostPressure: {},
    notebook: {},
    operations: {},
    replicas: {},
    briefs: {},
    daemons: {},
    incidents: {},
    waypoints: {},
    meshStabilized: false,
    trustLinks: {},
    services: {},
    runbooks: {},
    sectors: {},
    accord: null,
    presence: {},
    anomalies: {},
    anchors: {},
    circuits: {},
    ledger: {
      balance: 0,
      earned: 0,
      spent: 0,
      updatedAtCommand: 0,
    },
    boards,
    inbox: [],
    basicProgram: null,
    basicPrograms: {},
    transcript: [
      line("system", "Boot sequence complete."),
      line("system", "The desktop is ready. Type help to see the available moves."),
    ],
    invalidAttempts: 0,
    commandCount: 0,
  };
  return session;
}

export function cloneSession(session: PlaySession): PlaySession {
  return {
    ...session,
    inventory: [...session.inventory],
    badges: [...session.badges],
    loginHosts: [...session.loginHosts],
    rootedRooms: [...(session.rootedRooms ?? [])],
    pagerLines: session.pagerLines ? [...session.pagerLines] : null,
    pagerOffset: session.pagerOffset,
    roomStack: [...session.roomStack],
    discoveredRooms: [...session.discoveredRooms],
    securedRooms: [...session.securedRooms],
    hardening: Object.fromEntries(
      Object.entries(session.hardening ?? {}).map(([roomId, entry]) => [
        roomId,
        { ...entry },
      ]),
    ) as Partial<Record<PlayRoomId, HostHardening>>,
    knownRoutes: Object.fromEntries(
      Object.entries(session.knownRoutes ?? {}).map(([roomId, hops]) => [
        roomId,
        [...(hops ?? [])],
      ]),
    ) as Partial<Record<PlayRoomId, PlayRoomId[]>>,
    hostPressure: Object.fromEntries(
      Object.entries(session.hostPressure ?? {}).map(([roomId, pressure]) => [
        roomId,
        { ...pressure },
      ]),
    ) as Partial<Record<PlayRoomId, HostPressure>>,
    notebook: Object.fromEntries(
      Object.entries(session.notebook ?? {}).map(([id, entry]) => [
        id,
        { ...entry },
      ]),
    ),
    operations: Object.fromEntries(
      Object.entries(session.operations ?? {}).map(([id, operation]) => [
        id,
        { ...operation },
      ]),
    ),
    replicas: Object.fromEntries(
      Object.entries(session.replicas ?? {}).map(([roomId, replica]) => [
        roomId,
        replica ? { ...replica } : replica,
      ]),
    ) as Partial<Record<PlayRoomId, StoredReplica>>,
    briefs: Object.fromEntries(
      Object.entries(session.briefs ?? {}).map(([id, brief]) => [
        id,
        { ...brief },
      ]),
    ),
    daemons: Object.fromEntries(
      Object.entries(session.daemons ?? {}).map(([roomId, daemon]) => [
        roomId,
        daemon ? { ...daemon } : daemon,
      ]),
    ) as Partial<Record<PlayRoomId, StoredDaemon>>,
    incidents: Object.fromEntries(
      Object.entries(session.incidents ?? {}).map(([id, incident]) => [
        id,
        { ...incident },
      ]),
    ),
    waypoints: Object.fromEntries(
      Object.entries(session.waypoints ?? {}).map(([roomId, waypoint]) => [
        roomId,
        waypoint ? { ...waypoint, hops: [...waypoint.hops] } : waypoint,
      ]),
    ) as Partial<Record<PlayRoomId, StoredWaypoint>>,
    meshStabilized: Boolean(session.meshStabilized),
    trustLinks: Object.fromEntries(
      Object.entries(session.trustLinks ?? {}).map(([id, link]) => [
        id,
        link ? { ...link, endpoints: [...link.endpoints] as [PlayRoomId, PlayRoomId] } : link,
      ]),
    ),
    services: Object.fromEntries(
      Object.entries(session.services ?? {}).map(([roomId, service]) => [
        roomId,
        service ? { ...service } : service,
      ]),
    ) as Partial<Record<PlayRoomId, StoredService>>,
    runbooks: Object.fromEntries(
      Object.entries(session.runbooks ?? {}).map(([roomId, runbook]) => [
        roomId,
        runbook ? { ...runbook, steps: [...runbook.steps] } : runbook,
      ]),
    ) as Partial<Record<PlayRoomId, StoredRunbook>>,
    sectors: Object.fromEntries(
      Object.entries(session.sectors ?? {}).map(([id, sector]) => [
        id,
        { ...sector },
      ]),
    ),
    accord: session.accord ? { ...session.accord } : null,
    presence: Object.fromEntries(
      Object.entries(session.presence ?? {}).map(([id, presence]) => [
        id,
        { ...presence },
      ]),
    ),
    anomalies: Object.fromEntries(
      Object.entries(session.anomalies ?? {}).map(([id, anomaly]) => [
        id,
        { ...anomaly },
      ]),
    ),
    anchors: Object.fromEntries(
      Object.entries(session.anchors ?? {}).map(([id, anchor]) => [
        id,
        { ...anchor },
      ]),
    ),
    circuits: Object.fromEntries(
      Object.entries(session.circuits ?? {}).map(([id, circuit]) => [
        id,
        { ...circuit, stops: [...circuit.stops] },
      ]),
    ),
    basicPrograms: Object.fromEntries(
      Object.entries(session.basicPrograms)
        .filter((entry): entry is [string, string[]] => Array.isArray(entry[1]))
        .map(([name, lines]) => [name, [...lines]]),
    ) as Partial<Record<string, string[]>>,
    boards: Object.fromEntries(
      Object.entries(session.boards).map(([roomId, messages]) => [
        roomId,
        cloneMessages(messages ?? []),
      ]),
    ) as Partial<Record<PlayRoomId, PlayMessage[]>>,
    inbox: cloneMessages(session.inbox),
    transcript: session.transcript.map((entry) => ({ ...entry })),
  };
}

export function buildSnapshot(session: PlaySession): PlaySnapshot {
  const currentRoom = buildRoom(session.currentRoom, session);
  const rooms = PLAY_ROOM_ORDER.map((roomId) => buildRoom(roomId, session));
  const pager = pagerState(session);

  return {
    sessionId: session.sessionId,
    title: "XP Desk",
    subtitle: session.solved
      ? "The hidden layer has been opened"
      : "A calm Windows-era desktop with a few locked rooms",
    prompt: getShellPrompt(session),
    authenticated: session.authenticated,
    username: session.username,
    sttyMode: session.sttyMode,
    pagerEnabled: session.pagerEnabled,
    pagerPending: pager.pending,
    pagerPage: pager.page,
    pagerTotal: pager.total ? Math.max(1, Math.ceil(pager.total / PAGER_PAGE_SIZE)) : 0,
    badges: [...session.badges],
    currentRoom,
    rooms,
    hosts: buildHosts(session),
    files: currentRoom.files,
    board: currentRoom.board,
    inbox: currentRoom.inbox,
    inventory: [...session.inventory],
    routes: buildKnownRoutes(session),
    pressure: pressureReport(session),
    notebook: notebookEntries(session),
    operations: operationEntries(session),
    replicas: replicaEntries(session),
    briefs: briefEntries(session),
    daemons: daemonEntries(session),
    incidents: incidentEntries(session),
    waypoints: waypointEntries(session),
    mesh: meshState(session),
    trustLinks: trustLinkEntries(session),
    services: serviceEntries(session),
    runbooks: runbookEntries(session),
    sectors: sectorEntries(session),
    accord: accordState(session),
    presence: visiblePresenceEntries(session),
    anomalies: anomalyEntries(session),
    anchors: anchorEntries(session),
    circuits: circuitEntries(session),
    ledger: ledgerState(session),
    transcript: session.transcript.map((entry) => ({ ...entry })),
    history: HISTORY_CARDS,
    tips: [
      "Use phonebook to see the network.",
      "Read archive before trying to solve the hidden layer.",
      "ls and cat work on the current host or host/file paths.",
      "read, post, reply, inbox, and send handle the board and mailbox rooms.",
      "call -151 drops into a low-level monitor for the current host.",
      "Some routes are fenced off on purpose.",
    ],
    solved: session.solved,
    invalidAttempts: session.invalidAttempts,
    commandCount: session.commandCount,
  };
}

function handleScanAndMaybeClue(session: PlaySession): string[] {
  const room = buildRoom(session.currentRoom, session);
  const lines = handleScan(session);

  if (room.id === "archive" && !hasClue(session, "luna")) {
    addClue(session, "luna");
  }

  return lines;
}

export function applyCommand(
  session: PlaySession,
  rawCommand: string,
): PlayCommandOutcome {
  const commandText = rawCommand.trim();
  if (!commandText) {
    return {
      snapshot: buildSnapshot(session),
      reply: ["Type help to see the room."],
    };
  }

  session.commandCount += 1;
  pushResponse(session, "user", `> ${commandText}`);

  const [verbRaw, ...rest] = commandText.split(/\s+/);
  const verb = normalizeText(verbRaw) || verbRaw;
  const restValue = rest.join(" ").trim();

  let replies: string[] = [];
  let glitch = false;
  let handledByPager = false;
  const operationReplies = tickOperations(session);
  const daemonReplies = tickDaemons(session);
  const linkReplies = tickTrustLinks(session);
  const serviceReplies = tickServices(session);

  if (session.pagerLines) {
    const pagerReplies = continuePager(session, commandText);
    if (pagerReplies) {
      replies = pagerReplies;
      handledByPager = true;
    } else {
      clearPager(session);
    }
  }

  if (!handledByPager) {
    if (session.shellMode === "monitor") {
      replies = handleMonitorCommand(session, verb, restValue);
      replies = [...operationReplies, ...daemonReplies, ...linkReplies, ...serviceReplies, ...replies];
      replies = paginateReplies(session, replies);
      replies.forEach((reply) => pushResponse(session, "response", reply));
      session.updatedAt = now();

      const snapshot = buildSnapshot(session);
      return { snapshot, reply: replies, glitch };
    }

    if (session.shellMode === "basic") {
      replies = handleBasicCommand(session, verb, restValue);
      replies = [...operationReplies, ...daemonReplies, ...linkReplies, ...serviceReplies, ...replies];
      replies = paginateReplies(session, replies);
      replies.forEach((reply) => pushResponse(session, "response", reply));
      session.updatedAt = now();

      const snapshot = buildSnapshot(session);
      return { snapshot, reply: replies, glitch };
    }

    switch (verb) {
    case "?":
      replies = HELP_LINES;
      break;
    case "help":
      replies = restValue ? buildDirectoryHelp(restValue) : HELP_LINES;
      break;
    case "man":
      replies = handleMan(restValue);
      break;
    case "login":
      replies = handleLogin(session, restValue, false);
      break;
    case "newuser":
      replies = handleLogin(session, restValue, true);
      break;
    case "call":
      replies = handleCall(session, restValue);
      break;
    case "netstat":
    case "hosts":
      replies = handleNetstat(session);
      break;
    case "scores":
    case "badges":
      replies = handleScores(session);
      break;
    case "stty":
      replies = handleStty(session, restValue);
      break;
    case "pager":
      replies = handlePager(session, restValue);
      break;
    case "wardial":
      replies = handleWardial(session);
      break;
    case "porthack":
      replies = handlePorthack(session, restValue);
      break;
    case "op":
    case "operation":
      replies = handleOperation(session, restValue);
      break;
    case "jobs":
    case "ops":
      replies = handleJobs(session);
      break;
    case "deploy":
      replies = handleDeploy(session);
      break;
    case "sync":
      replies = handleSync(session);
      break;
    case "replicas":
    case "copies":
      replies = handleReplicas(session);
      break;
    case "watch":
    case "daemons":
      replies = handleWatch(session);
      break;
    case "maintain":
      replies = handleMaintain(session, restValue);
      break;
    case "rotate":
      replies = handleRotate(session, restValue);
      break;
    case "incidents":
      replies = handleIncidents(session);
      break;
    case "incident":
      replies = handleIncident(session, restValue);
      break;
    case "triage":
      replies = handleTriage(session, restValue);
      break;
    case "restore-node":
      replies = handleRestoreNode(session, restValue);
      break;
    case "mark":
      replies = handleMark(session, restValue);
      break;
    case "marks":
      replies = handleMarks(session);
      break;
    case "jump":
      replies = handleJump(session, restValue);
      break;
    case "link":
      replies = handleLink(session, restValue);
      break;
    case "links":
      replies = handleLinks(session);
      break;
    case "rekey":
      replies = handleRekey(session, restValue);
      break;
    case "install":
      replies = handleInstallService(session);
      break;
    case "services":
      replies = handleServices(session);
      break;
    case "service":
      replies = handleService(session, restValue);
      break;
    case "repair-service":
      replies = handleRepairService(session, restValue);
      break;
    case "compile":
      replies = handleCompileRunbook(session);
      break;
    case "runbooks":
      replies = handleRunbooks(session);
      break;
    case "runbook":
      replies = handleRunbook(session, restValue);
      break;
    case "sectors":
      replies = handleSectors(session);
      break;
    case "sector":
      replies = handleSector(session, restValue);
      break;
    case "claim-sector":
      replies = handleClaimSector(session, restValue);
      break;
    case "sweep-sector":
      replies = handleSweepSector(session, restValue);
      break;
    case "mesh":
    case "resilience":
      replies = handleMesh(session);
      break;
    case "stabilize":
      replies = handleStabilize(session);
      break;
    case "accord":
      replies = handleAccord(session);
      break;
    case "attune":
      replies = handleAttune(session);
      break;
    case "roster":
    case "buddies":
      replies = handleRoster(session);
      break;
    case "buddy":
      replies = handleBuddy(session, restValue);
      break;
    case "page":
      replies = handlePagePresence(session, restValue);
      break;
    case "assign":
      replies = handleAssignPresence(session, restValue);
      break;
    case "folds":
      replies = handleFolds(session);
      break;
    case "fold":
      replies = handleFold(session, restValue);
      break;
    case "smooth":
      replies = handleSmooth(session, restValue);
      break;
    case "anchors":
      replies = handleAnchors(session);
      break;
    case "anchor":
      replies = handleAnchor(session, restValue);
      break;
    case "plant-anchor":
      replies = handlePlantAnchor(session, restValue);
      break;
    case "pulse-anchor":
      replies = handlePulseAnchor(session, restValue);
      break;
    case "circuits":
      replies = handleCircuits(session);
      break;
    case "circuit":
      replies = handleCircuit(session, restValue);
      break;
    case "map-circuit":
      replies = handleMapCircuit(session, restValue);
      break;
    case "ride-circuit":
      replies = handleRideCircuit(session, restValue);
      break;
    case "briefs":
      replies = handleBriefs(session);
      break;
    case "brief":
      replies = handleBrief(session, restValue);
      break;
    case "accept":
      replies = handleAcceptBrief(session, restValue);
      break;
    case "submit":
      replies = handleSubmitBrief(session, restValue);
      break;
    case "root":
    case "rootkit":
      replies = handleRoot(session, restValue);
      break;
    case "audit":
      replies = handleAudit(session);
      break;
    case "patch":
      replies = handlePatch(session);
      break;
    case "firewall":
      replies = handleFirewall(session);
      break;
    case "snapshot":
      replies = handleSnapshotHost(session);
      break;
    case "restore":
      replies = handleRestoreHost(session);
      break;
    case "brace":
      replies = handleBrace(session);
      break;
    case "basic":
      replies = handleBasicEntry(session);
      break;
    case "monitor":
      replies = handleCall(session, "-151");
      break;
    case "phonebook":
    case "pb":
      replies = handlePhonebook(session);
      break;
    case "look":
      replies = [buildRoom(session.currentRoom, session).summary];
      replies.push(...buildRoomDetail(session.currentRoom, session));
      break;
    case "scan":
      replies = handleScanAndMaybeClue(session);
      break;
    case "history":
      replies = handleHistory(session);
      break;
    case "today":
      replies = buildTodayLines(session);
      break;
    case "inspect":
      replies = handleInspect(session);
      break;
    case "status":
      replies = handleStatus(session);
      break;
    case "who":
      replies = handleWho();
      break;
    case "users":
      replies = handleWho();
      break;
    case "time":
    case "date":
      replies = handleTime();
      break;
    case "uptime":
      replies = handleUptime(session);
      break;
    case "inventory":
      replies = handleInventory(session);
      break;
    case "notebook":
    case "notes":
      replies = handleNotebook(session, restValue);
      break;
    case "decode":
      replies = handleDecode(session, restValue);
      break;
    case "pin":
      replies = handlePin(session, restValue);
      break;
    case "whoami":
      replies = handleWhoAmI(session);
      break;
    case "whois":
      replies = buildWhoisLines(session, restValue);
      break;
    case "finger":
      replies = buildWhoisLines(session, restValue, false);
      break;
    case "pwd":
      replies = handlePwd(session);
      break;
    case "motd":
      replies = handleMotd(session);
      break;
    case "alias":
      replies = handleAlias(session);
      break;
    case "ver":
      replies = handleVersion();
      break;
    case "enter":
    case "connect":
    case "cd":
    case "open":
      replies = handleMove(session, restValue);
      break;
    case "telnet":
    case "ssh":
    case "rlogin":
    case "bbs":
    case "ftp":
    case "gopher":
    case "news":
    case "mail":
    case "game":
    case "irc":
    case "qotd":
    case "zcode":
      replies = handleProtocolConnect(session, verb, restValue);
      break;
    case "usenet":
      replies = handleUsenet(session);
      break;
    case "games":
      replies = handleGamesCommand(session);
      break;
    case "zork":
    case "zc":
    case "zrun":
      replies = handleZCodeLaunch(session, restValue);
      break;
    case "uupath":
      replies = handleUuPath(session, restValue);
      break;
    case "uumap":
      replies = handleUuMap(session);
      break;
    case "dial":
      replies = handleDial(session, restValue);
      break;
    case "ls":
    case "dir":
      replies = handleLs(session, restValue);
      break;
    case "board":
      replies = handleBoard(session);
      break;
    case "read":
      replies = handleRead(session, restValue);
      break;
    case "post":
      replies = handlePost(session, restValue);
      break;
    case "reply":
      replies = handleReply(session, restValue);
      break;
    case "inbox":
      replies = handleInbox(session);
      break;
    case "send":
      replies = handleSend(session, restValue);
      break;
    case "cat":
    case "type":
    case "more":
      replies = handleCat(session, restValue);
      break;
    case "grep":
    case "find":
      replies = searchCorpus(session, restValue);
      break;
    case "trace":
    case "traceroute":
      replies = handleTrace(session, restValue);
      break;
    case "solve":
      replies = handleSolve(session, restValue);
      break;
    case "secure":
      replies = handleSecure(session);
      break;
    case "takeover":
      replies = handleTakeover(session);
      break;
    case "save":
      replies = handleSave(session);
      break;
    case "load":
      replies = handleLoad(session);
      break;
    case "echo":
    case "say":
      replies = handleEcho(restValue);
      break;
    case "fortune":
      replies = handleFortune();
      break;
    case "run":
      replies = handleRun(session, restValue);
      break;
    case "clear":
    case "cls":
      replies = handleClear(session);
      break;
    case "camp":
      session.invalidAttempts += 1;
      adjustPressure(session, session.currentRoom, 2, "repeat-start refused");
      replies = [
        "Repeat-start pressure is refused.",
        "Fresh arrivals get a grace window so the room cannot be pinned down.",
      ];
      break;
    case "tunnel":
      session.invalidAttempts += 1;
      adjustPressure(session, session.currentRoom, 2, "side-channel refused");
      replies = [
        "Side-channel shortcuts are refused.",
        "The named lanes stay visible so routes can be audited and recovered.",
      ];
      break;
    case "glitch":
      replies = handleGlitch(session);
      glitch = true;
      break;
    case "back":
    case "exit":
    case "quit":
      replies = handleBack(session);
      break;
    case "logout":
      replies = handleLogout(session);
      break;
    default:
      replies = handleUnknown(session, verbRaw);
      if (session.invalidAttempts % 3 === 0) {
        glitch = true;
      }
      break;
    }
  replies = [...operationReplies, ...daemonReplies, ...linkReplies, ...serviceReplies, ...replies];
    replies = paginateReplies(session, replies);
  }

  replies.forEach((reply) => pushResponse(session, "response", reply));
  session.updatedAt = now();

  const snapshot = buildSnapshot(session);
  return { snapshot, reply: replies, glitch };
}
