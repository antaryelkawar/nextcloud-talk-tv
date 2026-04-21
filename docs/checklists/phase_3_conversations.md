# Checklist: Phase 3 - Conversation List

## 1. Conversation Store (SolidJS)
- [ ] Implement `src/features/conversations/stores/conversationStore.ts`.
- [ ] Manage `conversations` list, `activeConversationId`, and `searchQuery`.
- [ ] Implement pagination/infinite scroll state.
- [ ] **TDD:** Test list updates, selection, and search filtering.

## 2. Conversation API
- [ ] Implement `src/features/conversations/api/conversationApi.ts`.
- [ ] Implement fetching conversation lists.
- [ ] Implement fetching message history for a specific thread.
- [ ] **TDD:** Mock API responses for list, thread, and empty states.

## 3. Conversation List View (LightningJS)
- [ ] Implement `src/features/conversations/views/ConversationListView.ts`.
- [ ] Use `LightningJS.List` for high-performance scrolling.
- [ ] Implement `TvListItem` for each conversation.
- [ ] **UX Check:** Ensure visual feedback (scale/border) on focused list items.
- [ ] **UX Check:** Implement search bar integration.

## 4. Message History View (LightningJS)
- [ ] Implement `src/features/conversations/views/MessageListView.ts`.
- [ ] Render message bubbles/items in a scrollable list.
- [ ] Implement "Load More" (infinite scroll) trigger.
- [ ] **UX Check:** Maintain scroll position when new messages arrive.

## 5. Phase 3 Completion Criteria
- [ ] User can browse conversations and enter a chat.
- [ ] Search functionality works and updates the list.
- [ ] Infinite scrolling is performant and smooth.
- [ ] All unit tests pass.
