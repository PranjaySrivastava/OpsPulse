# 🎨 UI/UX Design Brief & Web Interface Guidelines Compliance
## Project: OpsPulse — Autonomous SRE & Real-Time Incident War Room
### Hackathon: Zero to Chat (CometChat Hackathon)

### 1. Design Philosophy & Aesthetic Direction
**Theme**: *"Cosmic Deep Dark with Radiant AI Accents"*
- **Aesthetic**: Premium, sleek, modern SaaS interface inspired by Linear, Discord, and Raycast.
- **Visual Style**: Dark mode by default, glassmorphic card overlays, translucent blur backdrops (`backdrop-filter: blur(12px)`), crisp 1px borders, and vibrant gradient highlights for AI interactions.
- **Root Theming & Environment**:
  ```css
  :root, html {
    color-scheme: dark; /* Ensures native inputs, scrollbars, and select controls render in dark mode */
  }
  ```
- **Meta Theme Color**: `<meta name="theme-color" content="#0B0E14">` matching `--bg-app`.
- **Safe Area Insets**: Full-bleed layouts utilize `padding-top: env(safe-area-inset-top)` and `padding-bottom: env(safe-area-inset-bottom)` for mobile viewport safety.

---

### 2. Design Tokens & CSS Variables

```css
:root {
  /* System / Mode */
  color-scheme: dark;

  /* Background Layers */
  --bg-app: #0B0E14;                 /* Deep Void / Canvas */
  --bg-sidebar: #111622;             /* Midnight Slate */
  --bg-card: rgba(22, 29, 44, 0.7);  /* Translucent Frosted Glass */
  --bg-card-hover: rgba(30, 41, 62, 0.85);
  --bg-input: #151B28;               /* Form input fill */
  
  /* Primary & Accent Palette */
  --accent-primary: #6366F1;         /* Electric Indigo */
  --accent-primary-hover: #4F46E5;
  --accent-primary-active: #4338CA;
  --accent-secondary: #8B5CF6;       /* Neon Violet */
  --accent-cyan: #06B6D4;            /* Comet Cyan */
  
  /* AI Special Accents (Gradient) */
  --ai-gradient: linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%);
  --ai-glow: rgba(168, 85, 247, 0.25);
  --ai-bubble-bg: rgba(99, 102, 241, 0.08);
  --ai-border: rgba(168, 85, 247, 0.35);

  /* Status & Functional */
  --status-online: #10B981;          /* Emerald Green */
  --status-offline: #6B7280;         /* Muted Gray */
  --status-call-danger: #EF4444;     /* Ruby Red (Call Disconnect) */
  --status-warning: #F59E0B;         /* Amber */

  /* Text & Typography */
  --text-main: #F3F4F6;              /* Bright Crisp White */
  --text-muted: #9CA3AF;             /* Soft Slate */
  --text-dim: #64748B;               /* Subtle Border/Time */

  /* Borders, Rings & Focus Replacement */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(99, 102, 241, 0.4);
  --focus-ring: #6366F1;             /* High-contrast focus-visible ring */
  --focus-ring-offset: 2px;
  --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.25);
}
```

---

### 3. Typography & Copy Standards (Vercel Guidelines)

- **Font Family**:
  - Main: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Code & Snippets: `'JetBrains Mono', 'Fira Code', 'Courier New', monospace`
- **Typographic Rules**:
  - **Ellipsis**: Always use the horizontal ellipsis character `…` (U+2026), never three periods `...`.
  - **Quotes**: Use curly quotes `“` and `”` rather than straight quotes `"`.
  - **Non-breaking Spaces**: Enforce non-breaking spaces on units and tags (`10&nbsp;MB`, `⌘&nbsp;K`, `@AI&nbsp;Bot`).
  - **Loading States**: All loading copy must end with `…` (`"Connecting…"`, `"Thinking…"`, `"Summarizing…"`).
  - **Headings**: Enforce `text-wrap: balance` (or `text-pretty`) on titles to prevent orphaned words.
  - **Tabular Numerals**: Apply `font-variant-numeric: tabular-nums` to call timers (`00:42`), message timestamps (`12:45 PM`), and unread count badges.
  - **Copy Tone**: Title Case for buttons/headers (Chicago style), active voice, concise instructions with clear fix paths.

---

### 4. Layout Architecture & Responsive Shell

