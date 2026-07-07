import type { ShellSessionState } from "@/lib/shell/types";
import {
  formatDownloadHeader,
  formatFileListing,
  getFileByIndex,
} from "@/lib/bbs/corpus";
import { formatFileAreas } from "@/lib/bbs/archive";
import {
  createBoardMessage,
  formatBoardMessages,
  messageCountForAuthor,
} from "@/lib/bbs/boards";
import { claimBbsSysop, sysopRecordForHost } from "@/lib/bbs/sysop";
import { persistDownloadedFile } from "@/lib/shell/downloads";

export interface BbsResult {
  output: string[];
  exit?: boolean;
  pager?: boolean;
}

const JOKES = [
  "Why did the sysop cross the road? To get to the other side of the BBS.",
  "A hacker walks into a bar. The bartender says, 'INVALID LOGON CODE.'",
  "There are 10 types of people: those who understand binary and those who don't.",
  "Your BBS is so slow, the ANSI art finishes loading tomorrow.",
];

function banner(host: string, entryMethod: "dial" | "telnet" | "local" = "telnet"): string[] {
  const lines = [
    "",
    `*** ${host.toUpperCase()} BBS ***`,
    "T-NET 84 XBBS compatible (dev corpus)",
    "",
  ];
  if (entryMethod === "dial") {
    lines.push("Carrier locked. BBS answers after modem handoff.");
    lines.push("Login ritual: enter GUEST or a board handle.");
    lines.push("");
  }
  return lines;
}

function menuPrompt(): string[] {
  return ["Commands: ?, R, P, F, L, W, J, S, Y, X, Q"];
}

function handleLogin(state: ShellSessionState, line: string): BbsResult {
  const name = line.trim() || "GUEST";
  const upper = name.toUpperCase();
  state.bbsGuestName = upper === "GUEST" ? "GUEST" : name;
  state.bbsPhase = "menu";
  state.bbsSubmode = null;
  state.bbsDraftSubject = null;
  return {
    output: [
      `Welcome, ${state.bbsGuestName}.`,
      ...menuPrompt(),
    ],
  };
}

function handleDownloadPick(
  state: ShellSessionState,
  line: string
): BbsResult {
  const host = state.bbsHost ?? "bbs";
  const n = parseInt(line.trim(), 10);
  if (!Number.isFinite(n) || n < 1) {
    state.bbsSubmode = null;
    return { output: ["Invalid file number.", ...menuPrompt()] };
  }
  const file = getFileByIndex(host, n);
  state.bbsSubmode = null;
  state.bbsDraftSubject = null;
  if (!file) {
    return { output: ["No such file.", ...menuPrompt()] };
  }
  persistDownloadedFile(state, file.filename, file.content);
  return {
    output: [...formatDownloadHeader(file), ...file.content.split(/\r?\n/)],
    pager: true,
  };
}

export function enterBbs(state: ShellSessionState, host: string, entryMethod: "dial" | "telnet" | "local" = "telnet"): BbsResult {
  state.bbsMode = true;
  state.bbsHost = host;
  state.bbsPhase = "login";
  state.bbsSubmode = null;
  state.bbsGuestName = null;
  state.bbsDraftSubject = null;
  return {
    output: [
      ...banner(host, entryMethod),
      "Enter your username or GUEST.",
    ],
  };
}

function handlePostSubject(state: ShellSessionState, line: string): BbsResult {
  const subject = line.trim();
  if (!subject) {
    state.bbsSubmode = null;
    state.bbsDraftSubject = null;
    return { output: ["Post canceled.", ...menuPrompt()] };
  }
  state.bbsDraftSubject = subject.slice(0, 60);
  state.bbsSubmode = "post-body";
  return {
    output: [
      "Enter message body. Blank line cancels.",
    ],
  };
}

function handlePostBody(state: ShellSessionState, line: string): BbsResult {
  const body = line.trim();
  const subject = state.bbsDraftSubject;
  state.bbsSubmode = null;
  state.bbsDraftSubject = null;

  if (!subject || !body) {
    return { output: ["Post canceled.", ...menuPrompt()] };
  }

  const host = state.bbsHost ?? "bbs";
  const author = state.bbsGuestName ?? state.username ?? "GUEST";
  createBoardMessage(host, author, subject, body.slice(0, 240));
  return {
    output: [
      "Message posted.",
      `Subject: ${subject}`,
      ...menuPrompt(),
    ],
  };
}

