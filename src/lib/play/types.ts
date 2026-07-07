export type PlayRoomId =
  | "desk"
  | "archive"
  | "relay"
  | "mirror"
  | "phonebook"
  | "bbs"
  | "ftp"
  | "gopher"
  | "news"
  | "mail"
  | "games"
  | "lab"
  | "irc"
  | "qotd"
  | "zcode"
  | "sysop"
  | "vault";

export type PlayLineKind =
  | "system"
  | "user"
  | "response"
  | "glitch"
  | "hint"
  | "error";

export type PlayTranscriptLine = {
  id: string;
  kind: PlayLineKind;
  text: string;
  createdAt: string;
};

export type PlayFile = {
  name: string;
  summary: string;
  body: string;
  hidden?: boolean;
};

export type PlayMessage = {
  id: string;
  author: string;
  subject: string;
  body: string;
  createdAt: string;
};

export type PlayRoom = {
  id: PlayRoomId;
  title: string;
  subtitle: string;
  summary: string;
  note: string;
  unlocked: boolean;
  securityState: "open" | "braced" | "sealed";
  commands: string[];
  aliases: string[];
  protocols: string[];
  files: PlayFile[];
  board: PlayMessage[];
  inbox: PlayMessage[];
};

export type PlayHost = {
  id: PlayRoomId;
  title: string;
  role: string;
  state: "open" | "braced" | "logged" | "rooted" | "secured";
  hardeningState?:
    | "none"
    | "foothold"
    | "rooted"
    | "audited"
    | "patched"
    | "firewalled"
    | "snapshotted"
    | "sealed";
  hardeningScore?: number;
  pressureState?: "calm" | "watched" | "strained" | "locked";
  pressureLevel?: number;
  graceCommands?: number;
  detail: string;
  aliases: string[];
  protocols: string[];
};

export type PlayHistoryCard = {
  year: string;
  title: string;
  body: string;
};

export type PlayKnownRoute = {
  target: PlayRoomId;
  title: string;
  hops: PlayRoomId[];
};

export type PlayPressureReport = {
  room: PlayRoomId;
  title: string;
  level: number;
  state: "calm" | "watched" | "strained" | "locked";
  graceCommands: number;
  lastEvent: string;
};

export type PlayNotebookEntry = {
  id: string;
  title: string;
  room: PlayRoomId;
  source: string;
  kind: "room" | "file" | "route" | "history" | "message";
  summary: string;
  cipher: string;
  decoded: boolean;
  pinned: boolean;
  discoveredAt: string;
};

export type PlayOperation = {
  id: string;
  action:
    | "porthack"
    | "root"
    | "audit"
    | "patch"
    | "firewall"
    | "snapshot"
    | "secure";
  target: PlayRoomId;
  origin: PlayRoomId;
  status: "running" | "complete" | "failed";
  startedAtCommand: number;
  completesAtCommand: number;
  remainingCommands: number;
  result: string;
};

export type PlayReplica = {
  room: PlayRoomId;
  title: string;
  level: number;
  integrity: number;
  state: "seeded" | "warm" | "stable";
  lastSyncCommand: number;
  updatedAt: string;
};

export type PlayBrief = {
  id: string;
  title: string;
  room: PlayRoomId;
  summary: string;
  reward: string;
  status: "available" | "accepted" | "complete";
  progress: string[];
  ready: boolean;
  acceptedAt?: string;
  completedAt?: string;
};

export type PlayDaemon = {
  room: PlayRoomId;
  title: string;
  load: number;
  state: "quiet" | "warm" | "noisy" | "fault";
  lastTickCommand: number;
  updatedAt: string;
};

export type PlayIncident = {
  id: string;
  room: PlayRoomId;
  title: string;
  severity: "watch" | "fault";
  status: "open" | "triaged" | "restored";
  summary: string;
  openedAtCommand: number;
  updatedAt: string;
};

export type PlayWaypoint = {
  room: PlayRoomId;
  title: string;
  hops: PlayRoomId[];
  state: "ready" | "blocked";
  reason: string;
  addedAtCommand: number;
};

export type PlayMesh = {
  score: number;
  tier: "fragile" | "forming" | "steady" | "redundant";
  stabilized: boolean;
  blockers: string[];
  signals: string[];
};

export type PlayTrustLink = {
  id: string;
  endpoints: [PlayRoomId, PlayRoomId];
  titles: [string, string];
  integrity: number;
  state: "handshake" | "trusted" | "stale";
  createdAtCommand: number;
  updatedAtCommand: number;
};

