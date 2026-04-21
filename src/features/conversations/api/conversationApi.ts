import { ConversationApiResponse, MessageApiResponse, Conversation, Message } from "../types";

export const conversationApi = {
  async fetchConversations(searchQuery: string = "", nextPageToken: string | null = null): Promise<ConversationApiResponse> {
    // In a real implementation, this would be a fetch call to the backend.
    // For now, we'll just return a placeholder.
    return {
      conversations: [],
      next_page_token: null,
    };
  },

  async fetchMessages(conversationId: string, nextPageToken: string | null = null): Promise<MessageApiResponse> {
    return {
      messages: [],
      next_page_token: null,
    };
  },
};
