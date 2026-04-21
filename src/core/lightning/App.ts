import { Application } from '@lightningjs/core';
import TvButton from '../../components/TvButton';
import LoginView from '../../features/auth/views/LoginView';
import ConversationListView from '../../features/conversations/views/ConversationListView';
import MessageListView from '../../features/conversations/views/MessageListView';
import { LightningBridge, LightningEvent } from '../../bridge/lightningBridge';
import { authStore } from '../../features/auth/stores/authStore';

export default class App extends Application {
  private currentView: any = null;
  private lightningBridge: LightningBridge;

  constructor(lightningBridge: LightningBridge) {
    super();
    this.lightningBridge = lightningBridge;
    this.setupListeners();
  }

  private setupListeners() {
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

  init() {
    this.println('Lightning App Initialized');
    if (authStore.isAuthenticated) {
      this.showConversationList();
    } else {
      this.showLoginView();
    }
  }

  showLoginView() {
    this.switchView(new LoginView());
  }

  showConversationList() {
    this.switchView(new ConversationListView());
  }

  showMessageListView(conversationId: string) {
    const view = new MessageListView();
    view.init(conversationId);
    this.switchView(view);
  }

  private switchView(newView: any) {
    if (this.currentView) {
      this.remove(this.currentView);
    }
    this.currentView = newView;
    this.add(this.currentView);
  }

  println(msg: string) {
    console.log(msg);
  }

  createButtons() {
    const btn1 = new TvButton({
      x: 460,
      y: 440,
      width: 100,
      height: 100,
      texture: 'button_texture', 
    });
    btn1.setLabel('Button 1');
    this.add(btn1);

    const btn2 = new TvButton({
      x: 660,
      y: 440,
      width: 100,
      height: 100,
      texture: 'button_texture', 
    });
    btn2.setLabel('Button 2');
    this.add(btn2);
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


  showLoginView() {
    this.switchView(new LoginView());
  }

  showConversationList() {
    this.switchView(new ConversationListView());
  }

  showMessageListView(conversationId: string) {
    const view = new MessageListView();
    view.init(conversationId);
    this.switchView(view);
  }

  private switchView(newView: any) {
    if (this.currentView) {
      this.remove(this.currentView);
    }
    this.currentView = newView;
    this.add(this.currentView);
  }

  println(msg: string) {
    console.log(msg);
  }

  createButtons() {
    const btn1 = new TvButton({
      x: 460,
      y: 440,
      width: 100,
      height: 100,
      texture: 'button_texture', 
    });
    btn1.setLabel('Button 1');
    this.add(btn1);

    const btn2 = new TvButton({
      x: 660,
      y: 440,
      width: 100,
      height: 100,
      texture: 'button_texture', 
    });
    btn2.setLabel('Button 2');
    this.add(btn2);
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
