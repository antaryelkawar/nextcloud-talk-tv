import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SignalingClient } from './signalingClient';
import type { NCSignalingMessage } from './signalingTypes';
import { callStore } from './callStore';

describe('SignalingClient', () => {
  let client: SignalingClient;
  const baseUrl = 'ws://localhost:8080';

  beforeEach(() => {
    client = new SignalingClient(baseUrl);
    vi.stubGlobal('WebSocket', vi.fn().mockImplementation(() => ({
      send: vi.fn(),
      close: vi.fn(),
      readyState: 1, // OPEN
    })));
  });

  it('should handle incoming call-started message', () => {
    const message: NCSignalingMessage = {
      type: 'call-started'
    };
    client.simulateIncomingMessage(message);
    expect(callStore.status).toBe('connected');
  });

  it('should handle incoming participant-joined message', () => {
    const message: NCSignalingMessage = {
      type: 'participant-joined',
      from: 'user123',
      payload: { name: 'Test User' }
    };
    client.simulateIncomingMessage(message);
    expect(callStore.participants).toHaveLength(1);
    expect(callStore.participants[0].nick).toBe('Test User');
  });
});
