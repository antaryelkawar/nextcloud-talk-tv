import { createStore } from "solid-js/store";

export type CallStatus = 'idle' | 'dialing' | 'connected' | 'ended' | 'error';

export interface Participant {
  id: string;
  nick: string;
  mic: boolean;
  camera: boolean;
}

export interface CallStoreState {
  status: CallStatus;
  participants: Participant[];
  error: string | null;
  remoteSessionId: string | null;
}

export const [callStore, setCallStore] = createStore<CallStoreState>({
  status: 'idle',
  participants: [],
  error: null,
  remoteSessionId: null,
});

export const callActions = {
  setStatus: (status: CallStatus) => setCallStore("status", status),
  setError: (error: string | null) => setCallStore("error", error),
  setRemoteSessionId: (sid: string | null) => setCallStore("remoteSessionId", sid),
  addParticipant: (participant: Participant) => {
    if (!callStore.participants.find(p => p.id === participant.id)) {
      setCallStore("participants", (p) => [...p, participant]);
    }
  },
  removeParticipant: (id: string) => {
    setCallStore("participants", (p) => p.filter(part => part.id !== id));
  },
  updateParticipant: (id: string, updates: Partial<Participant>) => {
    setCallStore("participants", (p) => 
      p.map(part => part.id === id ? { ...part, ...updates } : part)
    );
  },
  reset: () => setCallStore({
    status: 'idle',
    participants: [],
    error: null,
    remoteSessionId: null,
  }),
};
