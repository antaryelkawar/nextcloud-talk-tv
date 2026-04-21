# Detailed Implementation Plan: Nextcloud Talk TV (SolidJS + LightningJS)

## 1. Core Architectural Principles

### 1.1 Modular Structure (Feature-Based)
The application will follow a strict feature-based modularity to ensure scalability and testability. Each feature will be a self-contained directory.

```text
src/
├── api/                # Low-level Nextcloud API clients (Axios/Fetch)
├── bridge/             # SolidJS <-> LightningJS reactive bridge primitives
├── components/          # Shared LightningJS UI components (Buttons, Lists, etc.)
├── core/               # Shared utilities, constants, and types
├── features/         # Feature modules
│   ├── auth/           # Login, QR Code, Pairing
│   ├── conversations/   # Conversation list, message history, search
│   ├── calls/           # WebRTC, signaling, video/audio management
│   └── settings/       # User and app configuration
└── main.ts             # Application entry point
```

### 1.2 The Reactive Bridge Pattern
To maintain a separation of concerns, communication follows a unidirectional flow. To mitigate input lag, all bridge-driven UI updates must be synchronized with the display refresh rate.

1.  **SolidJS Store** (Source of Truth) updates state via API/Signaling.
2.  **Bridge** (Observer) detects change via `createEffect`.
3.  **LightningJS Component** (View) receives an imperative command to update the Canvas, executed via `requestAnimationFrame`.

### 1.3 TDD & Testing Strategy
We will follow a strict **Test-Driven Development (TDD)** workflow:
1.  **Write Test:** Define expected behavior in Vitest.
2.  **Fail:** Run test and observe failure.
3.  **Implement:** Write minimal code to satisfy the test.
4.  **Refactor:** Clean up code while maintaining tests.

**Testing Layers:**
- **Unit Tests (Vitest):** Logic in SolidJS stores, API clients, and utility functions.
- **Component Tests (Vitest/JSDOM):** Testing the logic of the Reactive Bridge.
- **Integration Tests:** Verifying the interaction between stores and the bridge.

---

## 2. Design System & UX Principles

### 2.1 Visual Identity (UI)

#### 2.1.1 Color Palette (10-Foot Optimized)
Colors must provide high contrast for visibility from a distance. We will use a dark-theme-first approach to minimize eye strain.

| Category | Hex/Value | Usage |
| :--- | :--- | :--- |
| **Background** | `#121212` | Main application background |
| **Surface** | `#1E1E1E` | Cards, list items, and dialog containers |
| **Primary** | `#0082c9` | Nextcloud Blue - Buttons, active states, branding |
| **Secondary** | `#ffffff` | High-emphasis text and icons |
| **Tertiary** | `#b0b0b0` | Low-emphasis text and icons |
| **Success** | `#4caf50` | Online status, successful actions |
| **Error** | `#f44336` | Errors, hangup buttons, disconnected states |
| **Warning** | `#ff9800` | Muted/Busy status, pending actions |

#### 2.1.2 Typography & Sizing
Text must be legible from a standard couch distance.
- **Body Text:** Minimum `24px` (Standard) / `28px` (Large).
- **Headings:** `36px` to `48px`.
- **Interactive Elements:** Minimum touch/focus target of `56dp`.

#### 2.1.3 Spacing & Alignment
- **Grid System:** 8px base grid.
- **Safe Zones:** Maintain a `60px` margin on all edges to avoid TV "Overscan" (where edges are cut off).
- **Alignment:**
  - **Conversations:** Left-aligned text with consistent padding.
  - **Call Screen:** Centered video stage; bottom-aligned controls.
  - **Settings:** Left-aligned labels with right-aligned toggle/value indicators.

### 2.2 Interaction Design (UX)

#### 2.2.1 D-Pad Navigation & Focus
The "Focus Engine" is the heart of the UX.
- **Visual Feedback:** Focused items must have a distinct, high-contrast border (`Primary` color) and a subtle scale-up effect (`1.05x`).
- **Logical Flow:** Navigation must follow a predictable Z-pattern (Top-Left $\rightarrow$ Top-Right $\rightarrow$ Bottom-Left $\rightarrow$ Bottom-Right).
- **No Dead Ends:** Every screen must have a clear "Back" or "Home" path.
- **Focus Traps:** Implement strict validation to ensure focus cannot get stuck inside a non-navigable element.

#### 2.2.2 Feedback & States
- **Loading:** Use high-performance skeleton screens or centered, animated spinners to indicate activity.
- **Transitions:** Use smooth, short (200-300ms) transitions between screens to maintain spatial orientation.
- **Error Handling:** Errors should be displayed in a dedicated, high-visibility dialog or snackbar, providing a clear "Retry" action.

---

## 3. Detailed Implementation Phases

### Phase 1: Foundation & Tooling [Checklist](./checklists/phase_1_foundation.md)
**Goal:** Set up the environment and resolve high-risk technical uncertainties.

1.  **Environment Setup:**
    - Vite + TypeScript + SolidJS + LightningJS.
    - Install **Vitest** for testing.
    - Configure ESLint/Prettier for high readability and minimal clutter.
2.  **The Bridge Implementation:**
    - Implement a `bridge/observer.ts` that allows LightningJS components to subscribe to SolidJS `signals`.
3.  **Technical Spike: Video & Signaling Parity:**
    - Evaluate **DOM Overlay** vs **Canvas `drawImage`** for WebRTC rendering.
    - **Signaling Audit:** Verify WebRTC handshake and message protocol parity with the Android Kotlin implementation.
    - Decide on a strategy to minimize latency and ensure high FPS.
