# Checklist: Phase 2 - Login Screen

## 1. Auth Store (SolidJS)
- [ ] Implement `src/features/auth/stores/authStore.ts`.
- [ ] Implement `loginStatus` state machine: `idle` $\rightarrow$ `qr_display` $\rightarrow$ `polling` $\rightarrow$ `authenticated`.
- [ ] Implement `serverUrl` and `credentials` management.
- [ ] **TDD:** Test all state transitions in the machine.
- [ ] **TDD:** Test error handling for invalid URLs.

## 2. Auth API (Nextcloud)
- [ ] Implement `src/features/auth/api/loginApi.ts`.
- [ ] Implement `POST /index.php/login/v2`.
- [ ] Implement the polling mechanism (interval, token management).
- [ ] **TDD:** Mock successful and failed (404/500) API responses.

## 3. QR Code Implementation
- [ ] Integrate a lightweight QR code generation library.
- [ ] Implement logic to encode the `login` URL from the API response.
- [ ] **TDD:** Verify the generated QR string matches the expected URL.

## 4. Login View (LightningJS)
- [ ] Implement `src/features/auth/views/LoginView.ts`.
- [ ] Create Server URL input field (focusable).
- [ ] Create QR Code display area.
- [ ] **UX Check:** Ensure "Scan QR" and "Direct Login" are clearly distinguishable.
- [ ] **UX Check:** Verify D-Pad navigation order: Input $\rightarrow$ QR $\rightarrow$ Direct Login.

## 5. Phase 2 Completion Criteria
- [ ] Full login flow (Server $\rightarrow$ QR $\rightarrow$ Poll $\rightarrow$ Success) works end-to-end.
- [ ] All unit tests for `authStore` and `loginApi` pass.
- [ ] Focus management is seamless in the Login View.
