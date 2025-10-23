import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSpeechSynthesis } from "@/hooks/useSpeech";
import { ArrowLeft, Volume2, Mic } from "lucide-react";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { speak } = useSpeechSynthesis();
  
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [language, setLanguage] = useState("en-US");

  useEffect(() => {
    speak("Settings page. Adjust voice speed, volume, and language preferences.", { rate: 0.9 });
  }, []);

  const handleSpeedChange = (value: number[]) => {
    setVoiceSpeed(value[0]);
    speak(`Voice speed set to ${value[0].toFixed(1)}`, { rate: value[0] });
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    speak(`Volume set to ${Math.round(value[0] * 100)} percent`);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    const langNames: Record<string, string> = {
      "en-US": "English US",
      "en-GB": "English UK",
      "es-ES": "Spanish",
      "fr-FR": "French",
      "de-DE": "German",
      "hi-IN": "Hindi",
    };
    speak(`Language changed to ${langNames[value] || value}`);
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
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">Settings</h1>
          <p className="text-3xl text-muted-foreground">Customize your voice preferences</p>
        </div>

        <Card className="p-12 border-4 space-y-16">
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <Mic className="w-16 h-16" aria-hidden="true" />
              <Label htmlFor="speed" className="text-4xl font-semibold">Voice Speed</Label>
            </div>
            <div className="space-y-6">
              <Slider
                id="speed"
                min={0.5}
                max={2}
                step={0.1}
                value={[voiceSpeed]}
                onValueChange={handleSpeedChange}
                data-testid="slider-speed"
                className="w-full"
                aria-label="Voice speed control"
              />
              <p className="text-3xl text-center">{voiceSpeed.toFixed(1)}x</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <Volume2 className="w-16 h-16" aria-hidden="true" />
              <Label htmlFor="volume" className="text-4xl font-semibold">Volume</Label>
            </div>
            <div className="space-y-6">
              <Slider
                id="volume"
                min={0}
                max={1}
                step={0.1}
                value={[volume]}
                onValueChange={handleVolumeChange}
                data-testid="slider-volume"
                className="w-full"
                aria-label="Volume control"
              />
              <p className="text-3xl text-center">{Math.round(volume * 100)}%</p>
            </div>
          </div>

          <div className="space-y-8">
            <Label htmlFor="language" className="text-4xl font-semibold">Language</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger 
                id="language"
                className="h-20 text-3xl border-4"
                data-testid="select-language"
                aria-label="Language selection"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US" className="text-2xl h-16">English (US)</SelectItem>
                <SelectItem value="en-GB" className="text-2xl h-16">English (UK)</SelectItem>
                <SelectItem value="es-ES" className="text-2xl h-16">Spanish</SelectItem>
                <SelectItem value="fr-FR" className="text-2xl h-16">French</SelectItem>
                <SelectItem value="de-DE" className="text-2xl h-16">German</SelectItem>
                <SelectItem value="hi-IN" className="text-2xl h-16">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Button
          size="lg"
          onClick={() => {
            speak("Settings saved. Returning to inbox.");
            setTimeout(() => setLocation("/inbox"), 1000);
          }}
          data-testid="button-save-settings"
          className="w-full h-24 text-3xl"
        >
          Save Settings
        </Button>
      </main>
    </div>
  );
}
