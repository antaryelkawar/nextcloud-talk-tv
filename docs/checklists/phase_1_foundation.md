# Checklist: Phase 1 - Foundation & Risk Mitigation

## 1. Environment Setup
- [ ] Initialize Vite project with TypeScript.
- [ ] Integrate SolidJS.
- [ ] Integrate LightningJS.
- [ ] Configure Vitest for unit and component testing.
- [ ] Set up ESLint and Prettier with strict rules.

## 2. Technical Spike: Video Rendering
- [ ] Implement a prototype for **DOM Overlay** video rendering.
- [ ] Implement a prototype for **Canvas `drawImage`** video rendering.
- [ ] Benchmark FPS and CPU usage for both methods on a target TV environment (or simulated heavy load).
- [ ] **Decision Document:** Finalize and document the chosen strategy in `docs/design_decisions/video_strategy.md`.

## 3. Core Bridge Implementation
- [ ] Implement `src/bridge/observer.ts` using the Subscription/Observer pattern.
- [ ] **TDD:** Write test to ensure SolidJS signal updates trigger bridge callbacks.
- [ ] **Performance Test:** Verify bridge latency is below the 16ms budget.

## 4. Asset Pipeline
- [ ] Create `scripts/convert_assets.ts`.
- [ ] Implement conversion logic (Android `res/` $\rightarrow$ Web SVGs/WebPs/MP3s).
- [ ] Test pipeline with a sample set of assets.

## 5. Design System (LightningJS Primitives)
- [ ] `TvButton`:
    - [ ] Focusable state.
    - [ ] `Primary` color border on focus.
    - [ ] `1.05x` scale animation on focus.
- [ ] `TvListItem`:
    - [ ] Focusable state.
    - [ ] `Surface` color background.
    - [ ] Smooth scale transition.
- [ ] `TvInput`:
    - [ ] Remote-compatible selection logic.
    - [ ] Visual indication of active text field.

## 6. Phase 1 Completion Criteria
- [ ] All Phase 1 tests pass.
- [ ] Video strategy is finalized and documented.
- [ ] Base components are available in `src/components/`.
