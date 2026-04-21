import { WebRTCManager } from '../features/calls/api/webrtcClient';

export type LightningEvent = 
  | { type: 'participant-joined'; participantId: string; nick: string }
  | { type: 'participant-left'; participantId: string }
  | { type: 'stream-active'; participantId: string }
  | { type: 'stream-inactive'; participantId: string }
  | { type: 'auth-status-changed'; isAuthenticated: boolean };

export class LightningBridge {
  private _webRTCManager: WebRTCManager;
  private listeners: Set<(event: LightningEvent) => void> = new Set();

  constructor(webRTCManager: WebRTCManager) {
    this._webRTCManager = webRTCManager;
  }

  on(listener: (event: LightningEvent) => void) {
    this.listeners.add(listener);
  }

  off(listener: (event: LightningEvent) => void) {
    this.listeners.delete(listener);
  }

  public emit(event: LightningEvent) {
    this.listeners.forEach(listener => listener(event));
  }

  // This would be called from WebRTCManager events
  handleParticipantJoined(participantId: string, nick: string) {
    this.emit({ type: 'participant-joined', participantId, nick });
  }

  handleParticipantLeft(participantId: string) {
    this.emit({ type: 'participant-left', participantId });
  }

  handleStreamActive(participantId: string) {
    this.emit({ type: 'stream-active', participantId });
  }

  handleStreamInactive(participantId: string) {
    this.emit({ type: 'stream-inactive', participantId });
  }

  getWebRTCManager() {
    return this._webRTCManager;
  }
}
