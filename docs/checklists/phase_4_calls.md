# Checklist: Phase 4 - Call Screen

## 1. Call & Signaling Stores (SolidJS)
- [ ] Implement `src/features/calls/stores/callStore.ts`.
- [ ] Implement `callState` machine: `idle` $\rightarrow$ `dialing` $\rightarrow$ `connected` $\rightarrow$ `ended`.
- [ ] Implement `participants` and `mediaStates` (mic/cam) management.
- [ ] Implement `src/features/calls/stores/signalingStore.ts` (WebSocket/Signaling connection).
- [ ] **TDD:** Test all `callState` transitions.
- [ ] **TDD:** Test signaling message parsing (Offer, Answer, ICE, etc.).

## 2. WebRTC Client
- [ ] Implement `src/features/calls/api/webrtcClient.ts`.
- [ ] Wrap WebRTC peer connection logic.
- [ ] Handle ICE candidate exchange and media stream attachment.
- [ ] **TDD:** Mock WebRTC peer connection lifecycle.

## 3. Call View (LightningJS)
- [ ] Implement `src/features/calls/views/CallView.ts`.
- [ ] Implement large, high-contrast controls (Mic, Cam, Hangup).
- [ ] Implement the Participant Grid (using optimized list rendering).
- [ ] Implement the Video Stage (using the decided strategy from Phase 1).
- [ ] **UX Check:** Ensure controls are easily reachable via D-Pad.
- [ ] **UX Check:** Implement "Auto-hide controls" during inactivity.

## 4. Phase 4 Completion Criteria
- [ ] User can initiate a call and receive a call.
- [ ] Media toggles (Mic/Cam) work and update the UI.
- [ ] Video rendering is smooth and high-performance.
- [ ] All unit and integration tests pass.
