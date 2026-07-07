export interface HeroHost {
  hostname: string;
  org: string;
  location: string;
  neighbors: string[];
  os_type: string;
  ports: number[];
  bbs_config?: { name: string; tagline: string };
  files?: Record<string, string>;
  occupants?: Array<{
    login: string;
    name: string;
    tty: string;
    idle: string;
    office: string;
    plan: string;
  }>;
}

export const HERO_HOSTS: HeroHost[] = [
  {
    hostname: "cyberscape",
    org: "Cyberscape Core",
    location: "Mountain View, CA",
    neighbors: ["phonebook", "bbs", "qotd", "zcode", "relay"],
    os_type: "unix",
    ports: [23, 79],
    files: {
      "motd.txt": "Welcome to Cyberscape. Type ? for commands and HOSTS for the visible network.",
      "porthack.exe": "PORTHACK v1.0 - adjacent hosts only",
    },
    occupants: [
      {
        login: "operator",
        name: "Cyberscape Console Operator",
        tty: "tty0",
        idle: "0:01",
        office: "machine room",
        plan: "Keep the shell prompt honest and the host graph reachable.",
      },
      {
        login: "archivist",
        name: "Archive Desk",
        tty: "tty2",
        idle: "0:42",
        office: "stacks",
        plan: "Label source material before it becomes game state.",
      },
    ],
  },
  {
    hostname: "phonebook",
    org: "Cyberscape Directory Service",
    location: "Network Core",
    neighbors: ["bbs", "ftp", "gopher", "news", "mail", "irc", "games", "lab"],
    os_type: "unix",
    ports: [23, 79],
    files: {
      "phonebook.txt": "Directory routes and aliases for the public host graph.",
      "netstat.txt": "Visible hosts only; hidden hosts require wardial or inference.",
    },
    occupants: [
      {
        login: "directory",
        name: "Directory Clerk",
        tty: "tty1",
        idle: "0:12",
        office: "switch room",
        plan: "Maintain printed routes, toll notes, and old handset numbers.",
      },
      {
        login: "modem",
        name: "Modem Librarian",
        tty: "tty5",
        idle: "1:04",
        office: "line shelf",
        plan: "Compare carrier previews before the player dials.",
      },
    ],
  },
  {
    hostname: "bbs",
    org: "Cyberscape BBS Guild",
    location: "Dialup Archive",
    neighbors: ["phonebook", "news", "mail", "games"],
    os_type: "unix",
    ports: [23, 79],
    bbs_config: { name: "Cyberscape BBS", tagline: "Welcome to the board" },
    files: {
      "welcome.bbs": "The board is a quiet archive of menu-driven memory.",
    },
    occupants: [
      {
        login: "sysop",
        name: "Board Sysop",
        tty: "tty3",
        idle: "0:07",
        office: "dialup closet",
        plan: "Answer pages, prune duplicate posts, and keep file areas readable.",
      },
      {
        login: "guestbook",
        name: "Guestbook Daemon",
        tty: "tty6",
        idle: "3:33",
        office: "message base",
        plan: "Watch for first posts from new callers.",
      },
    ],
  },
  {
    hostname: "gopher",
    org: "Internet Gopher Project",
    location: "University of Minnesota, MN",
    neighbors: ["phonebook", "news", "ftp"],
    os_type: "unix",
    ports: [23, 70],
    files: {
      "menu.gph": "1. Cyberscape\n2. Projects\n3. Guides\n4. Archive",
    },
  },
  {
    hostname: "mail",
    org: "Postal Network Services",
    location: "Quiet Lane",
    neighbors: ["phonebook", "bbs", "news", "relay"],
    os_type: "unix",
    ports: [23, 25],
    files: {
      "inbox.txt": "Inbox zero is a myth on a living network.",
    },
  },
  {
    hostname: "irc",
    org: "IRCnet Relay",
    location: "Talk Channel",
    neighbors: ["phonebook", "games", "lab"],
    os_type: "unix",
    ports: [23, 6667],
    files: {
      "channel.log": "Nicknames blink and vanish like modem LEDs.",
    },
  },
  {
    hostname: "game",
    org: "Legacy Game Access",
    location: "Arcade Shelf",
    neighbors: ["phonebook", "games"],
    os_type: "unix",
    ports: [23],
    files: {
      "games.txt": "Interactive fiction, shareware, and old menu worlds.",
    },
  },
  {
    hostname: "games",
    org: "Cyberscape Arcade",
    location: "Old Shareware Rack",
    neighbors: ["phonebook", "irc", "lab", "game"],
    os_type: "unix",
    ports: [23],
    files: {
      "zork.gam": "You are standing in an open field west of a white house.",
      "lostpig.gam": "You are in a muddy field.",
      "advent.gam": "Welcome to Adventure.",
    },
  },
  {
    hostname: "lab",
    org: "Lab Infrastructure Group",
    location: "Iowa City, IA",
    neighbors: ["phonebook", "games", "irc", "relay"],
    os_type: "unix",
    ports: [23, 79],
    files: {
      "rack.txt": "The lab keeps the cabling and the mood in the same room.",
    },
  },
  {
    hostname: "qotd",
    org: "Question Of The Day",
    location: "Slow Banner",
    neighbors: ["phonebook", "zcode"],
    os_type: "unix",
    ports: [23, 79],
    files: {
      "qotd.txt": "The route is the memory, and the memory is the route.",
    },
  },
  {
    hostname: "zcode",
    org: "Z-Machine Shelf",
    location: "Parser Row",
    neighbors: ["qotd", "mirror", "games"],
    os_type: "unix",
    ports: [23],
    files: {
      "zcode.txt": "Interactive fiction lives here.",
    },
  },
  {
    hostname: "relay",
    org: "Network Relay",
    location: "Palo Alto, CA",
    neighbors: ["archive", "bbs", "mirror", "sysop", "mail", "lab"],
    os_type: "unix",
    ports: [23, 25],
    files: {
      "relay.txt": "No repeat-start pressure. Clean turns only.",
    },
  },
  {
    hostname: "mirror",
    org: "Times Mirror Service",
    location: "Cambridge, MA",
    neighbors: ["relay", "sysop", "zcode"],
    os_type: "unix",
    ports: [23, 79],
    files: {
      "mirror.txt": "Duplicates are checked before they spread.",
    },
  },
  {
    hostname: "sysop",
    org: "System Operator",
    location: "Control Room",
    neighbors: ["relay", "mirror", "vault"],
    os_type: "unix",
    ports: [23],
    files: {
      "sysop.txt": "Containment lives here.",
    },
  },
  {
    hostname: "vault",
    org: "Hidden Archive",
    location: "Locked Wing",
    neighbors: ["sysop"],
    os_type: "unix",
    ports: [23],
    files: {
      "future.txt": "The future is kept in reserve.",
    },
  },
];

export function applyHeroHosts<T extends { hostname: string }>(hosts: T[]): void {
  for (const hero of HERO_HOSTS) {
    const existing = hosts.find((host) => host.hostname.toLowerCase() === hero.hostname.toLowerCase());
    if (existing) {
      Object.assign(existing, {
        ...hero,
        neighbors: [...hero.neighbors],
        ports: [...hero.ports],
        files: hero.files ? { ...hero.files } : undefined,
        occupants: hero.occupants ? hero.occupants.map((occupant) => ({ ...occupant })) : undefined,
      });
    } else {
      hosts.push({
        ...hero,
        neighbors: [...hero.neighbors],
        ports: [...hero.ports],
        files: hero.files ? { ...hero.files } : undefined,
        occupants: hero.occupants ? hero.occupants.map((occupant) => ({ ...occupant })) : undefined,
      } as unknown as T);
    }
  }
}
