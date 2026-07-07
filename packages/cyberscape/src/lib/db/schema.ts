import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  badges: text("badges", { mode: "json" }).$type<string[]>().notNull().default([]),
  homeHost: text("home_host").notNull().default("cyberscape"),
  diskQuota: integer("disk_quota").notNull().default(64),
  systemLevel: integer("system_level").notNull().default(1),
  sshPublicKey: text("ssh_public_key"),
  desktopTheme: text("desktop_theme").notNull().default("xp"),
});

export const hostState = sqliteTable("host_state", {
  hostname: text("hostname").primaryKey(),
  rootUserId: integer("root_user_id"),
  loginUserIds: text("login_user_ids", { mode: "json" }).$type<number[]>().notNull().default([]),
});

export const shellSessions = sqliteTable("shell_sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id"),
  state: text("state", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const bbsMessages = sqliteTable("bbs_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  host: text("host").notNull(),
  author: text("author").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const mailMessages = sqliteTable("mail_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sender: text("sender").notNull(),
  recipient: text("recipient").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const basicPrograms = sqliteTable("basic_programs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  lines: text("lines", { mode: "json" }).$type<string[]>().notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const savedStates = sqliteTable("saved_states", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  state: text("state", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const usenetArticles = sqliteTable("usenet_articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  group: text("group_name").notNull(),
  subject: text("subject").notNull(),
  author: text("author").notNull(),
  body: text("body", { mode: "json" }).$type<string[]>().notNull(),
  createdAt: integer("created_at").notNull(),
});

export const userFiles = sqliteTable("user_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  path: text("path").notNull(),
  body: text("body").notNull(),
  updatedAt: integer("updated_at").notNull(),
});
