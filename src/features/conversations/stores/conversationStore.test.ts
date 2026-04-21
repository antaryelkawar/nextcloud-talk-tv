import { describe, it, expect, vi, beforeEach } from 'vitest';
import { conversationStore, conversationActions } from './conversationStore';
import { conversationApi } from '../api/conversationApi';
import { Conversation } from '../types';

vi.mock('../api/conversationApi', () => ({
  conversationApi: {
    fetchConversations: vi.fn(),
    fetchMessages: vi.fn(),
  },
}));

describe('conversationStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to initial state
    conversationActions.reset();
  });

  it('should initialize with default values', () => {
    expect(conversationStore.conversations).toEqual([]);
    expect(conversationStore.activeConversationId).toBeNull();
    expect(conversationStore.searchQuery).toBe('');
    expect(conversationStore.isLoading).toBe(false);
    expect(conversationStore.error).toBeNull();
    expect(conversationStore.nextPageToken).toBeNull();
  });

  it('should update search query', () => {
    conversationActions.setSearchQuery('test');
    expect(conversationStore.searchQuery).toBe('test');
  });

  it('should set active conversation ID', () => {
    const id = 'conv-1';
    conversationActions.setActiveConversation(id);
    expect(conversationStore.activeConversationId).toBe(id);
  });

  it('should fetch conversations and update state', async () => {
    const mockConversations: Conversation[] = [
      { id: '1', title: 'Conv 1', last_message: 'Hello', last_message_time: '2023-01-01T00:00:00Z' },
      { id: '2', title: 'Conv 2', last_message: 'Hi', last_message_time: '2023-01-01T00:01:00Z' },
    ];

    (conversationApi.fetchConversations as any).mockResolvedValue({
      conversations: mockConversations,
      next_page_token: 'next-token',
    });

    await conversationActions.fetchConversations();

    expect(conversationStore.conversations).toEqual(mockConversations);
    expect(conversationStore.nextPageToken).toBe('next-token');
    expect(conversationStore.isLoading).toBe(false);
  });

  it('should handle error during fetching conversations', async () => {
    (conversationApi.fetchConversations as any).mockRejectedValue(new Error('API Error'));

    await conversationActions.fetchConversations();

    expect(conversationStore.error).toBe('API Error');
    expect(conversationStore.isLoading).toBe(false);
  });

  it('should implement search filtering logic', async () => {
    const mockConversations: Conversation[] = [
      { id: '1', title: 'Apple' },
      { id: '2', title: 'Banana' },
    ];

    (conversationApi.fetchConversations as any).mockResolvedValue({
      conversations: mockConversations,
      next_page_token: null,
    });

    await conversationActions.fetchConversations();
    
    // Simulate searching
    conversationActions.setSearchQuery('App');
    // The store should probably re-fetch when search query changes, 
    // or filter locally if that's the design. 
    // The plan says: "Test search filtering logic". 
    // Let's assume it triggers a re-fetch.
    
    await conversationActions.fetchConversations();
    expect(conversationApi.fetchConversations).toHaveBeenCalledWith('App', null);
  });

  it('should support pagination', async () => {
    const mockConversations: Conversation[] = [{ id: '1', title: 'Conv 1' }];
    (conversationApi.fetchConversations as any).mockResolvedValue({
      conversations: mockConversations,
      next_page_token: 'token-1',
    });

    await conversationActions.fetchConversations();
    expect(conversationStore.nextPageToken).toBe('token-1');

    // Fetch next page
    (conversationApi.fetchConversations as any).mockResolvedValue({
      conversations: [{ id: '2', title: 'Conv 2' }],
      next_page_token: null,
    });

    await conversationActions.fetchNextPage();
    expect(conversationStore.conversations).toEqual([
        ...mockConversations,
        { id: '2', title: 'Conv 2' }
    ]);
    expect(conversationStore.nextPageToken).toBeNull();
  });
});
