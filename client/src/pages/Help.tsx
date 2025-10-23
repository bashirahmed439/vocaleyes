import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSpeechSynthesis } from "@/hooks/useSpeech";
import { ArrowLeft, Mic, Mail, Send, Settings as SettingsIcon } from "lucide-react";

export default function Help() {
  const [, setLocation] = useLocation();
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    speak("Help page. Here are the available voice commands.", { rate: 0.9 });
  }, []);

  const commands = [
    { category: "Navigation", icon: Mail, items: [
      "Check inbox",
      "Compose new email",
      "Settings",
      "Help",
      "Back",
      "Logout",
    ]},
    { category: "Reading Emails", icon: Mail, items: [
      "Read email",
      "Open email [number]",
      "Next email",
      "Previous email",
      "Repeat that",
      "Pause",
      "Resume",
    ]},
    { category: "Email Actions", icon: Send, items: [
      "Reply",
      "Forward",
      "Delete",
      "Mark as important",
      "Mark as unread",
    ]},
    { category: "Composing", icon: Mic, items: [
      "To [email address]",
      "Subject [text]",
      "Body [text]",
      "Period / Comma / Question mark",
      "New paragraph",
      "Send email",
      "Save draft",
      "Cancel",
    ]},
  ];

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
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">Voice Commands</h1>
          <p className="text-3xl text-muted-foreground">
            Speak these commands to control Vocal Eyes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {commands.map(({ category, icon: Icon, items }) => (
            <Card key={category} className="p-8 border-4 space-y-6">
              <div className="flex items-center gap-4">
                <Icon className="w-12 h-12" aria-hidden="true" />
                <h2 className="text-4xl font-bold">{category}</h2>
              </div>
              <ul className="space-y-4" role="list">
                {items.map((command) => (
                  <li key={command} className="text-2xl pl-4 border-l-4 border-primary">
                    "{command}"
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <Card className="p-12 border-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <SettingsIcon className="w-16 h-16" aria-hidden="true" />
              <h2 className="text-4xl font-bold">Tips for Best Results</h2>
            </div>
            <ul className="space-y-4 text-2xl leading-relaxed" role="list">
              <li className="pl-4 border-l-4 border-blue-500">
                Speak clearly and at a moderate pace
              </li>
              <li className="pl-4 border-l-4 border-blue-500">
                Use the microphone button and wait for the beep before speaking
              </li>
              <li className="pl-4 border-l-4 border-blue-500">
                Say "help" anytime to hear available commands
              </li>
              <li className="pl-4 border-l-4 border-blue-500">
                Use "repeat that" if you missed something
              </li>
              <li className="pl-4 border-l-4 border-blue-500">
                You can also use keyboard navigation as a backup
              </li>
            </ul>
          </div>
        </Card>
      </main>
    </div>
  );
}
