import { createHash } from "node:crypto";

export type CorpusFileRecord = {
  filename: string;
  bytes: number;
  sha256: string;
  content: string;
};

function makeRecord(filename: string, content: string): CorpusFileRecord {
  return {
    filename,
    bytes: Buffer.byteLength(content, "utf8"),
    sha256: createHash("sha256").update(content).digest("hex"),
    content,
  };
}

export const BBS_CORPUS: CorpusFileRecord[] = [
  makeRecord(
    "README.BBS",
    [
      "Cyberscape BBS archive corpus",
      "",
      "These files are deliberately small, deterministic fixtures for the clone MVP.",
      "Use F to list, W to inspect who is online, and Q to leave the board cleanly.",
    ].join("\n"),
  ),
  makeRecord(
    "ANSI.TXT",
    [
      "ANSI art notes",
      "",
      "Use your terminal's imagination to reconstruct the old border-heavy screens.",
      "The archive only preserves the words here.",
    ].join("\n"),
  ),
  makeRecord(
    "SYSOP.NOTE",
    [
      "Sysop note",
      "",
      "The adjacency rule is intentional.",
      "Porthack only works when the target host is actually a neighbor.",
    ].join("\n"),
  ),
  makeRecord(
    "FILES.LST",
    [
      "File area index",
      "",
      "1. public releases",
      "2. shareware mirrors",
      "3. local tools and utilities",
    ].join("\n"),
  ),
  makeRecord(
    "WELCOME.MSG",
    [
      "Welcome message",
      "",
      "Login, browse the file area, and quit when you are finished.",
      "The clone keeps the loop readable and backend-authored.",
    ].join("\n"),
  ),
  makeRecord(
    "QWK-HELP.TXT",
    [
      "QWK help",
      "",
      "The board is a slow archive, not a feed.",
      "Download a file packet if you want to inspect it offline.",
    ].join("\n"),
  ),
  makeRecord(
    "ROOTKIT.EXE",
    [
      "Rootkit payload",
      "",
      "This archive drop contains the payload needed to take root on a host.",
      "Cyberscape treats it as a download-first kit rather than a magic verb.",
      "Pair it with the target operating system support kit before running.",
    ].join("\n"),
  ),
  makeRecord(
    "UNIXKIT.EXE",
    [
      "UNIX support kit",
      "",
      "Loader shims and account-table probes for UNIX-like hosts.",
      "Run ROOTKIT.EXE only after this support kit is present.",
    ].join("\n"),
  ),
  makeRecord(
    "VAXKIT.EXE",
    [
      "VAX/VMS support kit",
      "",
      "Mailbox, privilege, and image-activation probes for VAX-family hosts.",
      "Run ROOTKIT.EXE only after this support kit is present.",
    ].join("\n"),
  ),
  makeRecord(
    "CPMKIT.EXE",
    [
      "CP/M support kit",
      "",
      "BDOS and transient-program-area probes for smaller old micro hosts.",
      "Run ROOTKIT.EXE only after this support kit is present.",
    ].join("\n"),
  ),
];
