import { Component } from '@lightningjs/core';
import { conversationStore } from '../stores/conversationStore';
import { TYPOGRAPHY } from '../../../core/constants';

export default class MessageListView extends Component {
  static _template() {
    return {
      rect: true,
      w: 1920,
      h: 1080,
      color: 0xff121212,
      Header: {
        x: 90,
        y: 60,
        Title: {
          text: {
            text: 'Messages',
            fontSize: TYPOGRAPHY.HEADING_SIZE,
            fontFace: 'Inter',
            textColor: 0xffffffff,
          },
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

  init(conversationId: string | null) {
    if (conversationId) {
      const conv = conversationStore.conversations.find(c => c.id === conversationId);
      if (conv) {
        this.tag('Header').tag('Title').text.text = conv.title || 'Unknown';
      }
    }
  }

  _handleBack() {
    this.fireAncestors('showConversationList');
  }

  println(msg: string) {
    console.log(`[MessageListView] ${msg}`);
  }
}
