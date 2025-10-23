import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceButton } from "@/components/VoiceButton";
import { useSpeechSynthesis, useSpeechRecognition } from "@/hooks/useSpeech";
import { Mic, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { speak } = useSpeechSynthesis();
  const [authMode, setAuthMode] = useState<"voice" | "pin">("voice");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [voiceListening, setVoiceListening] = useState(false);

  useEffect(() => {
    speak("Welcome to Vocal Eyes. Please choose voice or PIN authentication.", { rate: 0.9 });
  }, []);

  const handleVoiceResult = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes("pin") || lowerTranscript.includes("password")) {
      setAuthMode("pin");
      speak("PIN authentication selected. Please enter your username and PIN.");
    } else if (lowerTranscript.includes("voice")) {
      setAuthMode("voice");
      speak("Voice authentication selected. Please say your username.");
    } else {
      setUsername(transcript);
      speak(`Username set to ${transcript}. Now authenticating with voice.`);
      handleVoiceLogin(transcript);
    }
    setVoiceListening(false);
  };

  const { startListening, listening } = useSpeechRecognition(handleVoiceResult, (error) => {
    speak(`Voice recognition error: ${error}. Please try again or use PIN authentication.`);
    setVoiceListening(false);
  });

  const handleVoiceLogin = async (user: string) => {
    speak("Voice authentication in progress.");
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user,
          voicePrintData: "voice-auth-demo",
        }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      speak("Authentication successful. Welcome to your inbox.");
      setTimeout(() => setLocation("/inbox"), 1000);
    } catch (error) {
      speak("Authentication failed. Please try again or use PIN.");
      toast({
        title: "Login Failed",
        description: "Voice authentication failed. Please try PIN login.",
        variant: "destructive",
      });
    }
  };

  const handlePinLogin = async () => {
    if (!username || !pin) {
      speak("Please enter both username and PIN.");
      toast({
        title: "Missing Information",
        description: "Please enter both username and PIN.",
        variant: "destructive",
      });
      return;
    }

    speak(`Logging in ${username} with PIN.`);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          pin,
        }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      speak("Authentication successful. Welcome to your inbox.");
      setTimeout(() => setLocation("/inbox"), 1000);
    } catch (error) {
      speak("Login failed. Please check your username and PIN.");
      toast({
        title: "Login Failed",
        description: "Invalid username or PIN. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVoiceButtonClick = () => {
    if (listening) {
      speak("Voice input stopped.");
      setVoiceListening(false);
    } else {
      speak("Listening for voice command.");
      setVoiceListening(true);
      startListening();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-4xl border-4">
        <CardHeader className="text-center space-y-6">
          <CardTitle className="text-6xl font-bold">Vocal Eyes</CardTitle>
          <CardDescription className="text-3xl">
            Voice-Based Email System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-12">
          <div className="flex flex-col items-center space-y-8">
            <VoiceButton
              listening={listening}
              onClick={handleVoiceButtonClick}
            />
            <p className="text-2xl text-center">
              {listening ? "Listening..." : "Click or say 'voice' or 'PIN' to choose authentication"}
            </p>
          </div>

          <div className="flex gap-8 justify-center">
            <Button
              size="lg"
              onClick={() => {
                setAuthMode("voice");
                speak("Voice authentication selected.");
              }}
              data-testid="button-voice-auth"
              className={cn(
                "h-24 px-12 text-2xl",
                authMode === "voice" && "ring-4 ring-yellow-400"
              )}
            >
              <Mic className="w-8 h-8 mr-4" />
              Voice Login
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setAuthMode("pin");
                speak("PIN authentication selected.");
              }}
              data-testid="button-pin-auth"
              className={cn(
                "h-24 px-12 text-2xl",
                authMode === "pin" && "ring-4 ring-yellow-400"
              )}
            >
              <Hash className="w-8 h-8 mr-4" />
              PIN Login
            </Button>
          </div>

          {authMode === "pin" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="username" className="text-3xl">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  data-testid="input-username"
                  className="h-20 text-3xl border-4"
                  onFocus={() => speak("Username field")}
                  aria-label="Username"
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="pin" className="text-3xl">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  data-testid="input-pin"
                  className="h-20 text-3xl border-4"
                  onFocus={() => speak("PIN field")}
                  aria-label="PIN"
                />
              </div>
              <Button
                size="lg"
                onClick={handlePinLogin}
                data-testid="button-login"
                className="w-full h-24 text-3xl"
              >
                Login with PIN
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
