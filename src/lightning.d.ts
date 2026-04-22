import '@lightningjs/core';

declare module '@lightningjs/core' {
  interface Component {
    fireAncestors(event: '$onButtonClick', args: { label: string }): void;
    fireAncestors(event: '$onItemClick', args: { label: string }): void;
    fireAncestors(event: 'showConversationList'): void;
    fireAncestors(event: 'showMessageListView', conversationId: string): void;
    fireAncestors(event: string, ...args: any[]): void;
  }

  interface Application {
    lightningBridge?: any;
  }
}