4.  **Data Model Mapping:**
    - Map existing Kotlin JSON models (from `com.nextcloud.talk.models.json.*`) to strict TypeScript interfaces to ensure API compatibility.
5.  **Automated Asset Pipeline:**
    - Create a script to migrate/convert Android `res/` assets (drawables, raw) to web-optimized formats (SVG, WebP, MP3).
6.  **Core Error Mapping Strategy:**
    - Implement a centralized mapping layer to translate HTTP error codes (e.g., 401, 403, 500) into reactive application states.
7.  **Bridge Performance Profiling:**
    - Establish a "Performance Budget" (e.g., state-to-render latency $<16ms$).
8.  **Design System (LightningJS Primitives):**
    - Build base components: `TvButton`, `TvListItem`, `TvInput`.
9.  **TDD Focus:**
    - Test the `bridge/observer.ts` logic.
    - Verify that a state change in a mock SolidJS store triggers the correct callback in the bridge within the performance budget.

### Phase 2: Login Screen [Checklist](./checklists/phase_2_auth.md)
**Flow:** `Server Selection` $\rightarrow$ `QR Code Generation` $\rightarrow$ `Polling` $\rightarrow$ `Auth Success`.

1.  **`features/auth/` Implementation:**
    - **`auth/stores/authStore.ts`**: Manages `serverUrl`, `loginStatus` (`idle`, `qr_display`, `polling`, `authenticated`), and `credentials`.
    - **`auth/api/loginApi.ts`**: Handles `POST /index.php/login/v2` and the polling `POST` requests.
    - **`auth/views/LoginView.ts`**: LightningJS view for server input and QR code display.
2.  **QR Code Logic:**
    - Integrate a lightweight QR generator for the `login` URL.
3.  **TDD Focus:**
    - Test the `authStore` state machine transitions.
    - Test the polling logic (mocking successful and failed responses).

### Phase 3: Conversation List [Checklist](./checklists/phase_3_conversations.md)
**Flow:** `Conversation List` $\rightarrow$ `Select Conversation` $\rightarrow$ `Message History`.

1.  **`features/conversations/` Implementation:**
    - **`conversations/stores/conversationStore.ts`**: Manages the list of conversations, active conversation ID, and search queries.
    - **`conversations/api/conversationApi.ts`**: Handles fetching conversations and message history.
    - **`conversations/views/ConversationListView.ts`**: LightningJS optimized list of chat items.
    - **`conversations/views/MessageListView.ts`**: LightningJS view for individual chat threads.
2.  **Optimization:**
    - Use LightningJS's `List` component for high-performance scrolling.
3.  **TDD Focus:**
    - Test pagination and list updates in `conversationStore`.
    - Test search filtering logic.

### Phase 4: Call Screen [Checklist](./checklists/phase_4_calls.md)
**Flow:** `Initiate Call` $\rightarrow$ `Signaling/WebRTC` $\rightarrow$ `Active Call UI`.

1.  **`features/calls/` Implementation:**
    - **`calls/stores/callStore.ts`**: Manages `callState` (`dialing`, `connected`, `ended`), `participants`, and `mediaStates` (mic/cam on/off).
    - **`calls/stores/signalingStore.ts`**: Manages the WebSocket/Signaling connection (strictly following Android signaling protocol).
    - **`calls/api/webrtcClient.ts`**: Wrapper for WebRTC peer connections.
    - **`calls/views/CallView.ts`**: The main call UI with large control buttons and participant grid.
2.  **Video Implementation:**
    - Implement the strategy decided in Phase 1.
3.  **TDD Focus:**
    - Test the complex `callStore` state machine.
    - Test signaling message parsing and event dispatching.

### Phase 5: Settings Screen [Checklist](./checklists/phase_5_settings.md)
**Flow:** `Access Settings` $\rightarrow$ `Update Config` $\rightarrow$ `Save`.

1.  **`features/settings/` Implementation:**
    - **`settings/stores/settingsStore.ts`**: Manages user profile, notification settings, and theme.
    - **`settings/views/SettingsView.ts`**: A navigable list of setting categories and items.
2.  **TDD Focus:**
    - Test persistence of settings to the server via API.

### Phase 6: DevOps & Deployment [Checklist](./checklists/phase_6_devops.md)
**Goal:** Automate the build and deployment process for various TV platforms.

1.  **CI/CD Pipeline:**
    - Set up automated testing and linting on every PR.
2.  **Bundling & Target Optimization:**
    - Configure build scripts for different TV targets (e.g., Tizen-specific bundles, WebOS-specific bundles).
3.  **Deployment Automation:**
    - Automate the upload of builds to testing environments.

---

## 4. Code Standards & Quality Assurance

### 4.1 Coding Standards
- **Modular & Readable:** Small, single-responsibility functions and files.
- **Minimal Comments:** Code must be self-documenting via clear naming. Only use comments for complex logic that cannot be expressed through code.
- **Type Safety:** Strict TypeScript usage for all stores, API responses, and component props.

### 4.2 Definition of Done (DoD)
- [ ] Unit tests pass with >90% coverage for business logic.
- [ ] Feature follows the prescribed flow (Login $\rightarrow$ Conversation $\rightarrow$ Call $\rightarrow$ Settings).
- [ ] Navigation is seamless via D-pad (No focus traps).
- [ ] No memory leaks or bridge-induced input lag detected.
- [ ] Code is reviewed for readability and modularity.