```
+---------------------------------------------------------------------------------------------------------+
| TOP BAR: [Logo: AI Pair Chat] [Active: #dev-sprint] [Call Audio/Video] [User Switcher: Alex (Dev)]     |
+----------+----------------------------+---------------------------------------------+-------------------+
| MINI NAV | CONVERSATION SIDEBAR       | ACTIVE CHAT STAGE                           | AI COPILOT DRAWER |
|          |                            |                                             | (Collapsible)     |
| [Chats]  | [Search & Quick Filter]    | [Message Stream: role="log" aria-live]      | Quick Prompts:    |
| [Rooms]  | # general                  |   - Peer: "Hey team, ready to review?"      | [/summarize]      |
| [Calls]  | # dev-sprint (active)      |   - Self: "Testing the OpenRouter fallback."| [/codeReview]     |
| [AI Bot] | # design-review            |   - Self: "@AI summarize last 5 messages"   | [/actionItems]    |
|          |                            |   - [AI BOT BUBBLE with radiant glow]       |                   |
|          | Direct Messages:           |     "📌 Summary: Testing fallback chain…"   | In-Room Insights: |
|          | • Sarah PM (Online)        |                                             | Live Context Sync |
|          | • Alex Dev (Self)          | [Typing Indicator: "Sarah is typing…"]      |                   |
|          |                            +---------------------------------------------+                   |
|          | [ + Create Room Button ]   | INPUT BAR: [Attach] [Message Input…] [Send] |                   |
+----------+----------------------------+---------------------------------------------+-------------------+
```

---

### 5. Detailed Component Specifications & Accessibility (A11y)

#### 5.1 Interactive Elements & Buttons
- **Semantic Tags**: Pure `<button>` elements for actions and `<a>` elements for navigation. **Zero `<div onClick>` or `<span onClick>`**.
- **Icon-Only Buttons**: Every icon-only button must have an explicit `aria-label` attribute and its inner SVG marked `aria-hidden="true"`:
  ```html
  <button type="button" class="btn-icon" aria-label="Start video call">
    <svg aria-hidden="true" width="20" height="20">...</svg>
  </button>
  <button type="button" class="btn-icon" aria-label="Attach file or image">
    <svg aria-hidden="true" width="20" height="20">...</svg>
  </button>
  <button type="button" class="btn-icon" aria-label="Open AI Co-Pilot drawer">
    <svg aria-hidden="true" width="20" height="20">...</svg>
  </button>
  ```
- **Touch Optimization**:
  ```css
  button, input, select, a {
    touch-action: manipulation; /* Eliminates 300ms double-tap delay */
    -webkit-tap-highlight-color: transparent;
  }
  ```

#### 5.2 Focus States (Zero Unstyled Outlines)
- **Rule**: Never use `outline: none` without a high-visibility `:focus-visible` replacement.
- **Specification**:
  ```css
  /* Focus visible replacement */
  :focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: var(--focus-ring-offset);
  }
  /* Compound focus for message input bar */
  .chat-input-bar:focus-within {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
  ```

#### 5.3 Forms & Inputs
- **Chat Input Field**:
  - Must include `name="message"`, `id="chat-message-input"`, `type="text"`.
  - Must include `aria-label="Type your message or command…"` or associated hidden `<label>`.
  - Placeholder must end with `…`: `placeholder="Type a message or /summarize…"`
  - Disable autocomplete on chat input: `autocomplete="off"` (prevents password manager triggers).
  - Never prevent paste: `onPaste` must remain completely unobstructed.
  - Spellcheck: Set `spellcheck="false"` on usernames, room handles, and code inputs; `spellcheck="true"` on conversation input.
  - **Submit Button**: Remains enabled until request begins; displays accessible spinner or indicator during transmission.

#### 5.4 Message Stream & Async Updates
- **Live Stream Region**:
  ```html
  <div id="message-stream" role="log" aria-live="polite" aria-relevant="additions" tabindex="0">
    <!-- Message Bubbles -->
  </div>
  ```
- **Content Handling & Defensive Truncation**:
  - Flex container children must specify `min-w-0` to enable proper ellipsis truncation.
  - Message bubble text must use `overflow-wrap: break-word; word-break: break-word;` to prevent layout blowout from unformatted URLs or long strings.
- **Message Roles**:
  1. **Self**: Right-aligned, solid indigo background, tabular timestamps, double cyan ticks (`✓✓`).
  2. **Peer**: Left-aligned, circular avatar with explicit `width="32" height="32"` and descriptive `alt="Sarah PM's avatar"`.
  3. **AI Co-Pilot**: Distinctive radiant border card (`--ai-border`), badge `✨ AI Co-Pilot`, markdown formatting, tabular code blocks with a keyboard-navigable "Copy Code" button.

#### 5.5 Modals & Calling Overlays
- **Overscroll Containment**:
  ```css
  .modal-overlay, .call-dialog, .drawer-content {
    overscroll-behavior: contain; /* Prevents scroll chaining to background */
  }
  ```
