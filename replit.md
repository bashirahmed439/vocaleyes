# Vocal Eyes - Voice-Based Email System

## Project Overview

Vocal Eyes is an accessible, voice-first email system designed specifically for people who are blind or cannot read and write. The application provides a fully functional email experience controlled entirely through voice commands, with comprehensive audio feedback for every interaction.

## Key Features

### 1. Voice-Based Authentication
- Login with voice recognition or PIN
- Secure voice print authentication (demo mode)
- Large, high-contrast interface for users with partial vision

### 2. Email Management
- Read emails with automatic text-to-speech
- Compose emails using speech-to-text
- Reply, forward, and delete emails with voice commands
- Priority email detection using AI
- Mark emails as read/unread, important

### 3. Comprehensive Voice Commands
**Navigation:**
- "Check inbox" / "Inbox"
- "Compose new email" / "Write email"
- "Settings"
- "Help"
- "Logout"

**Reading Emails:**
- "Read email" / "Open email [number]"
- "Next email" / "Previous email"
- "Repeat that" / "Read again"
- "Pause" / "Resume"

**Email Actions:**
- "Reply"
- "Forward"
- "Delete"
- "Mark as important"

**Composing:**
- "To [email address]"
- "Subject [text]"
- "Body [text]" / "Message [text]"
- "Period" / "Comma" / "Question mark" (punctuation)
- "New paragraph"
- "Send email"
- "Save draft"

### 4. Accessibility Features
- WCAG AAA contrast ratios throughout
- Extremely large text (minimum 24px for body text)
- Large touch targets (minimum 80px)
- Full keyboard navigation
- Comprehensive ARIA labels
- Screen reader compatible
- Prominent focus indicators (4px yellow rings)

### 5. AI-Powered Features (OpenAI Integration)
- Intelligent voice command processing
- Automatic email priority detection
- Email suggestion generation
- Natural language understanding for commands

### 6. Offline Support
- Compose emails offline
- Drafts saved to local storage
- Automatic sync when online
- Clear offline mode indicators

### 7. Customizable Settings
- Adjustable voice speed (0.5x - 2x)
- Volume control
- Multiple language support (English, Spanish, French, German, Hindi)
- Voice preference selection

## Technical Architecture

### Frontend
- **Framework:** React with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** TanStack Query for server state
- **UI Components:** Shadcn UI (Radix primitives + Tailwind)
- **Speech APIs:** 
  - Web Speech API for text-to-speech
  - Web Speech Recognition API for speech-to-text
- **Styling:** Tailwind CSS with custom accessibility tokens

### Backend
- **Framework:** Express.js
- **Storage:** In-memory storage (MemStorage) with demo data
- **AI Integration:** OpenAI GPT-5 for voice command processing
- **API Endpoints:**
  - `/api/auth/login` - Authentication
  - `/api/emails` - Email CRUD operations
  - `/api/voice/process` - Voice command processing
  - `/api/email/suggest` - AI email suggestions
  - `/api/voice-commands` - Custom voice commands
  - `/api/user/settings` - User preferences

### Data Models
- **User:** username, email, PIN, voice preferences, language settings
- **Email:** sender, recipient, subject, body, read status, priority flag
- **VoiceCommand:** custom user-defined voice commands

## Design Philosophy

### Audio-First Approach
Every interaction is designed with audio feedback as the primary interface. Visual elements serve as a fallback and guide for sighted assistants.

### Maximum Clarity
- No subtle grays or muted colors
- Pure high-contrast colors only
- Extremely large text and touch targets
- Linear, predictable navigation flow
- No complex layouts or nested menus

### Inclusive Design
- Works completely without vision
- Works with partial vision
- Works with screen readers
- Works with keyboard only
- Works with touch only
- Works with voice only

## Browser Compatibility

The application requires a modern browser with:
- Web Speech API support (Chrome, Edge, Safari)
- Web Speech Recognition API (Chrome, Edge)
- LocalStorage for offline drafts
- Online/Offline event detection

## Demo Account

**Username:** demo  
**PIN:** 1234

The demo account includes sample emails demonstrating the system's features.

## Future Enhancements

- Real email service integration (SMTP/IMAP)
- Multi-user support with proper authentication
- Database persistence (PostgreSQL)
- Real-time email notifications
- Voice print biometric authentication
- Email attachments support
- Contact management
- Email search functionality
- Custom voice command creation UI
- Multi-language voice commands
- Email templates

## Accessibility Compliance

- **WCAG 2.1 Level AAA** for contrast ratios
- **Section 508** compliant
- **ADA** (Americans with Disabilities Act) compliant
- Full keyboard navigation support
- Comprehensive ARIA labels
- Screen reader tested

## Project Impact

Vocal Eyes bridges the digital divide by making email communication accessible to millions of people who are blind or cannot read and write. By providing a voice-first interface with comprehensive audio feedback, it removes barriers that exclude individuals from participating in digital communication.

The system demonstrates how technology can be designed inclusively from the ground up, rather than retrofitting accessibility as an afterthought. It serves as a model for how voice interfaces can provide complete functionality without relying on visual interaction.
