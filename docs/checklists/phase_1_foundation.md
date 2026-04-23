# Checklist: Phase 1 - Foundation & Risk Mitigation

## 1. Environment Setup
- [ ] Initialize Vite project with TypeScript.
- [ ] Integrate SolidJS.
- [ ] Integrate LightningJS.
- [ ] Configure Vitest for unit and component testing.
- [ ] Set up ESLint and Prettier with strict rules.

## 2. Typography & Brand Assets
- [ ] Load **Inter** font family in `index.html`.
- [ ] Configure LightningJS to use Inter (Regular 400, Bold 700).
- [ ] Ensure **Nextcloud Blue** (#0082c9) is the base `PRIMARY` color in `constants.ts`.
- [ ] Implement support for SVG brand logos (White/Blue variants).

## 3. Technical Spike: Video Rendering
- [ ] Implement a prototype for **DOM Overlay** video rendering.
- [ ] Benchmark FPS and CPU usage for DOM Overlay on simulated TV environment.
- [ ] **Decision Document:** Finalize and document the chosen strategy in `docs/design_decisions/video_strategy.md`.

## 4. Core Bridge Implementation
- [ ] Implement `src/bridge/observer.ts` using the Subscription/Observer pattern.
- [ ] **TDD:** Write test to ensure SolidJS signal updates trigger bridge callbacks.
- [ ] **Performance Test:** Verify bridge latency is below the 16ms budget.

## 5. Asset Pipeline
- [ ] Create `scripts/convert_assets.ts`.
- [ ] Update pipeline to handle SVG logos and Talk-specific icons.
- [ ] Test pipeline with a sample set of assets.

## 6. Design System (LightningJS Primitives)
- [ ] `TvButton`:
    - [ ] Focusable state.
    - [ ] **Nextcloud Blue** border on focus.
    - [ ] `1.05x` scale animation on focus.
    - [ ] Use **Inter** font for labels.
- [ ] `TvListItem`:
    - [ ] Focusable state.
    - [ ] Circular avatar placeholder support.
    - [ ] Smooth scale transition.
- [ ] `TvInput`:
    - [ ] Remote-compatible selection logic.
    - [ ] Visual indication of active text field using brand colors.

## 7. Phase 1 Completion Criteria
- [ ] All Phase 1 tests pass.
- [ ] Visual baseline (Font/Colors) matches Nextcloud brand.
- [ ] Base components are available in `src/components/`.
