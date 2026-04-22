import { Application } from '@lightningjs/core';
import LoginView from '../../features/auth/views/LoginView';
import ConversationListView from '../../features/conversations/views/ConversationListView';
import MessageListView from '../../features/conversations/views/MessageListView';
import { LightningBridge, type LightningEvent } from '../../bridge/lightningBridge';
import { authStore } from '../../features/auth/stores/authStore';

export default class App extends Application {
  private currentView: any = null;
  public lightningBridge?: LightningBridge;

  constructor(options: any) {
    super(options);
    // Explicitly capture lightningBridge from options if it's there
    if (options && options.lightningBridge) {
      this.lightningBridge = options.lightningBridge;
    }
  }

  static _template() {
    return {
      rect: true,
      w: 1920,
      h: 1080,
      color: 0xff121212,
    };
  }

  _init() {
    // If not set in constructor, try to get from stage options
    if (!this.lightningBridge && (this.stage as any).options) {
      this.lightningBridge = (this.stage as any).options.lightningBridge;
    }
    
    this.setupListeners();
    
    this.println('Lightning App Initialized');
    if (authStore.isAuthenticated) {
      this.showConversationList();
    } else {
      this.showLoginView();
    }
  }

  private setupListeners() {
    if (this.lightningBridge) {
      this.lightningBridge.on((event: LightningEvent) => {
        if (event.type === 'auth-status-changed') {
          if (event.isAuthenticated) {
            this.showConversationList();
          } else {
            this.showLoginView();
          }
        }
      });
    }
  }

  showLoginView() {
    this.switchView(this.stage.c({ type: LoginView }));
  }

  showConversationList() {
    this.switchView(this.stage.c({ type: ConversationListView }));
  }

  showMessageListView(conversationId: string) {
    const view = this.stage.c({ type: MessageListView });
    // @ts-ignore
    view.init(conversationId);
    this.switchView(view);
  }

  private switchView(newView: any) {
    if (this.currentView) {
      this.childList.remove(this.currentView);
    }
    this.currentView = newView;
    this.childList.add(this.currentView);
  }

  println(msg: string) {
    console.log(`[Lightning] ${msg}`);
  }

  onCallStarted() {
    this.println('Call Started!');
  }

  onCallEnded() {
    this.println('Call Ended!');
  }

  updateParticipantCount(count: number) {
    this.println(`Participants: ${count}`);
  }
}
