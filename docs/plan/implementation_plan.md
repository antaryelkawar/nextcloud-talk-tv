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

---

## 2. Design System & UX Principles

### 2.1 Visual Identity (UI)

#### 2.1.1 Color Palette (Nextcloud Brand Aligned)
Colors MUST strictly follow the Nextcloud Brand Guidelines.

| Category | Hex/Value | Usage |
| :--- | :--- | :--- |
| **Primary** | `#0082c9` | Nextcloud Blue - Brand color, primary buttons, active states |
| **Background** | `#121212` | Main application background (Dark Mode optimized) |
| **Surface** | `#1E1E1E` | Cards, list items, and dialog containers |
| **Secondary** | `#ffffff` | High-emphasis text and icons (White logo on Blue) |
| **Tertiary** | `#b0b0b0` | Low-emphasis text and icons |
| **Success** | `#4caf50` | Online status, successful actions |
| **Error** | `#f44336` | Errors, hangup buttons, disconnected states |

#### 2.1.2 Typography (Inter Font Family)
- **Font:** The **Inter** font family must be used for all text elements.
- **Body Text:** Minimum `24px` (Standard) / `28px` (Large).
- **Headings:** `36px` to `48px`. Bold weight (`700`).

#### 2.1.3 Component Visuals
- **Avatars:** Strictly circular avatars with border indicators for status.
- **Logos:** High-resolution SVG logos (White on Blue, Blue on White).
- **Safe Zones:** `60px` margin on all edges to avoid TV "Overscan".

### 2.2 Interaction Design (UX)

#### 2.2.1 D-Pad Navigation & Focus
The "Focus Engine" is the heart of the UX.
- **Visual Feedback:** Focused items must have a distinct, high-contrast border (`Primary` color) and a subtle scale-up effect (`1.05x`).
- **Logical Flow:** Navigation must follow a predictable Z-pattern.
- **No Dead Ends:** Every screen must have a clear "Back" or "Home" path.

---

## 3. Detailed Implementation Phases

### Phase 1: Foundation & Tooling [Checklist](./checklists/phase_1_foundation.md)
**Goal:** Set up the environment and ensure visual/font parity.

1.  **Environment Setup:** Vite + SolidJS + LightningJS + Vitest.
2.  **Font Integration:** Load **Inter** font and map weights.
3.  **The Bridge:** `bridge/observer.ts` for reactive state syncing.
4.  **Technical Spike: Video Rendering:** Implement **DOM Overlay** for hardware-accelerated WebRTC rendering.
5.  **Asset Pipeline:** `scripts/convert_assets.ts` for SVG/WebP conversion.

### Phase 2: Login Screen [Checklist](./checklists/phase_2_auth.md)
**Flow:** `Server Selection` $\rightarrow$ `QR Code Generation` $\rightarrow$ `Polling` $\rightarrow$ `Auth Success`.
- **UX Polish:** Position Nextcloud logo with correct clear space.
- **TDD:** Test `authStore` state machine.

### Phase 3: Conversation List [Checklist](./checklists/phase_3_conversations.md)
**Goal:** 1:1 visual parity with Nextcloud Talk mobile/web list.
- **UI:** Circular avatars, timestamp formatting, message previews.
- **Tech:** `LightningJS.List` for high-performance scrolling.

### Phase 4: Call Screen [Checklist](./checklists/phase_4_calls.md)
**Flow:** `Initiate Call` $\rightarrow$ `Signaling/WebRTC` $\rightarrow$ `Active Call UI`.
- **Video:** Sync `<video>` element position with LightningJS placeholder.
- **Controls:** High-contrast buttons (Mic, Cam, Hangup) with auto-hide.

### Phase 5: Settings Screen [Checklist](./checklists/phase_5_settings.md)
- **Theme Support:** Implement server-side theme color fetching and application.

### Phase 6: Performance & Polish
1.  **Memory Management:** Audit for leaks in LightningJS textures and SolidJS effects.
2.  **Input Lag:** Refine the 16ms bridge budget.
3.  **A11y:** Screen reader support (aria-labels) and high-contrast modes.

### Phase 7: DevOps & Deployment [Checklist](./checklists/phase_6_devops.md)
- **Targets:** Tizen, WebOS, and generic Android TV (Webview) bundles.

---

## 4. Code Standards & Quality Assurance

### 4.1 Coding Standards
- **Modular & Readable:** Single-responsibility files.
- **Type Safety:** Strict TypeScript usage.
- **UX Fidelity:** All components must match official Nextcloud Talk design specs.

### 4.2 Definition of Done (DoD)
- [ ] Visual parity with Nextcloud Talk (Fonts, Colors, Logos).
- [ ] Unit tests pass (>90% coverage).
- [ ] D-pad navigation is seamless (No focus traps).
- [ ] No memory leaks or input lag.