- **Call Dialog Accessibility**:
  - Focus trap inside active call modal.
  - Call controls: Explicit `aria-label="Mute microphone"`, `aria-label="Turn camera off"`, `aria-label="End call"`.
  - Call duration timer uses `font-variant-numeric: tabular-nums`.

---

### 6. Animation, Motion & Transitions (Strict Compositor Rules)

#### 6.1 Compositor-Only Animations
- **Allowed Properties**: Animate `transform` and `opacity` ONLY.
- **Strict Prohibition**: **Never use `transition: all`**. Every transition must explicitly enumerate target properties:
  ```css
  /* Compliant Transition */
  .btn-action {
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1),
                opacity 150ms cubic-bezier(0.16, 1, 0.3, 1),
                background-color 150ms ease,
                border-color 150ms ease;
  }
  ```

#### 6.2 Reduced Motion Compliance (MANDATORY)
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Replace continuous pulse with static subtle ring */
  .call-radar-pulse,
  .typing-wave-dot {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

#### 6.3 Micro-Animations
- **Typing Indicator**: 3 staggered dots animating `transform: translateY(-4px)` (compositor-only, never animating `margin-top` or `top`).
- **New Message Bubble Entrance**: `opacity: 0 -> 1` and `transform: translateY(6px) -> translateY(0)` in 150ms.
- **AI Shimmer**: Subtle opacity pulse on radiant border during token generation.

---

### 7. Performance & Image Guidelines
- **Images & Avatars**:
  - All avatars have explicit `width` and `height` attributes (`width="32" height="32"` or `width="40" height="40"`).
  - Above-the-fold critical user avatars: `fetchpriority="high"`.
  - Message attachment images: `loading="lazy"`.
- **Large Lists**:
  - Large message histories utilize `content-visibility: auto; contain-intrinsic-size: 0 72px;` to avoid layout thrashing.
  - Zero layout reads during render cycles (`getBoundingClientRect`, `offsetHeight`, `scrollTop` interleaved writes are prohibited).
- **Virtualization & Preconnect**:
  - Preconnect links for fonts and CDN origins: `<link rel="preconnect" href="https://fonts.googleapis.com">`.

---

### 8. Vercel Web Interface Guidelines Compliance Checklist

| Rule Category | Requirement | Implementation in AI Pair Chat | Compliance |
| :--- | :--- | :--- | :---: |
| **Accessibility** | Icon buttons have `aria-label` | All header, call, and input buttons have descriptive ARIA labels | ✅ PASS |
| **Accessibility** | Inputs have label / `aria-label` | Chat input has `aria-label="Type your message or command…"` | ✅ PASS |
| **Accessibility** | No `<div onClick>` | All clickable actions use native `<button>` or `<a>` | ✅ PASS |
| **Focus** | `:focus-visible` replacement | High-contrast electric indigo focus ring with 2px offset | ✅ PASS |
| **Focus** | Never `outline: none` without ring | Zero bare `outline: none` | ✅ PASS |
| **Forms** | Non-auth `autocomplete="off"` | `autocomplete="off"` set on chat input | ✅ PASS |
| **Forms** | Never block paste | Standard paste listener with zero `preventDefault` | ✅ PASS |
| **Forms** | Ellipsis in placeholder | `placeholder="Type a message or /summarize…"` | ✅ PASS |
| **Animation** | Honor `prefers-reduced-motion` | Global `@media (prefers-reduced-motion: reduce)` killswitch | ✅ PASS |
| **Animation** | No `transition: all` | All transitions list explicit properties (`transform`, `opacity`) | ✅ PASS |
| **Animation** | Compositor only (`transform`/`opacity`) | Bouncing dots and entrances animate transforms only | ✅ PASS |
| **Typography** | `…` not `...` | All status strings and loading states use `…` | ✅ PASS |
| **Typography** | `font-variant-numeric: tabular-nums` | Used on timers, counts, and timestamps | ✅ PASS |
| **Content** | `min-w-0` on flex children | Preserves text truncation in sidebar and headers | ✅ PASS |
| **Touch** | `touch-action: manipulation` | Applied across interactive elements | ✅ PASS |
| **Touch** | `overscroll-behavior: contain` | Applied to modals, drawers, and chat streams | ✅ PASS |
| **Dark Mode** | `color-scheme: dark` | Declared on `:root` and `<html`> | ✅ PASS |
| **Dark Mode** | `<meta name="theme-color">` | Set to `#0B0E14` matching `--bg-app` | ✅ PASS |
