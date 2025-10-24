# Design Guidelines: Vocal Eyes - Voice-Based Email System

## Design Approach

**Selected Approach:** Accessibility-First Voice Interface Design

**Justification:** This is an assistive technology application designed for users who are blind or cannot read and write. Every design decision prioritizes audio feedback, voice interaction, and minimal visual complexity while maintaining high contrast and clarity for users with partial vision.

**Core Principle:** Audio-first, keyboard-free navigation with comprehensive voice feedback for every interaction. The visual interface serves as a fallback and guide for sighted assistants, not the primary interaction method.

---

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts CDN) - Highly legible, excellent for accessibility
- All text must be extremely large and high-contrast for users with partial vision

**Type Scale (Significantly Larger Than Standard):**
- Main Headings: text-6xl font-bold (72px) - Page titles, major sections
- Section Headers: text-4xl font-semibold (36px) - Email subject lines
- Body/Labels: text-2xl font-medium (24px) - All interactive elements
- Metadata: text-xl font-normal (20px) - Timestamps, sender info

**Rationale:** Users with partial vision need significantly larger text. All text must be readable from 3+ feet away.

---

## Color System - Maximum Contrast

**High Contrast Mode (Default and Only Mode):**
- Background: Pure white (#FFFFFF) or Pure black (#000000)
- Text: Pure black (#000000) or Pure white (#FFFFFF)
- Primary Action: Bright Blue (#0066FF) with white text
- Success/Confirmation: Bright Green (#00CC00)
- Warning: Bright Orange (#FF9900)
- Error/Urgent: Bright Red (#FF0000)
- Focus Indicators: Thick 4px bright yellow (#FFFF00) borders

**Rationale:** WCAG AAA contrast ratios throughout. No subtle grays or muted colors - everything must be immediately distinguishable for users with low vision.

---

## Layout System

**Spacing Primitives (Generous Spacing):**
- All interactive elements must be large touch targets (minimum 80px height)
- Generous padding between elements (minimum p-8)
- Large gaps between sections (gap-12 to gap-16)
- No dense layouts - everything must be spaced for easy navigation

**Grid Structure:**
- Single column layout on all screen sizes
- Full-width elements for maximum touch target size
- No sidebar - all navigation through voice commands
- Linear, predictable flow from top to bottom

**Focus States:**
- Extremely prominent focus indicators (ring-4 ring-yellow-400)
- Focus must be visually obvious from across the room
- Audio announcement whenever focus changes

---

## Component Library

### Voice Command Interface

**Always-Visible Voice Indicator:**
- Large circular button at top center (w-32 h-32)
- Pulsing animation when listening
- Different colors for different states:
  - Idle: Blue
  - Listening: Pulsing green
  - Processing: Rotating yellow
  - Error: Red flash

**Command Feedback Panel:**
- Shows what was heard in real-time
- Large text display (text-3xl)
- Confirmation of action taken
- Always accompanied by audio feedback

### Email List View

**Email Cards:**
- Extremely large cards (min-h-40 p-8)
- One email per row, full width
- Clear visual separation (border-4)
- Large touch targets for selection
- Priority emails have thick colored left border (border-l-8 border-red-500)

**Email Card Structure:**
- Sender name (text-4xl font-bold)
- Subject line (text-3xl)
- Timestamp (text-2xl text-gray-600)
- Unread indicator: Large bright dot (w-8 h-8 rounded-full bg-blue-500)
- Priority indicator: Large star icon (w-12 h-12)

### Email Reading View

**Full-Screen Email Display:**
- Maximum readability, minimal distractions
- Sender (text-5xl font-bold)
- Subject (text-4xl font-semibold)
- Timestamp (text-2xl)
- Body text (text-3xl leading-relaxed)
- Large action buttons at bottom (h-24)

### Email Composition

**Voice Input Feedback:**
- Real-time transcription display (text-3xl)
- Word-by-word highlighting as spoken
- Visual confirmation of punctuation commands
- Large "Send" and "Save Draft" buttons (h-24 w-full)

### Authentication Screen

**Voice/PIN Authentication:**
- Large centered interface
- Voice authentication: Large microphone button (w-48 h-48)
- PIN fallback: Extra-large number pad (each button w-24 h-24)
- Clear instructions in both audio and visual format
- "Login with Voice" button (h-32 text-4xl)

### Settings Panel

**Voice Customization:**
- Speed control: Large slider with clear markers
- Voice selection: Large radio buttons with names
- Language selection: Large dropdown (h-20 text-3xl)
- Volume control: Large slider
- Each setting announces itself when focused

### Navigation

**Minimal Visual Navigation:**
- No traditional menu system
- Large "Help" button always visible (bottom-right, w-20 h-20)
- Audio help activated by voice or button press
- Emergency "Logout" button (bottom-left, w-20 h-20, red)

---

## Audio Feedback System

**Comprehensive Audio Announcements:**
- Every screen transition announced
- Every button focus announced
- Every action confirmed with audio
- Error messages spoken immediately
- Success confirmations
- Background audio for processing states

**Audio Priorities:**
1. Critical alerts (emergency, errors)
2. User action confirmations
3. Navigation announcements
4. Informational updates

**Audio Characteristics:**
- Clear, professional voice (customizable)
- Natural speaking pace (adjustable)
- Distinct sounds for different event types:
  - Success: Pleasant chime
  - Error: Alert tone
  - New email: Notification sound
  - Processing: Subtle ambient sound

---

## Voice Commands

**Core Commands (Always Available):**
- "Read email" / "Open email [number]"
- "Compose new email"
- "Check inbox"
- "Go back"
- "Help"
- "Settings"
- "Logout"
- "Repeat that"
- "Pause" / "Resume"

**Email Management Commands:**
- "Reply"
- "Forward"
- "Delete"
- "Mark as unread"
- "Mark as important"
- "Next email"
- "Previous email"

**Composition Commands:**
- "Send email"
- "Save draft"
- "Cancel"
- "Add recipient [name/email]"
- "Change subject"
- "Period" / "Comma" / "Question mark" (punctuation)
- "New paragraph"

**Customizable Commands:**
- Users can create shortcuts
- Saved in settings panel
- Announced on first use

---

## Animations & Interactions

**Purposeful, Clear Animations:**
- Slow, deliberate transitions (500ms)
- No sudden movements
- Clear visual feedback for every interaction
- Pulsing for "listening" state
- Gentle fade for confirmations

**No Animations That Could Cause Issues:**
- No rapid flashing
- No rotating elements (except slow loading indicator)
- No parallax effects
- No auto-play videos

---

## Accessibility Standards

**WCAG AAA Compliance:**
- All contrast ratios exceed 7:1
- All functionality available via voice
- All functionality available via keyboard
- All interactive elements have ARIA labels
- Screen reader support as backup
- Focus order is logical and predictable

**Keyboard Navigation (Backup to Voice):**
- Tab navigation through all elements
- Enter to activate
- Escape to cancel/go back
- Arrow keys for lists

**Focus Management:**
- Focus never lost
- Focus always visible
- Focus announced audibly
- Logical tab order

---

## Offline Support

**Offline Capabilities:**
- Compose emails offline (saved locally)
- View previously loaded emails
- Queue outgoing emails for sending when online
- Clear visual and audio indication of offline status
- Large "Offline Mode" banner (bg-yellow-100 text-3xl)

---

## Error Handling

**Clear Error Communication:**
- Audio announcement of error immediately
- Visual error display in large text (text-3xl text-red-600)
- Suggested fix spoken and displayed
- "Try again" button always prominent
- No technical jargon in error messages

---

## Responsive Design

**Mobile-First, Touch-Optimized:**
- All buttons minimum 80px touch targets
- No hover-dependent functionality
- Generous spacing for finger navigation
- Portrait orientation optimized
- Works on phones, tablets, and desktop

---

## Privacy & Security

**Voice-Controlled Privacy:**
- "Logout" command always available
- Screen timeout with audio warning
- PIN fallback for shared devices
- Clear audio confirmation of logout
- No auto-login without explicit consent

---

## Visual Design Philosophy

**Maximum Clarity, Minimum Decoration:**
- No gradients
- No shadows (except for depth hierarchy)
- No rounded corners (sharp corners for clarity)
- Solid colors only
- High contrast borders
- Large, clear icons (minimum w-12 h-12)

**Color Usage:**
- Color is never the only indicator
- Always paired with text, icon, or audio
- Colorblind-safe palette
- Sufficient contrast in all modes

---

## Icon System

**Large, Simple Icons:**
- Heroicons (solid variants for maximum clarity)
- Minimum size: w-12 h-12
- Always paired with text labels
- High contrast with background
- Never use icon-only buttons (except voice button which is explained on load)

---

## Loading States

**Clear Loading Indicators:**
- Large spinner (w-24 h-24)
- Audio announcement: "Loading..."
- Percentage progress when possible
- "Please wait" message (text-3xl)
- No indefinite loading without feedback

---

## Success Metrics

**Measurable Accessibility Goals:**
- 100% keyboard navigable
- 100% voice navigable
- WCAG AAA compliance
- Zero reliance on vision for core functionality
- Audio feedback for every interaction
- Works with all screen readers
- Testable by users who are blind
