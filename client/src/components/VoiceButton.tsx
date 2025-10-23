import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  listening: boolean;
  onClick: () => void;
  className?: string;
}

export function VoiceButton({ listening, onClick, className }: VoiceButtonProps) {
  return (
    <Button
      size="icon"
      onClick={onClick}
      data-testid="button-voice-control"
      className={cn(
        "w-32 h-32 rounded-full transition-all duration-300",
        listening 
          ? "bg-green-500 hover:bg-green-600 animate-pulse scale-110" 
          : "bg-primary hover:bg-primary/90",
        className
      )}
      aria-label={listening ? "Listening - Click to stop" : "Click to start voice command"}
    >
      {listening ? (
        <Mic className="w-16 h-16 text-white" aria-hidden="true" />
      ) : (
        <MicOff className="w-16 h-16 text-white" aria-hidden="true" />
      )}
    </Button>
  );
}
