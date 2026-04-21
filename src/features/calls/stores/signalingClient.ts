import { type NCSignalingMessage, type NCSignalingMessageType } from "./signalingTypes";
import { callActions } from "./callStore";

export class SignalingClient {
  private socket: WebSocket | null = null;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  connect() {
    console.log(`Connecting to signaling server at ${this.baseUrl}`);
    const url = this.baseUrl.startsWith('ws') ? this.baseUrl : `ws://${this.baseUrl}`;
    
    try {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log("WebSocket connection established.");
      };

      this.socket.onmessage = (event) => {
        try {
          const message: NCSignalingMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (e) {
          console.error("Error parsing incoming message:", e);
        }
      };

      this.socket.onclose = (event) => {
        console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
        this.socket = null;
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (e) {
      console.error("Failed to create WebSocket:", e);
    }
  }

  private handleMessage(message: NCSignalingMessage) {
    console.log("Received signaling message:", message);
    const type = message.type as NCSignalingMessageType;
    if (!type) return;

    switch (type) {
      case 'offer':
      case 'answer':
      case 'candidate':
        // These will be handled by the WebRTCManager
        console.log(`Signaling event: ${type}`);
        if (this.onSignalingEvent) {
          this.onSignalingEvent(type, message);
        }
        break;

      case 'participant-joined':
        if (message.payload?.name) {
          callActions.addParticipant({
            id: message.from || Math.random().toString(36).substring(7),
            nick: message.payload.name,
            mic: true,
            camera: true,
          });
        }
        break;

      case 'participant-left':
        if (message.from) {
          callActions.removeParticipant(message.from);
        }
        break;

      case 'call-started':
        callActions.setStatus('connected');
        break;

      case 'call-ended':
        callActions.setStatus('ended');
        callActions.reset();
        break;

      case 'error':
        callActions.setError(message.payload?.name || "Unknown signaling error");
        break;

      default:
        console.warn("Unhandled signaling message type:", type);
    }
  }

  async send(message: NCSignalingMessage) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log("Sending signaling message:", message);
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("Cannot send message: WebSocket is not open.");
      throw new Error("WebSocket not connected");
    }
  }

  // Event callback for WebRTCManager to listen to
  onSignalingEvent?: (type: NCSignalingMessageType, message: NCSignalingMessage) => void;

  // To be called by WebRTCManager to pass signaling messages
  handleWebRTCSignaling(type: NCSignalingMessageType, message: NCSignalingMessage) {
    if (this.onSignalingEvent) {
      this.onSignalingEvent(type, message);
    }
  }

  disconnect() {
    console.log("Disconnecting from signaling server.");
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // For testing purposes
  simulateIncomingMessage(message: NCSignalingMessage) {
    this.handleMessage(message);
  }
}