export function runBbsCommand(
  state: ShellSessionState,
  line: string
): BbsResult {
  const host = state.bbsHost ?? "bbs";

  if (state.bbsPhase === "login") {
    return handleLogin(state, line);
  }

  if (state.bbsSubmode === "download") {
    return handleDownloadPick(state, line);
  }

  if (state.bbsSubmode === "post-subject") {
    return handlePostSubject(state, line);
  }

  if (state.bbsSubmode === "post-body") {
    return handlePostBody(state, line);
  }

  const cmd = line.trim().charAt(0).toUpperCase();
  const rest = line.trim().slice(1).trim();

  switch (cmd) {
    case "?":
      return {
        output: [
          "? Help",
          "R Read messages",
          "P Post a message",
          "F Files (download)",
          "L List files",
          "W Who's online",
          "J Tell a joke",
          "S Sysop panel / claim board",
          "Y Yell for sysop",
          "X Exit to CP/M",
          "Q Quit / logoff",
        ],
      };
    case "R":
      return {
        output: formatBoardMessages(host),
        pager: true,
      };
    case "P":
      state.bbsSubmode = "post-subject";
      state.bbsDraftSubject = null;
      return {
        output: [
          "Enter subject. Blank line cancels.",
        ],
      };
    case "F": {
      if (rest) {
        const n = parseInt(rest, 10);
        if (Number.isFinite(n)) {
          return handleDownloadPick(state, String(n));
        }
      }
      state.bbsSubmode = "download";
      return {
        output: [
          "File transfer area — archive-manifest/textfiles-bbs-index tag=bbs; enter file number to download:",
          ...formatFileListing(host),
        ],
      };
    }
    case "L":
      return { output: formatFileListing(host) };
    case "W": {
      const guest = state.bbsGuestName ?? "GUEST";
      const posts = messageCountForAuthor(host, guest);
      const sysop = sysopRecordForHost(host);
      return {
        output: [
          "Users online:",
          `  ${guest} (you, posts=${posts})`,
          sysop ? `  SYSOP:${sysop.owner} (idle, owns board)` : "  SYSOP (idle)",
          "  ARCHIVE (batch)",
        ],
      };
    }
    case "J":
      return {
        output: [JOKES[Math.floor(Math.random() * JOKES.length)]!],
      };
    case "S": {
      const claim = claimBbsSysop(state, host);
      if (claim.status === "login-required") {
        return {
          output: [
            "SYSOP panel:",
            "  Login required. Create or login to a Cyberscape account before claiming a board.",
            ...menuPrompt(),
          ],
        };
      }
      if (claim.status === "owned-by-other") {
        return {
          output: [
            "SYSOP panel:",
            `  Access denied: ${claim.record.owner} already administers ${claim.record.board}.`,
            `  Board file: ${claim.record.path}`,
            ...menuPrompt(),
          ],
        };
      }
      const prefix = claim.status === "claimed" ? "SYSOP claim recorded." : "SYSOP panel already owned.";
      return {
        output: [
          "SYSOP panel:",
          `  ${prefix}`,
          `  Board: ${claim.record.board}`,
          `  Host: ${claim.record.host}`,
          `  Owner: ${claim.record.owner}`,
          `  Claim file: ${claim.record.path}`,
          `  Privileges: ${claim.record.policy}`,
          ...menuPrompt(),
        ],
      };
    }
    case "Y":
      if (sysopRecordForHost(host)?.userId === state.userId) {
        return {
          output: [
            "*** YELL ***",
            "You are the sysop. The local console is already yours.",
          ],
        };
      }
      return {
        output: [
          "*** YELL ***",
          "Sysop has been paged. (They are probably debugging a 2400 baud handshake.)",
        ],
      };
    case "X":
      return {
        output: [
          "Returning to CP/M…",
          "Connection closed.",
        ],
        exit: true,
      };
    case "Q":
      return {
        output: ["Thank you for calling. Goodbye."],
        exit: true,
      };
    default:
      return { output: ["Unknown command. Type ? for help."] };
  }
}

/** Legacy helper for archive tag display in F area metadata. */
export function bbsFileAreaLines(): string[] {
  return formatFileAreas("bbs");
}
