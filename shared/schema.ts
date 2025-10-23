import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  pin: text("pin"),
  voicePrintData: text("voice_print_data"),
  preferredVoice: text("preferred_voice").default("default"),
  voiceSpeed: integer("voice_speed").default(1),
  preferredLanguage: text("preferred_language").default("en-US"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emails = pgTable("emails", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sender: text("sender").notNull(),
  senderEmail: text("sender_email").notNull(),
  recipient: text("recipient").notNull(),
  recipientEmail: text("recipient_email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  isRead: boolean("is_read").default(false),
  isPriority: boolean("is_priority").default(false),
  isDraft: boolean("is_draft").default(false),
  isInbox: boolean("is_inbox").default(true),
  isSent: boolean("is_sent").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const voiceCommands = pgTable("voice_commands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  command: text("command").notNull(),
  action: text("action").notNull(),
  isCustom: boolean("is_custom").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEmailSchema = createInsertSchema(emails).omit({
  id: true,
  timestamp: true,
});

export const insertVoiceCommandSchema = createInsertSchema(voiceCommands).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type Email = typeof emails.$inferSelect;
export type InsertVoiceCommand = z.infer<typeof insertVoiceCommandSchema>;
export type VoiceCommand = typeof voiceCommands.$inferSelect;

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  pin: z.string().min(4, "PIN must be at least 4 digits").optional(),
  voicePrintData: z.string().optional(),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
