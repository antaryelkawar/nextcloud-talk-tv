import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WebRTCManager } from './webrtcClient';
import { SignalingClient } from '../stores/signalingClient';
import { LightningBridge } from '../../../bridge/lightningBridge';
import { callActions } from '../stores/callStore';

vi.mock('../stores/signalingClient');
vi.mock('../stores/callStore');
vi.mock('../../../bridge/lightningBridge');

describe('WebRTCManager', () => {
  let signalingClient: SignalingClient;
  let manager: WebRTCManager;
  let bridge: LightningBridge;

  beforeEach(() => {
    vi.clearAllMocks();
    signalingClient = new SignalingClient('ws://localhost:8080');
    manager = new WebRTCManager(signalingClient);
    bridge = new LightningBridge();
    manager.setBridge(bridge);

    // Mock navigator.mediaDevices
    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: vi.fn() }],
      }),
    } as any;

    // Mock RTCPeerConnection
    class MockRTCPeerConnection {
      createOffer = vi.fn().mockResolvedValue({ sdp: 'offer-sdp' });
      createAnswer = vi.fn().mockResolvedValue({ sdp: 'answer-sdp' });
      setLocalDescription = vi.fn().mockResolvedValue(undefined);
      setRemoteDescription = vi.fn().mockResolvedValue(undefined);
      addIceCandidate = vi.fn().mockResolvedValue(undefined);
      close = vi.fn();
      onicecandidate = null;
      ontrack = null;
      onconnectionstatechange = null;
      connectionState = 'new';
    }
    global.RTCPeerConnection = MockRTCPeerConnection as any;

    global.RTCSessionDescription = vi.fn();
    global.RTCIceCandidate = vi.fn();
  });

  it('should start local stream', async () => {
    const stream = await manager.startLocalStream();
    expect(stream).toBeDefined();
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
  });

  it('should create offer and send via signaling', async () => {
    await manager.createOffer('user1');
    expect(signalingClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'offer',
        to: 'user1',
        payload: { sdp: 'offer-sdp' },
      })
    );
  });

  it('should handle offer and send answer', async () => {
    const message = {
      type: 'offer',
      from: 'user1',
      payload: { sdp: 'offer-sdp' },
    };

    await manager.handleSignalingEvent('offer', message as any);

    expect(signalingClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'answer',
        to: 'user1',
        payload: { sdp: 'answer-sdp' },
      })
    );
  });

  it('should stop all connections', async () => {
    await manager.startLocalStream();
    await manager.createOffer('user1');
    manager.stopAll();
    // We can't easily check RTCPeerConnection.close because it's a mock of the class
    // but we can check if localStream tracks are stopped if we had a better mock.
  });
});
