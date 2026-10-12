# SkillSync — Frontend Client

**A Modern Developer Networking & Real-Time Collaboration UI.**

<p>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-61DAFB.svg?style=flat-square&logo=react&logoColor=black" alt="React 19"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-7.x-646CFF.svg?style=flat-square&logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC.svg?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"></a>
  <a href="https://daisyui.com/"><img src="https://img.shields.io/badge/DaisyUI-5.x-FF69B4.svg?style=flat-square" alt="DaisyUI"></a>
  <a href="https://redux-toolkit.js.org/"><img src="https://img.shields.io/badge/Redux-Toolkit-764ABC.svg?style=flat-square&logo=redux" alt="Redux"></a>
  <a href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.io-4.x-black.svg?style=flat-square&logo=socket.io" alt="Socket.io"></a>
  <a href="https://www.framer.com/motion/"><img src="https://img.shields.io/badge/Framer-Motion-0055FF.svg?style=flat-square&logo=framer" alt="Framer Motion"></a>
</p>

---

## Executive Summary
The **SkillSync Frontend** is the client application for a developer matchmaking and networking platform (conceptualized as *"LinkedIn meets Tinder for Developers with an AI Copilot"*). 

Built with **React 19** and **Vite 7**, it delivers an interactive Single Page Application (SPA) featuring swipeable developer discovery, low-latency WebSocket messaging, and an in-chat Google Gemini AI assistant.

* **Backend Repository:** [https://github.com/ani1911/SkillSync](https://github.com/ani1911/SkillSync)

---

## Platform Workflow (4-Stage Collaboration Lifecycle)

SkillSync replaces shallow connections with an intentional 4-stage collaboration pipeline:

1. **Discover:** Browse developer profiles filtered by stack, with full keyboard support (`←` pass / `→` match).
2. **Mutual Match:** When two developers mutually like each other, they instantly unlock in the **Matches** hub.
3. **Connect with Pitch Note:** Send formal invites with personalized pitch notes (up to 300 chars); review and accept incoming invites in the **Network** inbox.
4. **Chat & @ai Copilot:** Collaborate via low-latency WebSockets and summon `@ai` for live debugging and architectural assistance directly inside chat.

---

## Client Architecture Flow

```mermaid
graph TD
    UI[React 19 Components] -->|Dispatch Actions| Redux[Redux Store]
    Redux -->|Select State| UI
    
    UI -->|API Requests| Axios[Axios Interceptors]
    Axios -->|Fetch Data| Backend[Backend API - Express 5]
    Backend -->|JSON Response| Axios
    Axios -->|Update State| Redux
    
    UI <-->|Bi-directional Events| Socket[Socket.io Client]
    Socket <-->|WebSocket Stream| Node[Socket.io Server]
```

---

## Core Features & Implementation Details

### 1. Real-Time WebSocket Chat
- **Instant Messaging:** Built on `socket.io-client` with isolated rooms generated per match for zero-latency communication.
- **Auto-Anchoring:** Viewport automatically pins to incoming messages without jitter.
- **Connection-Gated Header:** Visually reflects match and connection status directly within the active chat view.

### 2. Google Gemini AI Copilot (`@ai`)
- **Native In-Chat Summoning:** Developers can type `@ai` in private chats to consult Gemini AI without leaving the conversation.
- **Syntax-Highlighted Markdown:** Uses `react-markdown` and `remark-gfm` to format code blocks, tables, and technical explanations.
- **Dedicated Bot Styling:** Custom accent themes and badges clearly distinguish AI assistance from human messages.

### 3. Matchmaking & Connections Hub
- **Discovery Card Deck:** Layered developer cards with perspective transforms and keyboard navigation (`←` pass / `→` match).
- **Dual Tab Network View:** Separate management for accepted developer connections and incoming pending invitations.
- **Pitch Note Previews:** Review personal messages sent with incoming connection invites before accepting or rejecting.
- **Interactive Features Walkthrough:** Accessible from the navigation bar to guide visitors through the collaboration lifecycle and system architecture.

### 4. Robust State Management (Redux Toolkit)
- **Centralized Store:** Slices manage authenticated user session (`userSlice`) and incoming invite notification counts (`requestsSlice`).
- **Live Badge Synchronization:** Pending invitation counts dynamically update the top navigation notification badge in real time.

### 5. Monetization & Razorpay Integration
- **In-App Payment Modal:** Connects with the backend Razorpay order API for one-click checkout.
- **Instant State Elevation:** Verifies payment and unlocks Pro badges and extended profile features without requiring page reloads.

---

*Built to demonstrate modern React 19 engineering, component-driven design, real-time WebSockets, and clean product UX.*
