# Checklist: Phase 5 - Settings Screen

## 1. Settings Store (SolidJS)
- [ ] Implement `src/features/settings/stores/settingsStore.ts`.
- [ ] Manage user profile, notification settings, and theme preferences.
- [ ] **TDD:** Test setting updates and persistence logic.

## 2. Settings API
- [ ] Implement `src/features/settings/api/settingsApi.ts`.
- [ ] Implement API calls for updating user profile and settings.
- [ ] **TDD:** Mock successful and failed update responses.

## 3. Settings View (LightningJS)
- [ ] Implement `src/features/settings/views/SettingsView.ts`.
- [ ] Create a navigable list of setting categories.
- [ ] Implement toggle switches and input fields (using `TvInput`).
- [ ] **UX Check:** Ensure settings are easy to navigate with a D-Pad.

## 4. Phase 5 Completion Criteria
- [ ] User can view and modify settings.
- [ ] Settings changes are successfully persisted to the server.
- [ ] All unit tests pass.
