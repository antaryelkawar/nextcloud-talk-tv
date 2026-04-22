import type { ConversationApiResponse, MessageApiResponse } from "../types";

export const conversationApi = {
  async fetchConversations(_searchQuery: string = "", _nextPageToken: string | null = null): Promise<ConversationApiResponse> {
    // In a real implementation, this would be a fetch call to the backend.
    // For now, we'll just return a placeholder.
    return {
      conversations: [
        { id: '1', title: 'Test Conversation', last_message: 'Hello!', last_message_time: '12:00' }
      ],
      next_page_token: null,
    };
  },

  async fetchMessages(_conversationId: string, _nextPageToken: string | null = null): Promise<MessageApiResponse> {
    return {
      messages: [],
      next_page_token: null,
    };
  },
};
