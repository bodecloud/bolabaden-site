import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "node:path";

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "cyberscape.db");

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

function ensureColumn(table: string, column: string, ddl: string) {
  const columns = sqlite.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name?: string }>;
  if (!columns.some((col) => col.name === column)) {
    sqlite.exec(ddl);
  }
}

export function ensureDb() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      badges TEXT NOT NULL DEFAULT '[]',
      home_host TEXT NOT NULL DEFAULT 'cyberscape',
      disk_quota INTEGER NOT NULL DEFAULT 64,
      system_level INTEGER NOT NULL DEFAULT 1,
      desktop_theme TEXT NOT NULL DEFAULT 'xp'
    );
    CREATE TABLE IF NOT EXISTS host_state (
      hostname TEXT PRIMARY KEY,
      root_user_id INTEGER,
      login_user_ids TEXT NOT NULL DEFAULT '[]'
    );
    CREATE TABLE IF NOT EXISTS shell_sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      state TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bbs_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      host TEXT NOT NULL,
      author TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS mail_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS basic_programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      lines TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS saved_states (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS usenet_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      author TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS user_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      path TEXT NOT NULL,
      body TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
  ensureColumn("users", "ssh_public_key", "ALTER TABLE users ADD COLUMN ssh_public_key TEXT;");
  ensureColumn("users", "desktop_theme", "ALTER TABLE users ADD COLUMN desktop_theme TEXT NOT NULL DEFAULT 'xp';");
}
