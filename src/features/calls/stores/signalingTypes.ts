export type NCSignalingMessageType = 
  | 'offer' 
  | 'answer' 
  | 'candidate' 
  | 'hangup' 
  | 'participant-joined' 
  | 'participant-left'
  | 'reaction'
  | 'call-started'
  | 'call-ended'
  | 'error';

export interface NCIceCandidate {
  candidate: string;
  sdpMid: string;
  sdpMLineIndex: number;
}

export interface NCMessagePayload {
  type?: string;
  sdp?: string;
  nick?: string;
  candidate?: NCIceCandidate;
  name?: string;
  state?: boolean;
  timestamp?: number;
  reaction?: string;
  participantId?: string;
}

export interface NCSignalingMessage {
  from?: string;
  to?: string;
  type?: NCSignalingMessageType;
  payload?: NCMessagePayload;
  roomType?: string;
  sid?: string;
  prefix?: string;
}
