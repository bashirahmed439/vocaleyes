import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { EmailCard } from "@/components/EmailCard";
import { VoiceButton } from "@/components/VoiceButton";
import { useSpeechSynthesis, useSpeechRecognition } from "@/hooks/useSpeech";
import { useQuery } from "@tanstack/react-query";
import { Mail, Plus, Settings, LogOut, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Email } from "@shared/schema";

export default function Inbox() {
  const [, setLocation] = useLocation();
  const { speak } = useSpeechSynthesis();
  const [currentCommand, setCurrentCommand] = useState("");

  const { data: emails = [], isLoading } = useQuery<Email[]>({
    queryKey: ['/api/emails'],
  });

  useEffect(() => {
    const unreadCount = emails.filter(e => !e.isRead).length;
    speak(`Inbox loaded. You have ${emails.length} emails, ${unreadCount} unread.`, { rate: 0.9 });
  }, [emails.length]);

  const handleVoiceResult = (transcript: string) => {
    setCurrentCommand(transcript);
    const lower = transcript.toLowerCase();

    if (lower.includes("compose") || lower.includes("new email") || lower.includes("write")) {
      speak("Opening email composition.");
      setLocation("/compose");
    } else if (lower.includes("settings")) {
      speak("Opening settings.");
      setLocation("/settings");
    } else if (lower.includes("help")) {
      speak("Opening help.");
      setLocation("/help");
    } else if (lower.includes("logout") || lower.includes("log out")) {
      speak("Logging out. Goodbye.");
      setTimeout(() => setLocation("/"), 1000);
    } else if (lower.includes("read") || lower.includes("open")) {
      const match = lower.match(/(\d+)/);
      if (match && emails[parseInt(match[1]) - 1]) {
        const index = parseInt(match[1]) - 1;
        speak(`Opening email ${match[1]} from ${emails[index].sender}`);
        setLocation(`/email/${emails[index].id}`);
      } else if (emails.length > 0) {
        speak(`Opening first email from ${emails[0].sender}`);
        setLocation(`/email/${emails[0].id}`);
      }
    } else {
      speak(`Command not recognized: ${transcript}. Say help for available commands.`);
    }
  };

  const { startListening, listening } = useSpeechRecognition(handleVoiceResult);

  const handleEmailClick = (email: Email, index: number) => {
    speak(`Opening email from ${email.sender}`);
    setLocation(`/email/${email.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="w-24 h-24 border-8 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-4xl">Loading inbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-4 p-8 bg-card">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <Mail className="w-16 h-16" aria-hidden="true" />
            <h1 className="text-6xl font-bold">Inbox</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                speak("Opening help");
                setLocation("/help");
              }}
              data-testid="button-help"
              className="w-20 h-20"
              aria-label="Help"
            >
              <HelpCircle className="w-10 h-10" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => {
                speak("Logging out. Goodbye.");
                setTimeout(() => setLocation("/"), 1000);
              }}
              data-testid="button-logout"
              className="w-20 h-20"
              aria-label="Logout"
            >
              <LogOut className="w-10 h-10" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-12">
        <div className="flex flex-col items-center space-y-8">
          <VoiceButton listening={listening} onClick={startListening} />
          {currentCommand && (
            <div className="text-center space-y-2">
              <p className="text-2xl text-muted-foreground">You said:</p>
              <p className="text-3xl font-semibold">{currentCommand}</p>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          <Button
            size="lg"
            onClick={() => {
              speak("Opening email composition.");
              setLocation("/compose");
            }}
            data-testid="button-compose"
            className="flex-1 h-24 text-3xl"
          >
            <Plus className="w-10 h-10 mr-4" />
            Compose New Email
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              speak("Opening settings.");
              setLocation("/settings");
            }}
            data-testid="button-settings"
            className="flex-1 h-24 text-3xl"
          >
            <Settings className="w-10 h-10 mr-4" />
            Settings
          </Button>
        </div>

        {emails.length === 0 ? (
          <Card className="p-16 text-center border-4">
            <Mail className="w-32 h-32 mx-auto mb-8 text-muted-foreground" />
            <p className="text-4xl font-semibold mb-4">No emails yet</p>
            <p className="text-3xl text-muted-foreground">
              Your inbox is empty. Compose a new email to get started.
            </p>
          </Card>
        ) : (
          <div className="space-y-6" role="list" aria-label="Email list">
            {emails.map((email, index) => (
              <EmailCard
                key={email.id}
                email={email}
                onClick={() => handleEmailClick(email, index)}
                index={index}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
