---
name: realtime-chat-messaging
description: >-
  Implement and enhance real-time communication between customers and service professionals in Link Me.
  Use when building or modifying ChatRoom, instant message threads, quote negotiations, media/attachment sharing,
  typing status indicators, and notification badges.
---

# Real-Time Chat & Messaging Skill

This skill provides step-by-step procedures for the instant communication system connecting clients with verified service providers in **Link Me**.

## Chat Architecture

```
[Customer / Pro] ───> [ChatRoom Input Component]
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
         [Local Optimistic State]   [Active Thread Store]
                    │                   │
                    └─────────┬─────────┘
                              ▼
        [Message Bubble List: Text / Quote Card / Image]
```

## Key Capabilities & Procedures

### 1. Message Data Schema
```typescript
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'provider';
  avatar: string;
  text: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'quote' | 'image' | 'file';
    url?: string;
    quoteData?: {
      service: string;
      estimate: string;
      hours: number;
    };
  };
}
```

### 2. Embedded Quote & Appointment Cards
The chat room should allow service providers to send formalized quote proposals directly into the message stream:
- Shows service title, estimated hours, and fixed/hourly cost.
- Includes action buttons: **"Accept Quote"**, **"Request Revision"**, or **"Decline"**.
- When accepted, triggers a booking confirmation event.

### 3. Smooth Auto-Scroll & Accessibility
- Keep the chat scrolled to the bottom on new messages using `useRef` and `scrollIntoView({ behavior: 'smooth' })`.
- Announce new messages to screen readers using `aria-live="polite"`.
- Support keyboard submission (`Enter` sends, `Shift+Enter` inserts a new line).

### 4. Unread Notification Tickers
- Update the bell notification count in the main header (`src/App.tsx`) when new unread messages arrive.
- Clear or decrement unread counts when the customer opens the specific provider's chat room.
