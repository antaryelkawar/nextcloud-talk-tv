# Checklist: Phase 2 - Login Screen

## 1. Auth Store (SolidJS)
- [x] Implement `src/features/auth/stores/authStore.ts`.
- [ ] Implement `loginStatus` state machine: `idle` $\rightarrow$ `qr_display` $\rightarrow$ `polling` $\rightarrow$ `authenticated`.
- [ ] Implement `serverUrl` and `credentials` management.
- [ ] **TDD:** Test all state transitions in the machine.
- [ ] **TDD:** Test error handling for invalid URLs.

## 2. Auth API (Nextcloud)
- [x] Implement `src/features/auth/api/loginApi.ts`.
- [ ] Implement `POST /index.php/login/v2`.
- [ ] Implement the polling mechanism (interval, token management).
- [ ] **TDD:** Mock successful and failed (404/500) API responses.

## 3. QR Code Implementation
- [x] Integrate a lightweight QR code generation library.
- [x] Implement logic to encode the `login` URL from the API response.
- [ ] **TDD:** Verify the generated QR string matches the expected URL.

## 4. Login View (LightningJS)
- [x] Implement `src/features/auth/views/LoginView.ts`.
- [ ] Position official **Nextcloud logo** (White/Blue) with correct clear space.
- [ ] Create Server URL input field (focusable).
- [ ] Create QR Code display area.
- [ ] **UX Check:** Match **Nextcloud Blue** (#0082c9) focus states for inputs.
- [ ] **UX Check:** Verify D-Pad navigation order: Input $\rightarrow$ QR $\rightarrow$ Direct Login.

## 5. Phase 2 Completion Criteria
- [ ] Full login flow (Server $\rightarrow$ QR $\rightarrow$ Poll $\rightarrow$ Success) works end-to-end.
- [ ] All unit tests for `authStore` and `loginApi` pass.
- [ ] Focus management and visual fidelity are consistent with brand guidelines.
