import { Mail, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Email } from "@shared/schema";

interface EmailCardProps {
  email: Email;
  onClick: () => void;
  index: number;
}

export function EmailCard({ email, onClick, index }: EmailCardProps) {
  const timestamp = new Date(email.timestamp).toLocaleString();

  return (
    <Card
      onClick={onClick}
      data-testid={`email-card-${email.id}`}
      className={cn(
        "min-h-40 p-8 cursor-pointer border-4 hover-elevate active-elevate-2",
        !email.isRead && "border-l-8 border-l-blue-500",
        email.isPriority && "border-l-8 border-l-red-500"
      )}
      role="button"
      tabIndex={0}
      aria-label={`Email ${index + 1} from ${email.sender}, subject: ${email.subject}, ${email.isRead ? 'read' : 'unread'}, ${email.isPriority ? 'priority' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start gap-6">
        {!email.isRead && (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0" aria-label="Unread" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-2">
            <Mail className="w-12 h-12 flex-shrink-0" aria-hidden="true" />
            <h3 className="text-4xl font-bold truncate">{email.sender}</h3>
            {email.isPriority && (
              <Star className="w-12 h-12 text-red-500 flex-shrink-0" aria-label="Priority" />
            )}
          </div>
          <p className="text-3xl mb-2 truncate">{email.subject}</p>
          <p className="text-2xl text-muted-foreground">{timestamp}</p>
        </div>
      </div>
    </Card>
  );
}
