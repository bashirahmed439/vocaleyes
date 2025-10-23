import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmailSchema, insertVoiceCommandSchema, loginSchema } from "@shared/schema";
import { processVoiceCommand, analyzeEmailPriority, generateEmailSuggestion } from "./lib/openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(credentials.username);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Simple PIN check (in production, would use proper authentication)
      if (credentials.pin && user.pin !== credentials.pin) {
        return res.status(401).json({ error: "Invalid PIN" });
      }

      res.json({ user });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Email routes
  app.get("/api/emails", async (req, res) => {
    try {
      // In production, would get userId from session
      const userId = "demo-user";
      const emails = await storage.getEmailsByUser(userId);
      res.json(emails);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  app.get("/api/emails/:id", async (req, res) => {
    try {
      const email = await storage.getEmail(req.params.id);
      
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }

      // Mark as read
      await storage.updateEmail(email.id, { isRead: true });

      res.json(email);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch email" });
    }
  });

  app.post("/api/emails", async (req, res) => {
    try {
      const emailData = insertEmailSchema.parse(req.body);
      
      // Analyze priority using AI (optional enhancement)
      let isPriority = emailData.isPriority || false;
      if (process.env.OPENAI_API_KEY) {
        try {
          const analysis = await analyzeEmailPriority(emailData.subject, emailData.body);
          isPriority = analysis.isPriority;
        } catch (error) {
          console.error("Priority analysis failed, using default:", error);
          // Continue without AI analysis
        }
      }

      const email = await storage.createEmail({
        ...emailData,
        isPriority,
      });

      res.json(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid email data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create email" });
    }
  });

  app.patch("/api/emails/:id", async (req, res) => {
    try {
      const updates = req.body;
      const email = await storage.updateEmail(req.params.id, updates);
      
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }

      res.json(email);
    } catch (error) {
      res.status(500).json({ error: "Failed to update email" });
    }
  });

  app.delete("/api/emails/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEmail(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Email not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete email" });
    }
  });

  // Voice command processing (optional AI feature)
  app.post("/api/voice/process", async (req, res) => {
    try {
      const { transcript, context } = req.body;
      
      if (!transcript) {
        return res.status(400).json({ error: "Transcript is required" });
      }

      if (!process.env.OPENAI_API_KEY) {
        // Graceful degradation: return simple command parsing without AI
        return res.json({
          intent: "Voice processing available without AI",
          action: "unknown",
          confidence: 0.5
        });
      }

      try {
        const result = await processVoiceCommand(transcript, context);
        res.json(result);
      } catch (error) {
        console.error("OpenAI processing error:", error);
        res.json({
          intent: "AI processing failed",
          action: "unknown",
          confidence: 0
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to process voice command" });
    }
  });

  // Email suggestion with AI (optional feature)
  app.post("/api/email/suggest", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.json({ 
          suggestion: "AI email suggestions are not available. OpenAI API key not configured."
        });
      }

      try {
        const suggestion = await generateEmailSuggestion(prompt);
        res.json({ suggestion });
      } catch (error) {
        console.error("OpenAI suggestion error:", error);
        res.json({ 
          suggestion: "Unable to generate AI suggestion at this time."
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to generate suggestion" });
    }
  });

  // Voice commands
  app.get("/api/voice-commands", async (req, res) => {
    try {
      // In production, would get userId from session
      const userId = "demo-user";
      const commands = await storage.getVoiceCommandsByUser(userId);
      res.json(commands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch voice commands" });
    }
  });

  app.post("/api/voice-commands", async (req, res) => {
    try {
      const commandData = insertVoiceCommandSchema.parse(req.body);
      const command = await storage.createVoiceCommand(commandData);
      res.json(command);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid command data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create voice command" });
    }
  });

  // User settings
  app.patch("/api/user/settings", async (req, res) => {
    try {
      // In production, would get userId from session
      const userId = "demo-user";
      const updates = req.body;
      
      const user = await storage.updateUser(userId, updates);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
