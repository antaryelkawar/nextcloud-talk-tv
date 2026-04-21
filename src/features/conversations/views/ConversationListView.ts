import { Component } from '@lightningjs/core';
import { conversationStore, conversationActions } from '../stores/conversationStore';
import TvListItem from '../../../components/TvListItem';

// @ts-ignore
import { List } from '@lightningjs/core';

export default class ConversationListView extends Component {
  private list: any;

  constructor(config: any) {
    super(config);
    this.width = 1920;
    this.height = 1080;

    // @ts-ignore
    this.list = new List({
      x: 100,
      y: 100,
      width: 1720,
      height: 880,
      itemComponent: TvListItem,
      itemCount: 0,
    });
    this.add(this.list);
  }

  init() {
    this.println('Conversation List View Initialized');
    conversationActions.fetchConversations();
    
    // Polling for updates from the store
    this.updateInterval = setInterval(() => {
      this.syncWithStore();
    }, 1000);
  }

  private syncWithStore() {
    const conversations = conversationStore.conversations;
    
    if (this.list.itemCount !== conversations.length) {
      this.list.itemCount = conversations.length;
      this.list.refresh();
    }

    conversations.forEach((conv, index) => {
      const item = this.list.getItem(index);
      if (item) {
        item.setLabel(conv.title);
      }
    });
  }

  onSelect(index: number) {
    const conv = conversationStore.conversations[index];
    if (conv) {
      conversationActions.setActiveConversation(conv.id);
      // In a real app, we'd tell the App to switch views
      // For now, we'll just log it
      this.println(`Selected conversation: ${conv.title}`);
      // @ts-ignore
      this.parent.showMessageListView(conv.id);
    }
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}
