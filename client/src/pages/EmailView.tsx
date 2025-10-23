import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VoiceButton } from "@/components/VoiceButton";
import { useSpeechSynthesis, useSpeechRecognition } from "@/hooks/useSpeech";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Reply, Forward, Trash2, Star } from "lucide-react";
import type { Email } from "@shared/schema";

export default function EmailView() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/email/:id");
  const { speak, cancel } = useSpeechSynthesis();
  const [isPaused, setIsPaused] = useState(false);

  const { data: email, isLoading } = useQuery<Email>({
    queryKey: ['/api/emails', params?.id],
    enabled: !!params?.id,
  });

  useEffect(() => {
    if (email) {
      const text = `Email from ${email.sender}. Subject: ${email.subject}. ${email.body}`;
      speak(text, { rate: 0.9 });
    }
  }, [email?.id]);

  const handleVoiceResult = (transcript: string) => {
    const lower = transcript.toLowerCase();

    if (lower.includes("back") || lower.includes("inbox")) {
      speak("Returning to inbox.");
      cancel();
      setLocation("/inbox");
    } else if (lower.includes("reply")) {
      speak("Opening reply.");
      cancel();
      setLocation(`/compose?replyTo=${email?.id}`);
    } else if (lower.includes("forward")) {
      speak("Opening forward.");
      cancel();
      setLocation(`/compose?forward=${email?.id}`);
    } else if (lower.includes("delete")) {
      speak("Email deleted.");
      cancel();
      setTimeout(() => setLocation("/inbox"), 1000);
    } else if (lower.includes("repeat") || lower.includes("read again")) {
      if (email) {
        const text = `Email from ${email.sender}. Subject: ${email.subject}. ${email.body}`;
        speak(text, { rate: 0.9 });
      }
    } else if (lower.includes("pause")) {
      cancel();
      setIsPaused(true);
      speak("Paused.");
    } else if (lower.includes("resume") || lower.includes("continue")) {
      if (email && isPaused) {
        speak(email.body, { rate: 0.9 });
        setIsPaused(false);
      }
    } else {
      speak(`Command not recognized: ${transcript}`);
    }
  };

  const { startListening, listening } = useSpeechRecognition(handleVoiceResult);

  if (isLoading || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="w-24 h-24 border-8 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-4xl">Loading email...</p>
        </div>
      </div>
    );
  }

  const timestamp = new Date(email.timestamp).toLocaleString();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-4 p-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              speak("Returning to inbox.");
              cancel();
              setLocation("/inbox");
            }}
            data-testid="button-back"
            className="h-20 px-8 text-2xl"
          >
            <ArrowLeft className="w-8 h-8 mr-4" />
            Back to Inbox
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-12">
        <div className="flex flex-col items-center space-y-6">
          <VoiceButton listening={listening} onClick={startListening} />
          <p className="text-2xl text-center text-muted-foreground">
            Say: Reply, Forward, Delete, Pause, Resume, Repeat, or Back
          </p>
        </div>

        <Card className="p-12 border-4 space-y-8">
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h1 className="text-5xl font-bold mb-4">{email.sender}</h1>
                <p className="text-3xl text-muted-foreground mb-2">{email.senderEmail}</p>
                <p className="text-2xl text-muted-foreground">{timestamp}</p>
              </div>
              {email.isPriority && (
                <Star className="w-16 h-16 text-red-500" aria-label="Priority email" />
              )}
            </div>

            <div className="border-t-4 pt-8">
              <h2 className="text-4xl font-semibold mb-6">{email.subject}</h2>
              <div className="text-3xl leading-relaxed whitespace-pre-wrap">
                {email.body}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button
            size="lg"
            onClick={() => {
              speak("Opening reply.");
              cancel();
              setLocation(`/compose?replyTo=${email.id}`);
            }}
            data-testid="button-reply"
            className="h-24 text-3xl"
          >
            <Reply className="w-10 h-10 mr-4" />
            Reply
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              speak("Opening forward.");
              cancel();
              setLocation(`/compose?forward=${email.id}`);
            }}
            data-testid="button-forward"
            className="h-24 text-3xl"
          >
            <Forward className="w-10 h-10 mr-4" />
            Forward
          </Button>
          <Button
            size="lg"
            variant="destructive"
            onClick={() => {
              speak("Email deleted.");
              cancel();
              setTimeout(() => setLocation("/inbox"), 1000);
            }}
            data-testid="button-delete"
            className="h-24 text-3xl"
          >
            <Trash2 className="w-10 h-10 mr-4" />
            Delete
          </Button>
        </div>
      </main>
    </div>
  );
}
