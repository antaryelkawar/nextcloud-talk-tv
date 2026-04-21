import { createStore } from "solid-js/store";
import { Conversation, ConversationState } from "../types";
import { conversationApi } from "../api/conversationApi";

const initialState: ConversationState = {
  conversations: [],
  activeConversationId: null,
  searchQuery: "",
  isLoading: false,
  error: null,
  nextPageToken: null,
};

export const [conversationStore, setConversationStore] = createStore<ConversationState>(initialState);

export const conversationActions = {
  reset: () => setConversationStore(initialState),
  
  setActiveConversation: (id: string | null) => {
    setConversationStore({ activeConversationId: id });
  },

  setSearchQuery: (query: string) => {
    setConversationStore({ searchQuery: query });
  },

  fetchConversations: async () => {
    setConversationStore({ isLoading: true, error: null });
    try {
      const { conversations, next_page_token } = await conversationApi.fetchConversations(
        conversationStore.searchQuery,
        null // Always start from the beginning when calling fetchConversations
      );
      setConversationStore({
        conversations: conversations,
        nextPageToken: next_page_token,
        isLoading: false,
      });
    } catch (err: any) {
      setConversationStore({
        error: err.message || "Failed to fetch conversations",
        isLoading: false,
      });
    }
  },

  fetchNextPage: async () => {
    if (!conversationStore.nextPageToken || conversationStore.isLoading) return;

    setConversationStore({ isLoading: true, error: null });
    try {
      const { conversations, next_page_token } = await conversationApi.fetchConversations(
        conversationStore.searchQuery,
        conversationStore.nextPageToken
      );
      setConversationStore({
        conversations: [...conversationStore.conversations, ...conversations],
        nextPageToken: next_page_token,
        isLoading: false,
      });
    } catch (err: any) {
      setConversationStore({
        error: err.message || "Failed to fetch next page",
        isLoading: false,
      });
    }
  },
};
