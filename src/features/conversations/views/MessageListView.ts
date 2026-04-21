import { Component } from '@lightningjs/core';
import { conversationStore, conversationActions } from '../stores/conversationStore';
import { Conversation } from '../types';

export default class MessageListView extends Component {
  private currentConversationId: string | null = null;

  constructor(config: any) {
    super(config);
    this.width = 1920;
    this.height = 1080;
  }

  init(conversationId: string | null) {
    this.currentConversationId = conversationId;
    this.println(`Message List View Initialized for: ${conversationId}`);
    
    if (conversationId) {
      // In a real implementation, we would fetch messages here.
      // conversationActions.fetchMessages(conversationId);
    }
  }

  onBack() {
    // @ts-ignore
    this.parent.showConversationList();
  }

  destroy() {
    this.println('Message List View Destroyed');
  }
}
