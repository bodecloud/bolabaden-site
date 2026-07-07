import type {
  PlayFile,
  PlayHost,
  PlayHistoryCard,
  PlayMessage,
  PlayRoom,
  PlayRoomId,
} from "./types";

type RoomRecord = Omit<PlayRoom, "unlocked" | "securityState" | "commands"> & {
  commands: string[];
  securityState: PlayRoom["securityState"];
};

const ROOM_ORDER: PlayRoomId[] = [
  "desk",
  "archive",
  "phonebook",
  "bbs",
  "ftp",
  "gopher",
  "news",
  "mail",
  "games",
  "lab",
  "irc",
  "qotd",
  "zcode",
  "relay",
  "mirror",
  "sysop",
  "vault",
];

const HARDEN_COMMANDS = ["audit", "patch", "firewall", "snapshot", "secure"];

function file(
  name: string,
  summary: string,
  body: string,
  hidden = false,
): PlayFile {
  return { name, summary, body, hidden };
}

function message(
  id: string,
  author: string,
  subject: string,
  body: string,
  createdAt: string,
): PlayMessage {
  return { id, author, subject, body, createdAt };
}

const ROOM_BASES: Record<PlayRoomId, RoomRecord> = {
  desk: {
    id: "desk",
    title: "Desktop",
    subtitle: "Luna shell online",
    summary:
      "A soft blue desktop with a single taskbar, a blinking cursor, and a stack of quiet shortcuts.",
    note:
      "The desktop is the only place that feels calm enough to listen. The other rooms answer if you know how to knock.",
    securityState: "braced",
    commands: [
      "help",
      "scan",
      "history",
      "status",
      "phonebook",
      "read",
      "post",
      "enter <host>",
      "solve <phrase>",
    ],
    aliases: ["desktop", "home", "start"],
    protocols: ["gui", "terminal"],
    files: [
      file(
        "README.TXT",
        "A note about the desk",
        "Welcome to the Desktop. The shell is calm on purpose. Use phonebook to see the network, ls to inspect files, and enter or telnet to hop to hosts.",
      ),
      file(
        "START.MOTD",
        "The first line is friendly",
        "A bright shell can still hide a network. Hidden layers are opened by history, not brute force.",
      ),
    ],
    board: [],
    inbox: [],
  },
  archive: {
    id: "archive",
    title: "Archive",
    subtitle: "History shelf",
    summary:
      "A long shelf of dated fragments, forum sigils, and old server labels preserved like snapshots on a school computer.",
    note:
      "The archive remembers how the old web felt: cheap shared hosting, phpBB boards, FTP drops, and a desktop that looked friendly enough to trust.",
    securityState: "open",
    commands: [
      "look",
      "history",
      "inspect",
      "ls",
      "cat <file>",
      "back",
      "glitch",
      ...HARDEN_COMMANDS,
    ],
    aliases: ["archive", "history", "shelf"],
    protocols: ["file", "index"],
    files: [
      file(
        "2001.NOTE",
        "Blue shell era",
        "The early shell was about reassurance. Blue windows, clear captions, and a start button that made the machine feel like a room instead of a machine.",
      ),
      file(
        "BBS.TXT",
        "Boards and phonebooks",
        "BBSes were smaller than the modern web but easier to remember. The phonebook mattered because the route itself became the memory. QWK packets, ANSI borders, and dial-up tones all lived here once.",
      ),
      file(
        "CPANEL.LOG",
        "Shared hosting panel",
        "The early 2000s were full of little control panels. cPanel made the server feel like a desktop tool, which is why the rack keeps the tone familiar.",
      ),
      file(
        "LUNA.KEY",
        "The old shell word",
        "Luna is the old shell name that opens the hidden layer. It is not magic; it is a reminder that the archive is the source of the path.",
        true,
      ),
    ],
    board: [],
    inbox: [],
  },
  phonebook: {
    id: "phonebook",
    title: "Phonebook",
    subtitle: "Directory and aliases",
    summary:
      "A directory of host names, protocols, and quiet little labels that make the network easier to remember than to brute-force.",
    note:
      "This is the directory-shaped part of the world: a phonebook, not a feed. Routes matter because they can be memorized.",
    securityState: "open",
    commands: [
      "phonebook",
      "ls",
      "cat <file>",
      "telnet <host>",
      "gopher <host>",
      "ftp <host>",
      "news <host>",
      "back",
    ],
    aliases: ["pb", "phonebook", "dir"],
    protocols: ["telnet", "gopher", "ftp", "news"],
    files: [
      file(
        "PHONEBOOK.DIR",
        "Alias map",
        "bbs -> the bulletin board lobby\nftp -> the public file mirror\ngopher -> the menu forest\nnews -> the bulletin wire\nmail -> the quiet mailbox\ngames -> the arcade shelf\nlab -> the hosting rack\nirc -> the channel relay",
      ),
      file(
        "HOSTS.TXT",
        "Current hosts",
        "desktop, archive, phonebook, bbs, ftp, gopher, news, mail, games, lab, irc, relay, mirror, sysop",
      ),
    ],
    board: [],
    inbox: [],
  },
  bbs: {
    id: "bbs",
    title: "BBS Lobby",
    subtitle: "Bulletin board",
    summary:
      "A message board lobby with bulletin threads, ANSI corners, and a sysop who keeps the pace civil.",
    note:
      "This is where threads become place. Board culture is a memory aid, not a news feed.",
    securityState: "open",
    commands: [
      "bbs",
      "ls",
      "cat <file>",
      "read",
      "post",
      "reply",
      "whois <name>",
      "finger <name>",
      "back",
      ...HARDEN_COMMANDS,
    ],
    aliases: ["bbs", "board", "forum"],
    protocols: ["telnet", "bbs"],
    files: [
      file(
        "WELCOME.BBS",
        "Board etiquette",
        "Be brief, be useful, and respect the room. Replies are archived because memory is the point.",
      ),
      file(
        "ANSI.GUIDE",
        "Old screen tricks",
        "ANSI art mattered because it made the board feel alive. The colors were cheap, but the place felt owned.",
      ),
    ],
    board: [
      message(
        "bbs-thread-1",
        "Sysop",
        "Welcome to the board",
        "Keep it brief, keep it clear, and keep the path readable. Old boards stayed useful because they stayed human.",
        "2003-04-12T08:45:00.000Z",
      ),
      message(
        "bbs-thread-2",
        "Nora",
        "ANSI corners",
        "A good board is calm enough to read and strange enough to remember. The art is part of the map.",
        "2003-04-12T11:20:00.000Z",
      ),
    ],
    inbox: [],
  },
  ftp: {
    id: "ftp",
    title: "FTP Mirror",
    subtitle: "File shelf",
    summary:
      "A mirror of public files, shareware, and release notes. The kind of place you had to know by name to reach.",
    note:
      "The mirror is honest. If it has the file, it says so. If it does not, it tells you nothing is wrong.",
    securityState: "open",
    commands: ["ftp", "ls", "dir", "cat <file>", "more <file>", "back", "takeover", ...HARDEN_COMMANDS],
    aliases: ["ftp", "mirror", "files"],
    protocols: ["ftp"],
    files: [
      file(
        "SHAREWARE.TXT",
        "Everything has a demo",
        "Old shareware culture depended on trusted mirrors and repeat visits. The file shelf was a social contract.",
      ),
      file(
        "UPLOAD.LOG",
        "The upload queue",
        "Every file landed with a date stamp, a checksum, and a tiny piece of reputation.",
      ),
    ],
    board: [],
    inbox: [],
  },
  gopher: {
    id: "gopher",
    title: "Gopher Menu",
    subtitle: "Nested index",
    summary:
      "A menu forest of numbered entries, where the route down matters more than the final page.",
    note:
      "The menu shape is the lesson. Simplicity can still hide depth if the tree is arranged well.",
    securityState: "open",
    commands: ["gopher", "ls", "cat <file>", "open <file>", "back", ...HARDEN_COMMANDS],
    aliases: ["gopher", "menu", "tree"],
    protocols: ["gopher"],
    files: [
      file(
        "INDEX.GPH",
        "Numbered menu",
        "1. history\n2. boards\n3. mirrors\n4. files\n5. news\n6. vault",
      ),
      file(
        "GOPHER.TXT",
        "Why this room exists",
        "Navigation used to be a deliberate act. The tree was the interface, and that made every hop feel earned.",
      ),
    ],
    board: [],
    inbox: [],
  },
  news: {
    id: "news",
    title: "News Wire",
    subtitle: "Bulletin stream",
    summary:
      "A tinny bulletin wire with headlines, threaded reactions, and a calm refusal to become a feed.",
    note:
      "The wire is for catching up, not spiraling. It stays readable because it is not trying to hypnotize anyone.",
    securityState: "open",
    commands: ["news", "ls", "cat <file>", "read", "post", "reply", "today", "back", "camp", ...HARDEN_COMMANDS],
    aliases: ["news", "wire", "newshost"],
    protocols: ["nntp", "news"],
    files: [
      file(
        "HEADLINES.TXT",
        "What the wire says",
        "2003: small web hosts are everywhere.\n2004: forums still matter.\n2005: the useful rooms stay quiet.",
      ),
      file(
        "THREADS.TXT",
        "Thread shapes",
        "A good thread is a breadcrumb trail. A bad one is a room full of echoes.",
      ),
    ],
    board: [
      message(
        "news-1",
        "Wire",
        "Small hosts still matter",
        "Cheap hosting, static mirrors, and forum memory are still the most legible parts of the web.",
        "2004-02-03T14:10:00.000Z",
      ),
      message(
        "news-2",
        "Archivist",
        "Keep the feed calm",
        "The bulletin wire works when it remains a bulletin wire. Reactions should not outrun the headline.",
        "2004-02-03T17:42:00.000Z",
      ),
    ],
    inbox: [],
  },
  mail: {
    id: "mail",
    title: "Mail Drop",
    subtitle: "Quiet inbox",
    summary:
      "A private little inbox that values replies and rejects noise. Nothing here is public-facing by default.",
    note:
      "The mailbox is a reminder that not every host wants attention. Some rooms are for the few who already know the address.",
    securityState: "open",
    commands: [
      "mail",
      "ls",
      "cat <file>",
      "read",
      "inbox",
      "send",
      "finger <name>",
      "back",
      ...HARDEN_COMMANDS,
    ],
    aliases: ["mail", "inbox", "drop"],
    protocols: ["smtp", "pop3", "imap"],
    files: [
      file(
        "README.MAIL",
        "Private by default",
        "Mail is for direct contact. The room keeps a short log and a stronger boundary than the bulletin board.",
      ),
      file(
        "REPLIES.TXT",
        "Reply etiquette",
        "Small, useful, and human. Messages can be calm and still be direct.",
      ),
    ],
    board: [],
    inbox: [
      message(
        "mail-1",
        "Sysop",
        "Route check",
        "Use the phonebook first, then the hop lane. That keeps the trail explainable.",
        "2004-06-18T09:14:00.000Z",
      ),
      message(
        "mail-2",
        "Relay",
        "Grace window",
        "Fresh arrivals get a short buffer. The lane stays fair when the first move is protected.",
        "2004-06-18T09:16:00.000Z",
      ),
    ],
  },
  games: {
    id: "games",
    title: "Games Shelf",
    subtitle: "Arcade shelf",
    summary:
      "A shelf of shareware boxes, local high scores, and a humming CRT that remembers afternoons after school.",
    note:
      "Games are the reason the shell feels lived in. The room keeps the fun legible and the nostalgia soft.",
    securityState: "open",
    commands: ["look", "scan", "ls", "cat <file>", "enter <host>", "back", ...HARDEN_COMMANDS],
    aliases: ["games", "arcade", "play"],
    protocols: ["game", "arcade"],
    files: [
      file(
        "HIGHSCOR.TXT",
        "Local scores",
        "Doom shareware, pinball tables, and a few text adventures sat here because the room was supposed to feel like a weekend.",
      ),
      file(
        "README.GME",
        "A room for calm play",
        "The games room is not a launcher. It is a shelf of moods, disks, and forgotten installers that smell like plastic.",
      ),
    ],
    board: [],
    inbox: [],
  },
  lab: {
    id: "lab",
    title: "Hosting Rack",
    subtitle: "Homelab bench",
    summary:
      "A rack view with label maker tape, spare drives, and a browser tab that never quite forgot the console.",
    note:
      "The rack turns infrastructure into something you can explain without pretending it is a cloud diagram.",
    securityState: "open",
    commands: ["look", "inspect", "ls", "cat <file>", "back", ...HARDEN_COMMANDS],
    aliases: ["lab", "node", "rack"],
    protocols: ["ssh", "http", "ssh2"],
    files: [
      file(
        "RACK.LOG",
        "Visible state",
        "Power, cooling, storage, and names are the only things that matter when the rack starts to hum.",
      ),
      file(
        "BENCH.TXT",
        "Patch notes",
        "The bench is where systems get proven before they become lore. It should be calm enough to read.",
      ),
      file(
        "PHPBB.TXT",
        "Forum stack",
        "phpBB, vBulletin, and a few homemade boards were the social layer of the early web. They stayed readable because they stayed structured.",
      ),
      file(
        "DYNDNS.TXT",
        "Dynamic address note",
        "Dynamic DNS and cheap shared hosts made personal servers feel reachable from anywhere, even when the IP changed underneath.",
      ),
    ],
    board: [],
    inbox: [],
  },
  irc: {
    id: "irc",
    title: "IRC",
    subtitle: "Channel relay",
    summary:
      "A channel relay where nicknames blink in and out like light on a beige modem LED.",
    note:
      "IRC is the social glue between boards and mail: quick, linear, and easy to forget unless you lived there.",
    securityState: "open",
    commands: ["look", "scan", "ls", "cat <file>", "back", ...HARDEN_COMMANDS],
    aliases: ["irc", "chat", "relay"],
    protocols: ["irc"],
    files: [
      file(
        "CHANNELS.TXT",
        "Common rooms",
        "#boden, #homelab, #kotor, #retro, #sysop — names that feel like the old internet because they are spare.",
      ),
      file(
        "NICKS.LOG",
        "Nick rotation",
        "Nicknames were a kind of folk memory. The room keeps them brief so they can be remembered.",
      ),
    ],
    board: [],
    inbox: [],
  },
  qotd: {
    id: "qotd",
    title: "QOTD",
    subtitle: "Question ticker",
    summary:
      "A thin line that spits out one calm question at a time, like a monitor waking up on a weekday morning.",
    note:
      "Questions are the smallest possible prompts for memory. The room exists so the shell can ask before it tells.",
    securityState: "open",
    commands: ["look", "scan", "ls", "cat <file>", "back", ...HARDEN_COMMANDS],
    aliases: ["qotd", "quote", "ticker"],
    protocols: ["qotd"],
    files: [
      file(
        "QOTD.TXT",
        "Daily prompt",
        "What did you build that still matters when the screen goes dark?",
      ),
      file(
        "ARCHIVE.TXT",
        "Old prompts",
        "The ticker keeps little questions because the answers are often bigger than the room.",
      ),
    ],
    board: [],
    inbox: [],
  },
  zcode: {
    id: "zcode",
    title: "Z-Code",
    subtitle: "Interactive fiction",
    summary:
      "A small interpreter shelf with parser dust, lamp light, and the promise that some rooms are solved by typing differently.",
    note:
      "Z-machine fiction belongs in this world because it rewards patience, memory, and odd verbs.",
    securityState: "open",
    commands: ["look", "scan", "ls", "cat <file>", "back", ...HARDEN_COMMANDS],
    aliases: ["zcode", "zmachine", "if"],
    protocols: ["zmachine", "zcode"],
    files: [
      file(
        "README.Z",
        "Interpreter notes",
        "Parser fiction asks you to think like the system. That makes it a sibling to the shell, not a diversion.",
      ),
      file(
        "ROSE.TXT",
        "A small story",
        "The room is only a room if you stop asking it to behave like a book.",
      ),
    ],
    board: [],
    inbox: [],
  },
  relay: {
    id: "relay",
    title: "Relay",
    subtitle: "Hop lane",
    summary:
      "A narrow corridor of routes and handoffs where every shortcut gets checked before it can become a habit.",
    note:
      "This room is where shortcuts get refused and pacing matters more than speed. Patience keeps the lane fair.",
    securityState: "open",
    commands: ["look", "inspect", "back", "camp", "tunnel", "trace", "traceroute <host>", ...HARDEN_COMMANDS],
    aliases: ["relay", "route", "hop"],
    protocols: ["router", "tunnel"],
    files: [
      file(
        "GRACE.WIN",
        "Fair play rules",
        "Fresh arrivals get a brief grace window before the lane becomes contested.",
      ),
      file(
        "ROUTE.LOG",
        "Route note",
        "Route skipping is refused. The better path is always the one that is explainable.",
      ),
    ],
    board: [],
    inbox: [],
  },
  mirror: {
    id: "mirror",
    title: "Mirror",
    subtitle: "Integrity pane",
    summary:
      "A reflective control room that watches for duplicate paths, stale copies, and anyone trying to turn the floor into a shortcut.",
    note:
      "The mirror prefers grace windows, quiet resets, and a clean return path over loud escalation.",
    securityState: "open",
    commands: ["look", "inspect", "back", "camp", "tunnel", "uptime", "whois <name>", ...HARDEN_COMMANDS],
    aliases: ["mirror", "integrity", "check"],
    protocols: ["sync", "mirror"],
    files: [
      file(
        "DUPES.TXT",
        "Duplicate path policy",
        "Duplicate routes get collapsed before they can confuse the room. The point is clarity, not speedrunning.",
      ),
      file(
        "CLOCK.TXT",
        "Quiet timekeeping",
        "A room that knows its own time is harder to camp and easier to trust.",
      ),
    ],
    board: [],
    inbox: [],
  },
  sysop: {
    id: "sysop",
    title: "Sysop Desk",
    subtitle: "Admin layer",
    summary:
      "An admin desk with just enough authority to seal a host and just enough caution to avoid pretending the world is trivial.",
    note:
      "The sysop layer is the place for containment. It can secure a host, but only after the path to it is understood.",
    securityState: "open",
    commands: ["sysop", "takeover", "ls", "cat <file>", "back", ...HARDEN_COMMANDS],
    aliases: ["sysop", "admin", "root"],
    protocols: ["admin"],
    files: [
      file(
        "ACCESS.TXT",
        "Containment rules",
        "The right move is to secure a host in reality-accurate ways: prove the path, close the loop, and leave the shell stable.",
      ),
      file(
        "LOCKS.TXT",
        "What sealing means",
        "Sealing is not erasing. It is making the room safe enough that no one can jump the queue or tunnel around the rules.",
      ),
    ],
    board: [],
    inbox: [],
  },
  vault: {
    id: "vault",
    title: "Vault",
    subtitle: "Hidden layer",
    summary:
      "The far room stays dark until the shelf, the lane, and the mirror all agree on the same name.",
    note:
      "Once open, the vault becomes the place where the rest of the world is meant to plug in later.",
    securityState: "open",
    commands: ["look", "inspect", "back", "ls", "cat <file>", ...HARDEN_COMMANDS],
    aliases: ["vault", "hidden", "core"],
    protocols: ["internal"],
    files: [
      file(
        "LUNA.KEY",
        "The shell word",
        "Luna is the old shell name that opens the hidden layer. The archive remembers it, and the vault accepts it.",
      ),
      file(
        "FUTURE.TXT",
        "Phase II",
        "Later, the network can connect outward. For now the vault stays internal, calm, and exact.",
      ),
    ],
    board: [],
    inbox: [],
  },
};

