import { describe, it, expect, beforeEach, vi } from 'vitest';
import { conversationStore, conversationActions } from './conversationStore';
import { conversationApi } from '../api/conversationApi';
import type { Conversation } from '../types';

vi.mock('../api/conversationApi');

describe('conversationStore', () => {
  beforeEach(() => {
    conversationActions.reset();
    vi.clearAllMocks();
  });

  it('should fetch conversations', async () => {
    const mockConversations: Conversation[] = [
      { id: '1', title: 'Conversation 1' }
    ];
    
    (conversationApi.fetchConversations as any).mockResolvedValue({
      conversations: mockConversations,
      next_page_token: null
    });

    await conversationActions.fetchConversations();

    expect(conversationStore.conversations).toEqual(mockConversations);
    expect(conversationStore.isLoading).toBe(false);
  });

  it('should handle fetch errors', async () => {
    (conversationApi.fetchConversations as any).mockRejectedValue(new Error('Fetch failed'));

    await conversationActions.fetchConversations();

    expect(conversationStore.error).toBe('Fetch failed');
    expect(conversationStore.isLoading).toBe(false);
  });

  it('should set active conversation', () => {
    conversationActions.setActiveConversation('123');
    expect(conversationStore.activeConversationId).toBe('123');
  });

  it('should set search query', () => {
    conversationActions.setSearchQuery('test');
    expect(conversationStore.searchQuery).toBe('test');
  });
});
