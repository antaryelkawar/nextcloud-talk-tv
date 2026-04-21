export interface Conversation {
  id: string;
  title: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  timestamp: string;
}

export interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  nextPageToken: string | null;
}

export interface ConversationApiResponse {
  conversations: Conversation[];
  next_page_token: string | null;
}

export interface MessageApiResponse {
  messages: Message[];
  next_page_token: string | null;
}