export const HISTORY_CARDS: PlayHistoryCard[] = [
  {
    year: "2001",
    title: "Windows XP makes the room feel soft",
    body:
      "Windows XP arrives with the Luna look and a friendlier shell on top of the NT lineage. The machine still behaves like an operating system, but the room feels easier to live inside.",
  },
  {
    year: "2002",
    title: "Forums become durable",
    body:
      "phpBB 2.0 and vBulletin-style boards make small communities searchable and durable. Threads become archives instead of disposable chatter.",
  },
  {
    year: "2003",
    title: "Shared hosting gets personal",
    body:
      "cPanel dashboards, FTP uploads, dynamic DNS, and one-click installs turn small websites into weekend projects. The control panel feels like a tiny command center.",
  },
  {
    year: "2004",
    title: "The hop rhythm settles in",
    body:
      "People move through mirrors, relays, guestbooks, and bookmarks more than they do through social feeds. The path matters because the path is the memory.",
  },
  {
    year: "2005",
    title: "Calm, not loud",
    body:
      "The good interfaces are the ones you can live inside. The best ones slow you down just enough to notice what they are protecting.",
  },
];

export const PLAY_HOSTS: PlayHost[] = [
  {
    id: "desk",
    title: "Desktop",
    role: "entry shell",
    state: "secured",
    detail: "The start point is always under control. Nothing here can be camped.",
    aliases: ROOM_BASES.desk.aliases,
    protocols: ROOM_BASES.desk.protocols,
  },
  {
    id: "archive",
    title: "Archive",
    role: "history node",
    state: "open",
    detail: "Find the old shell name and the rest of the room starts to read like a clue.",
    aliases: ROOM_BASES.archive.aliases,
    protocols: ROOM_BASES.archive.protocols,
  },
  {
    id: "phonebook",
    title: "Phonebook",
    role: "directory node",
    state: "open",
    detail: "Routes are easier to memorize when the aliases stay small and plain.",
    aliases: ROOM_BASES.phonebook.aliases,
    protocols: ROOM_BASES.phonebook.protocols,
  },
  {
    id: "bbs",
    title: "BBS Lobby",
    role: "bulletin node",
    state: "open",
    detail: "Threads, ANSI corners, and a quiet board culture keep the pace human.",
    aliases: ROOM_BASES.bbs.aliases,
    protocols: ROOM_BASES.bbs.protocols,
  },
  {
    id: "ftp",
    title: "FTP Mirror",
    role: "file node",
    state: "open",
    detail: "Public files are kept in a mirror that cares about names and checksums.",
    aliases: ROOM_BASES.ftp.aliases,
    protocols: ROOM_BASES.ftp.protocols,
  },
  {
    id: "gopher",
    title: "Gopher Menu",
    role: "menu node",
    state: "open",
    detail: "The numbered tree makes the route itself feel memorable.",
    aliases: ROOM_BASES.gopher.aliases,
    protocols: ROOM_BASES.gopher.protocols,
  },
  {
    id: "news",
    title: "News Wire",
    role: "bulletin node",
    state: "open",
    detail: "Headlines stay calm enough to be readable.",
    aliases: ROOM_BASES.news.aliases,
    protocols: ROOM_BASES.news.protocols,
  },
  {
    id: "mail",
    title: "Mail Drop",
    role: "private node",
    state: "open",
    detail: "The mailbox is for direct contact, not public spectacle.",
    aliases: ROOM_BASES.mail.aliases,
    protocols: ROOM_BASES.mail.protocols,
  },
  {
    id: "games",
    title: "Games Shelf",
    role: "arcade node",
    state: "open",
    detail: "Shareware, save files, and a shelf of small, calm distractions.",
    aliases: ROOM_BASES.games.aliases,
    protocols: ROOM_BASES.games.protocols,
  },
  {
    id: "lab",
    title: "Hosting Rack",
    role: "bench node",
    state: "open",
    detail: "The bench keeps the infrastructure readable before it becomes lore.",
    aliases: ROOM_BASES.lab.aliases,
    protocols: ROOM_BASES.lab.protocols,
  },
  {
    id: "irc",
    title: "IRC",
    role: "chat node",
    state: "open",
    detail: "Nicknames move quickly here, but the room still values memory.",
    aliases: ROOM_BASES.irc.aliases,
    protocols: ROOM_BASES.irc.protocols,
  },
  {
    id: "qotd",
    title: "QOTD",
    role: "ticker node",
    state: "open",
    detail: "A quiet ticker that asks questions instead of shouting answers.",
    aliases: ROOM_BASES.qotd.aliases,
    protocols: ROOM_BASES.qotd.protocols,
  },
  {
    id: "zcode",
    title: "Z-Code",
    role: "fiction node",
    state: "open",
    detail: "Parser fiction and interactive stories keep the old machine language alive.",
    aliases: ROOM_BASES.zcode.aliases,
    protocols: ROOM_BASES.zcode.protocols,
  },
  {
    id: "relay",
    title: "Relay",
    role: "route node",
    state: "open",
    detail: "Shortcuts are refused here. The lane stays fair by design.",
    aliases: ROOM_BASES.relay.aliases,
    protocols: ROOM_BASES.relay.protocols,
  },
  {
    id: "mirror",
    title: "Mirror",
    role: "integrity node",
    state: "open",
    detail: "Duplicate paths get checked and reset before they can spread.",
    aliases: ROOM_BASES.mirror.aliases,
    protocols: ROOM_BASES.mirror.protocols,
  },
  {
    id: "sysop",
    title: "Sysop Desk",
    role: "admin node",
    state: "open",
    detail: "Containment is the job: secure the host, then leave the path explainable.",
    aliases: ROOM_BASES.sysop.aliases,
    protocols: ROOM_BASES.sysop.protocols,
  },
  {
    id: "vault",
    title: "Vault",
    role: "hidden node",
    state: "open",
    detail: "It opens only after the history shelves agree on a name.",
    aliases: ROOM_BASES.vault.aliases,
    protocols: ROOM_BASES.vault.protocols,
  },
];

export const PLAY_ROOM_ORDER = ROOM_ORDER;

export function getBaseRoom(roomId: PlayRoomId): RoomRecord {
  return ROOM_BASES[roomId];
}
