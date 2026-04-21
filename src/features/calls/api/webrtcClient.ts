import { callActions } from '../stores/callStore';
import { SignalingClient } from '../stores/signalingClient';
import { type NCSignalingMessage, type NCSignalingMessageType } from '../stores/signalingTypes';
import { LightningBridge } from '../../../bridge/lightningBridge';

export interface WebRTCConfig {
  iceServers?: RTCIceServer[];
}

export class WebRTCManager {
  private signalingClient: SignalingClient;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private config: WebRTCConfig;
  private bridge: LightningBridge | null = null;

  constructor(signalingClient: SignalingClient, config: WebRTCConfig = {}) {
    this.signalingClient = signalingClient;
    this.config = config;

    // Register callback for signaling events
    this.signalingClient.onSignalingEvent = (type, message) => {
      this.handleSignalingEvent(type, message);
    };
  }

  setBridge(bridge: LightningBridge) {
    this.bridge = bridge;
  }

  async startLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      console.log("Local media stream acquired.");
      return this.localStream;
    } catch (e) {
      console.error("Error acquiring local media stream:", e);
      throw e;
    }
  }

  async createOffer(targetParticipantId: string) {
    const pc = this.createPeerConnection(targetParticipantId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await this.signalingClient.send({
      type: 'offer',
      to: targetParticipantId,
      payload: {
        sdp: offer.sdp
      }
    });
  }

  async handleSignalingEvent(type: NCSignalingMessageType, message: NCSignalingMessage) {
    console.log(`WebRTCManager handling signaling event: ${type}`);
    const from = message.from || '';

    switch (type) {
      case 'offer':
        await this.handleOffer(from, message);
        break;
      case 'answer':
        await this.handleAnswer(from, message);
        break;
      case 'candidate':
        await this.handleCandidate(from, message);
        break;
      default:
        console.warn("WebRTCManager: Unhandled signaling event type", type);
    }
  }

  private async handleOffer(from: string, message: NCSignalingMessage) {
    const pc = this.createPeerConnection(from);
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    if (message.payload?.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription({
        type: 'offer',
        sdp: message.payload.sdp
      }));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await this.signalingClient.send({
        type: 'answer',
        to: from,
        payload: {
          sdp: answer.sdp
        }
      });
    }
  }

  private async handleAnswer(from: string, message: NCSignalingMessage) {
    const pc = this.peerConnections.get(from);
    if (pc && message.payload?.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: message.payload.sdp
      }));
    }
  }

  private async handleCandidate(from: string, message: NCSignalingMessage) {
    const pc = this.peerConnections.get(from);
    if (pc && message.payload?.candidate) {
      const { candidate, sdpMid, sdpMLineIndex } = message.payload.candidate!;
      await pc.addIceCandidate(new RTCIceCandidate({
        candidate,
        sdpMid: sdpMid ?? '',
        sdpMLineIndex: sdpMLineIndex ?? 0
      }));
    }
  }

  private createPeerConnection(participantId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: this.config.iceServers || [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && event.candidate.candidate) {
        this.signalingClient.send({
          type: 'candidate',
          to: participantId,
          payload: {
            candidate: {
              candidate: event.candidate.candidate,
              sdpMid: event.candidate.sdpMid ?? '',
              sdpMLineIndex: event.candidate.sdpMLineIndex ?? 0
            }
          }
        }).catch(console.error);
      }
    };

    pc.ontrack = (_event) => {
      console.log(`Received track from ${participantId}`);
      this.bridge?.handleStreamActive(participantId);
    };

    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${participantId}: ${pc.connectionState}`);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.removeParticipant(participantId);
      }
    };

    this.peerConnections.set(participantId, pc);
    return pc;
  }

  private removeParticipant(participantId: string) {
    const pc = this.peerConnections.get(participantId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(participantId);
    }
    this.bridge?.handleParticipantLeft(participantId);
    callActions.removeParticipant(participantId);
  }

  public stopAll() {
    this.peerConnections.forEach(pc => pc.close());
    this.peerConnections.clear();
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }
}
