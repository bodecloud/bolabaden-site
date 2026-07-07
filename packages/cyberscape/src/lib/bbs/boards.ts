import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { bbsMessages } from "@/lib/db/schema";

export interface BbsBoardMessage {
  author: string;
  subject: string;
  body: string;
  createdAt: number;
}

const SEEDED_MESSAGES: BbsBoardMessage[] = [
  {
    author: "SYSOP",
    subject: "Welcome to the dialup board",
    body: "Leave a note, pull a file, and keep the carrier clean.",
    createdAt: Date.UTC(1984, 0, 1, 8, 0, 0),
  },
  {
    author: "ARCHIVE",
    subject: "File areas are tagged",
    body: "The manifest shows which collections are public and which stay dev-only.",
    createdAt: Date.UTC(1984, 0, 2, 12, 30, 0),
  },
];

export function createBoardMessage(
  host: string,
  author: string,
  subject: string,
  body: string,
): void {
  db.insert(bbsMessages).values({
    host,
    author,
    subject,
    body,
    createdAt: Date.now(),
  }).run();
}

export function messagesForBoard(host: string): BbsBoardMessage[] {
  const rows = db.select()
    .from(bbsMessages)
    .where(eq(bbsMessages.host, host))
    .orderBy(desc(bbsMessages.createdAt))
    .limit(10)
    .all();

  return [
    ...SEEDED_MESSAGES,
    ...rows.map((row) => ({
      author: row.author,
      subject: row.subject,
      body: row.body,
      createdAt: row.createdAt,
    })),
  ];
}

export function messageCountForAuthor(host: string, author: string): number {
  return db.select()
    .from(bbsMessages)
    .where(and(eq(bbsMessages.host, host), eq(bbsMessages.author, author)))
    .all()
    .length;
}

export function formatBoardMessages(host: string): string[] {
  const messages = messagesForBoard(host);
  const lines = [
    `Message base: ${host.toUpperCase()} GENERAL`,
    "No  Author       Date         Subject",
    "--  ------       ----         -------",
  ];

  messages.forEach((message, index) => {
    const date = new Date(message.createdAt).toISOString().slice(0, 10);
    lines.push(
      `${String(index + 1).padStart(2)}  ${message.author.padEnd(11).slice(0, 11)} ${date}   ${message.subject}`,
    );
    lines.push(`    ${message.body}`);
  });

  return lines;
}
