import { Component } from '@lightningjs/core';
import { conversationStore, conversationActions } from '../stores/conversationStore';
import TvListItem from '../../../components/TvListItem';
import { observe } from '../../../bridge/observer';
import { TYPOGRAPHY } from '../../../core/constants';

export default class ConversationListView extends Component {
  private _index: number = 0;

  static _template() {
    return {
      rect: true,
      w: 1920,
      h: 1080,
      color: 0xff121212,
      Title: {
        x: 90,
        y: 60,
        text: {
          text: 'Conversations',
          fontSize: TYPOGRAPHY.HEADING_SIZE,
          fontFace: 'Inter',
          textColor: 0xffffffff,
        },
      },
      List: {
        x: 90,
        y: 150,
        w: 1740,
        h: 840,
        children: [],
      },
    };
  }

  _init() {
    this._index = 0;
    conversationActions.fetchConversations();
    this.setupObservers();
  }

  private setupObservers() {
    observe(() => conversationStore.conversations, (conversations) => {
      this.renderList(conversations);
    });
  }

  private renderList(conversations: any[]) {
    const listItems = conversations.map((conv, index) => ({
      type: TvListItem,
      y: index * 130,
      label: conv.title || 'Unknown',
      subLabel: conv.last_message || 'No messages yet',
    }));

    this.tag('List').patch({
      children: listItems,
    });
  }

  _getFocused() {
    return this.tag('List').children[this._index];
  }

  _handleDown() {
    if (this._index < this.tag('List').children.length - 1) {
      this._index++;
    }
  }

  _handleUp() {
    if (this._index > 0) {
      this._index--;
    }
  }

  $onItemClick({ label }: { label: string }) {
    console.log(`Item clicked: ${label}`);
    const conv = conversationStore.conversations[this._index];
    if (conv) {
      conversationActions.setActiveConversation(conv.id);
      this.fireAncestors('showMessageListView', conv.id);
    }
  }
}
