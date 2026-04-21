import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SignalingClient } from './signalingClient';
import { callActions } from './callStore';
import { NCSignalingMessage } from './signalingTypes';

vi.mock('./callStore', () => ({
  callActions: {
    setStatus: vi.fn(),
    setError: vi.fn(),
    addParticipant: vi.fn(),
    removeParticipant: vi.fn(),
    reset: vi.fn(),
  },
}));

describe('SignalingClient', () => {
  let client: SignalingClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new SignalingClient('ws://localhost:8080');
  });

  it('should handle participant-joined message', () => {
    const message: NCSignalingMessage = {
      type: 'participant-joined',
      from: 'user1',
      payload: { name: 'Alice' },
    };

    client.simulateIncomingMessage(message);

    expect(callActions.addParticipant).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user1',
        nick: 'Alice',
      })
    );
  });

  it('should handle participant-left message', () => {
    const message: NCSignalingMessage = {
      type: 'participant-left',
      from: 'user1',
    };

    client.simulateIncomingMessage(message);

    expect(callActions.removeParticipant).toHaveBeenCalledWith('user1');
  });

  it('should dispatch WebRTC signaling events', () => {
    const onSignalingEvent = vi.fn();
    client.onSignalingEvent = onSignalingEvent;

    const message: NCSignalingMessage = {
      type: 'offer',
      from: 'user1',
      payload: { sdp: 'v=0...' },
    };

    client.simulateIncomingMessage(message);

    expect(onSignalingEvent).toHaveBeenCalledWith('offer', message);
  });

  it('should handle call-started message', () => {
    const message: NCSignalingMessage = {
      type: 'call-started',
    };
    
    client.simulateIncomingMessage(message);
    expect(callActions.setStatus).toHaveBeenCalledWith('connected');
  });

  it('should handle call-ended message', () => {
    const message: NCSignalingMessage = {
      type: 'call-ended',
    };
    
    client.simulateIncomingMessage(message);
    expect(callActions.setStatus).toHaveBeenCalledWith('ended');
    expect(callActions.reset).toHaveBeenCalled();
  });

});
