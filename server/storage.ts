import { type User, type InsertUser, type Email, type InsertEmail, type VoiceCommand, type InsertVoiceCommand } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Email methods
  getEmail(id: string): Promise<Email | undefined>;
  getEmailsByUser(userId: string): Promise<Email[]>;
  createEmail(email: InsertEmail): Promise<Email>;
  updateEmail(id: string, updates: Partial<Email>): Promise<Email | undefined>;
  deleteEmail(id: string): Promise<boolean>;

  // Voice command methods
  getVoiceCommandsByUser(userId: string): Promise<VoiceCommand[]>;
  createVoiceCommand(command: InsertVoiceCommand): Promise<VoiceCommand>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emails: Map<string, Email>;
  private voiceCommands: Map<string, VoiceCommand>;

  constructor() {
    this.users = new Map();
    this.emails = new Map();
    this.voiceCommands = new Map();

    // Create a demo user and sample emails
    this.initializeDemo();
  }

  private async initializeDemo() {
    // Create demo user
    const demoUser: User = {
      id: "demo-user",
      username: "demo",
      email: "demo@vocaleyes.com",
      pin: "1234",
      voicePrintData: null,
      preferredVoice: "default",
      voiceSpeed: 1,
      preferredLanguage: "en-US",
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);

    // Create sample emails
    const sampleEmails: Email[] = [
      {
        id: randomUUID(),
        userId: "demo-user",
        sender: "Sarah Johnson",
        senderEmail: "sarah@example.com",
        recipient: "Demo User",
        recipientEmail: "demo@vocaleyes.com",
        subject: "Welcome to Vocal Eyes!",
        body: "Hello! Welcome to Vocal Eyes, your voice-powered email system. This application is designed to be fully accessible through voice commands and audio feedback. Try saying 'compose new email' to get started, or 'help' to hear all available commands. Enjoy your accessible email experience!",
        isRead: false,
        isPriority: true,
        isDraft: false,
        isInbox: true,
        isSent: false,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        id: randomUUID(),
        userId: "demo-user",
        sender: "Tech Support",
        senderEmail: "support@vocaleyes.com",
        recipient: "Demo User",
        recipientEmail: "demo@vocaleyes.com",
        subject: "Tips for Using Voice Commands",
        body: "Here are some helpful tips: 1. Speak clearly and at a moderate pace. 2. Wait for the microphone to activate before speaking. 3. Use punctuation commands like 'period', 'comma', and 'question mark' when composing emails. 4. Say 'repeat that' if you missed something. 5. You can customize voice speed and language in Settings. Happy emailing!",
        isRead: false,
        isPriority: false,
        isDraft: false,
        isInbox: true,
        isSent: false,
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      },
      {
        id: randomUUID(),
        userId: "demo-user",
        sender: "John Smith",
        senderEmail: "john@example.com",
        recipient: "Demo User",
        recipientEmail: "demo@vocaleyes.com",
        subject: "Meeting Tomorrow",
        body: "Hi! Just a reminder that we have a meeting scheduled for tomorrow at 2 PM. Please let me know if you need to reschedule. Looking forward to discussing the project updates. Best regards, John",
        isRead: true,
        isPriority: false,
        isDraft: false,
        isInbox: true,
        isSent: false,
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
      },
    ];

    sampleEmails.forEach(email => {
      this.emails.set(email.id, email);
    });

    // Create default voice commands
    const defaultCommands: VoiceCommand[] = [
      { id: randomUUID(), userId: "demo-user", command: "check inbox", action: "navigate:inbox", isCustom: false, createdAt: new Date() },
      { id: randomUUID(), userId: "demo-user", command: "compose email", action: "navigate:compose", isCustom: false, createdAt: new Date() },
      { id: randomUUID(), userId: "demo-user", command: "settings", action: "navigate:settings", isCustom: false, createdAt: new Date() },
      { id: randomUUID(), userId: "demo-user", command: "help", action: "navigate:help", isCustom: false, createdAt: new Date() },
    ];

    defaultCommands.forEach(cmd => {
      this.voiceCommands.set(cmd.id, cmd);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      pin: insertUser.pin || null,
      voicePrintData: insertUser.voicePrintData || null,
      preferredVoice: insertUser.preferredVoice || "default",
      voiceSpeed: insertUser.voiceSpeed || 1,
      preferredLanguage: insertUser.preferredLanguage || "en-US",
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Email methods
  async getEmail(id: string): Promise<Email | undefined> {
    return this.emails.get(id);
  }

  async getEmailsByUser(userId: string): Promise<Email[]> {
    return Array.from(this.emails.values())
      .filter(email => email.userId === userId && email.isInbox)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createEmail(insertEmail: InsertEmail): Promise<Email> {
    const id = randomUUID();
    const email: Email = {
      ...insertEmail,
      id,
      timestamp: new Date(),
      isRead: insertEmail.isRead ?? false,
      isPriority: insertEmail.isPriority ?? false,
      isDraft: insertEmail.isDraft ?? false,
      isInbox: insertEmail.isInbox ?? true,
      isSent: insertEmail.isSent ?? false,
    };
    this.emails.set(id, email);
    return email;
  }

  async updateEmail(id: string, updates: Partial<Email>): Promise<Email | undefined> {
    const email = this.emails.get(id);
    if (!email) return undefined;

    const updatedEmail = { ...email, ...updates };
    this.emails.set(id, updatedEmail);
    return updatedEmail;
  }

  async deleteEmail(id: string): Promise<boolean> {
    return this.emails.delete(id);
  }

  // Voice command methods
  async getVoiceCommandsByUser(userId: string): Promise<VoiceCommand[]> {
    return Array.from(this.voiceCommands.values())
      .filter(cmd => cmd.userId === userId);
  }

  async createVoiceCommand(insertCommand: InsertVoiceCommand): Promise<VoiceCommand> {
    const id = randomUUID();
    const command: VoiceCommand = {
      ...insertCommand,
      id,
      createdAt: new Date(),
      isCustom: insertCommand.isCustom ?? true,
    };
    this.voiceCommands.set(id, command);
    return command;
  }
}

export const storage = new MemStorage();
