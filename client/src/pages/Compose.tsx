import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { VoiceButton } from "@/components/VoiceButton";
import { useSpeechSynthesis, useSpeechRecognition } from "@/hooks/useSpeech";
import { ArrowLeft, Send, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOfflineStorage } from "@/hooks/useOfflineStorage";
import { queryClient } from "@/lib/queryClient";

export default function Compose() {
  const [, setLocation] = useLocation();
  const { speak } = useSpeechSynthesis();
  const { toast } = useToast();
  const { saveDraft } = useOfflineStorage();
  
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [currentField, setCurrentField] = useState<"to" | "subject" | "body">("to");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      speak("You are now offline. Your drafts will be saved locally.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    speak("Composing new email. Say 'to', 'subject', or 'body' to select a field, then speak your text.", { rate: 0.9 });
  }, []);

  const handleVoiceResult = (transcript: string) => {
    const lower = transcript.toLowerCase();

    if (lower.includes("send email") || lower === "send") {
      handleSend();
    } else if (lower.includes("save draft")) {
      if (to || subject || body) {
        saveDraft(to, subject, body);
        speak("Email saved as draft.");
        toast({
          title: "Draft Saved",
          description: isOnline ? "Draft saved successfully." : "Draft saved offline.",
        });
      } else {
        speak("Nothing to save.");
      }
      setTimeout(() => setLocation("/inbox"), 1000);
    } else if (lower.includes("cancel") || lower.includes("back")) {
      speak("Canceling. Returning to inbox.");
      setLocation("/inbox");
    } else if (lower.startsWith("to ") || lower === "to" || lower.includes("recipient")) {
      setCurrentField("to");
      speak("Recipient field selected. Say the email address.");
    } else if (lower.startsWith("subject") || lower === "subject") {
      setCurrentField("subject");
      speak("Subject field selected. Say the subject.");
    } else if (lower.startsWith("body") || lower === "body" || lower.includes("message")) {
      setCurrentField("body");
      speak("Message field selected. Say your message.");
    } else if (lower.includes("period")) {
      if (currentField === "body") {
        setBody(prev => prev + ". ");
      }
    } else if (lower.includes("comma")) {
      if (currentField === "body") {
        setBody(prev => prev + ", ");
      }
    } else if (lower.includes("question mark")) {
      if (currentField === "body") {
        setBody(prev => prev + "? ");
      }
    } else if (lower.includes("new paragraph")) {
      if (currentField === "body") {
        setBody(prev => prev + "\n\n");
      }
    } else {
      if (currentField === "to") {
        setTo(transcript);
        speak(`Recipient set to ${transcript}. Say 'subject' to continue.`);
      } else if (currentField === "subject") {
        setSubject(transcript);
        speak(`Subject set to ${transcript}. Say 'body' to write your message.`);
      } else if (currentField === "body") {
        setBody(prev => prev + (prev ? " " : "") + transcript);
      }
    }
  };

  const { startListening, listening } = useSpeechRecognition(handleVoiceResult);

  const handleSend = async () => {
    if (!to || !subject || !body) {
      speak("Please fill in recipient, subject, and message before sending.");
      toast({
        title: "Incomplete Email",
        description: "Please fill in all fields before sending.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      speak("Sending email.");
      
      // Create email via API
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-user",
          sender: "Demo User",
          senderEmail: "demo@vocaleyes.com",
          recipient: to.split("@")[0] || "Recipient",
          recipientEmail: to,
          subject,
          body,
          isDraft: false,
          isSent: true,
          isInbox: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      // Invalidate the emails cache so inbox will refetch
      await queryClient.invalidateQueries({ queryKey: ['/api/emails'] });

      speak("Email sent successfully.");
      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully.",
      });
      setTimeout(() => setLocation("/inbox"), 1000);
    } catch (error) {
      speak("Error sending email. Please try again.");
      toast({
        title: "Send Failed",
        description: "Unable to send email. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-4 p-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              speak("Returning to inbox.");
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
        {!isOnline && (
          <div className="bg-yellow-100 dark:bg-yellow-900 border-4 border-yellow-500 p-6 text-center">
            <p className="text-3xl font-bold">Offline Mode</p>
            <p className="text-2xl mt-2">Your drafts will be saved locally</p>
          </div>
        )}
        
        <div className="flex flex-col items-center space-y-6">
          <VoiceButton listening={listening} onClick={startListening} />
          <div className="text-center space-y-2">
            <p className="text-3xl font-semibold">Currently editing: {currentField}</p>
            <p className="text-2xl text-muted-foreground">
              Say 'to', 'subject', or 'body' to switch fields
            </p>
          </div>
        </div>

        <Card className="p-12 border-4 space-y-8">
          <div className="space-y-4">
            <Label htmlFor="to" className="text-3xl font-semibold">To:</Label>
            <Input
              id="to"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => {
                setCurrentField("to");
                speak("Recipient field");
              }}
              data-testid="input-to"
              className="h-20 text-3xl border-4"
              placeholder="recipient@example.com"
              aria-label="Recipient email address"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="subject" className="text-3xl font-semibold">Subject:</Label>
            <Input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onFocus={() => {
                setCurrentField("subject");
                speak("Subject field");
              }}
              data-testid="input-subject"
              className="h-20 text-3xl border-4"
              placeholder="Email subject"
              aria-label="Email subject"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="body" className="text-3xl font-semibold">Message:</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onFocus={() => {
                setCurrentField("body");
                speak("Message field");
              }}
              data-testid="input-body"
              className="min-h-96 text-3xl border-4 leading-relaxed"
              placeholder="Say 'period', 'comma', 'question mark', or 'new paragraph' for punctuation"
              aria-label="Email message body"
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            size="lg"
            onClick={handleSend}
            data-testid="button-send"
            className="h-24 text-3xl"
          >
            <Send className="w-10 h-10 mr-4" />
            Send Email
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              if (to || subject || body) {
                saveDraft(to, subject, body);
                speak("Email saved as draft.");
                toast({
                  title: "Draft Saved",
                  description: isOnline ? "Draft saved successfully." : "Draft saved offline.",
                });
              }
              setTimeout(() => setLocation("/inbox"), 1000);
            }}
            data-testid="button-save-draft"
            className="h-24 text-3xl"
          >
            <Save className="w-10 h-10 mr-4" />
            Save Draft
          </Button>
        </div>
      </main>
    </div>
  );
}