export type PlayService = {
  id: string;
  room: PlayRoomId;
  title: string;
  kind:
    | "console"
    | "archive"
    | "resolver"
    | "board"
    | "mirror"
    | "index"
    | "wire"
    | "maildrop"
    | "arcade"
    | "rack"
    | "relay"
    | "ticker"
    | "parser"
    | "gateway"
    | "warden"
    | "vault";
  health: number;
  state: "online" | "degraded" | "offline";
  installedAtCommand: number;
  updatedAtCommand: number;
};

export type PlayRunbook = {
  id: string;
  room: PlayRoomId;
  title: string;
  steps: string[];
  state: "ready" | "blocked";
  reason: string;
  runs: number;
  compiledAtCommand: number;
  updatedAtCommand: number;
};

export type PlaySector = {
  id: string;
  title: string;
  rooms: PlayRoomId[];
  titles: string[];
  requiredSealed: number;
  sealed: number;
  support: number;
  state: "blocked" | "ready" | "claimed";
  reason: string;
  claimedAtCommand?: number;
  sweeps: number;
  updatedAtCommand?: number;
};

export type PlayAccordCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type PlayAccord = {
  ready: boolean;
  completed: boolean;
  completedAtCommand?: number;
  score: number;
  tier: "cold" | "warming" | "clear";
  checks: PlayAccordCheck[];
  summary: string;
};

export type PlayPresence = {
  id: string;
  handle: string;
  title: string;
  room: PlayRoomId;
  roomTitle: string;
  state: "hidden" | "idle" | "available" | "helping";
  affinity: number;
  taskRoom?: PlayRoomId;
  taskTitle?: string;
  lastSignal: string;
  revealedAtCommand?: number;
  updatedAtCommand?: number;
};

export type PlayAnomaly = {
  id: string;
  room: PlayRoomId;
  title: string;
  roomTitle: string;
  state: "latent" | "active" | "stabilized";
  intensity: number;
  clue: string;
  requirement: string;
  revealedAtCommand?: number;
  stabilizedAtCommand?: number;
};

export type PlayAnchor = {
  id: string;
  sectorId: string;
  sectorTitle: string;
  state: "weak" | "steady" | "bright";
  capacity: number;
  heartbeat: number;
  rooms: PlayRoomId[];
  plantedAtCommand: number;
  updatedAtCommand: number;
};

export type PlayCircuit = {
  id: string;
  label: string;
  stops: PlayRoomId[];
  titles: string[];
  state: "draft" | "stable" | "broken";
  quality: number;
  reason: string;
  uses: number;
  createdAtCommand: number;
  updatedAtCommand: number;
};

export type PlayLedger = {
  balance: number;
  earned: number;
  spent: number;
  capacity: number;
  income: number;
  state: "empty" | "trickle" | "flow";
  updatedAtCommand: number;
};

export type PlaySnapshot = {
  sessionId: string;
  title: string;
  subtitle: string;
  prompt: string;
  authenticated: boolean;
  username: string | null;
  sttyMode: "tty" | "dumb";
  pagerEnabled: boolean;
  pagerPending: boolean;
  pagerPage: number;
  pagerTotal: number;
  badges: string[];
  currentRoom: PlayRoom;
  rooms: PlayRoom[];
  hosts: PlayHost[];
  files: PlayFile[];
  board: PlayMessage[];
  inbox: PlayMessage[];
  inventory: string[];
  routes: PlayKnownRoute[];
  pressure: PlayPressureReport[];
  notebook: PlayNotebookEntry[];
  operations: PlayOperation[];
  replicas: PlayReplica[];
  briefs: PlayBrief[];
  daemons: PlayDaemon[];
  incidents: PlayIncident[];
  waypoints: PlayWaypoint[];
  mesh: PlayMesh;
  trustLinks: PlayTrustLink[];
  services: PlayService[];
  runbooks: PlayRunbook[];
  sectors: PlaySector[];
  accord: PlayAccord;
  presence: PlayPresence[];
  anomalies: PlayAnomaly[];
  anchors: PlayAnchor[];
  circuits: PlayCircuit[];
  ledger: PlayLedger;
  transcript: PlayTranscriptLine[];
  history: PlayHistoryCard[];
  tips: string[];
  solved: boolean;
  invalidAttempts: number;
  commandCount: number;
};

export type PlayCommandOutcome = {
  snapshot: PlaySnapshot;
  reply: string[];
  glitch?: boolean;
};
