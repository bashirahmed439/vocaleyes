import OpenAI from "openai";

// Using javascript_openai blueprint integration
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function processVoiceCommand(transcript: string, context?: string): Promise<{
  intent: string;
  action: string;
  confidence: number;
}> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a voice command processor for an accessible email system. Analyze the user's spoken command and determine the intent and action. 
          Available actions: navigate:inbox, navigate:compose, navigate:settings, navigate:help, email:read, email:reply, email:forward, email:delete, email:send, email:draft.
          Respond with JSON in this format: { "intent": "description", "action": "action_code", "confidence": 0-1 }`,
        },
        {
          role: "user",
          content: context ? `Context: ${context}\n\nCommand: ${transcript}` : transcript,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 256,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      intent: result.intent || "unknown",
      action: result.action || "unknown",
      confidence: Math.max(0, Math.min(1, result.confidence || 0)),
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      intent: "error",
      action: "unknown",
      confidence: 0,
    };
  }
}

export async function generateEmailSuggestion(prompt: string): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a helpful email assistant. Generate professional, clear email content based on the user's request.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_completion_tokens: 512,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I apologize, but I encountered an error generating the email suggestion. Please try again.";
  }
}

export async function analyzeEmailPriority(subject: string, body: string): Promise<{
  isPriority: boolean;
  reason: string;
}> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `Analyze if an email should be marked as priority based on its subject and content. 
          Priority emails include: urgent requests, time-sensitive matters, important notifications, meetings, or action items.
          Respond with JSON: { "isPriority": boolean, "reason": "explanation" }`,
        },
        {
          role: "user",
          content: `Subject: ${subject}\n\nBody: ${body}`,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 256,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      isPriority: result.isPriority || false,
      reason: result.reason || "Standard email",
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      isPriority: false,
      reason: "Unable to analyze priority",
    };
  }
}
