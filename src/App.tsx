import { createSignal, onMount, onCleanup } from 'solid-js';
import { setAppStore, appStore } from './core/appStore';
import { callStore, callActions } from './features/calls/stores/callStore';
import { SignalingClient } from './features/calls/stores/signalingClient';
import { WebRTCManager } from './features/calls/api/webrtcClient';
import { LightningBridge } from './bridge/lightningBridge';
import { authStore } from './features/auth/stores/authStore';
import { AuthService } from './features/auth/api/authService';
import App from './core/lightning/App';
import LightningCanvas from './core/lightning/LightningCanvas';
import { observe } from './bridge/observer';
import './App.css';

export default function AppContainer() {
  const [signalingClient, setSignalingClient] = createSignal<SignalingClient | null>(null);
  const [webRTCManager, setWebRTCManager] = createSignal<WebRTCManager | null>(null);
  const [lightningBridge, setLightningBridge] = createSignal<LightningBridge | null>(null);
  const [isInitialized, setIsInitialized] = createSignal(false);
  const authService = new AuthService();

  onMount(async () => {
    await authService.checkAuth();

    let sc: SignalingClient;
    if (authStore.isAuthenticated) {
      sc = new SignalingClient('ws://localhost:8080');
      sc.connect();
    } else {
      sc = {
        connect: () => {},
        disconnect: () => {},
        send: async () => {},
        simulateIncomingMessage: () => {},
        onSignalingEvent: undefined
      } as any;
    }

    const wrm = new WebRTCManager(sc);
    const lb = new LightningBridge(wrm);
    wrm.setBridge(lb);

    setSignalingClient(sc);
    setWebRTCManager(wrm);
    setLightningBridge(lb);

    observe(() => authStore.isAuthenticated, (isAuthenticated) => {
      lb.emit({ type: 'auth-status-changed', isAuthenticated });
    });

    setIsInitialized(true);
  });

  onCleanup(() => {
    webRTCManager?.()?.stopAll();
    signalingClient?.()?.disconnect();
  });

  if (!isInitialized()) {
    return <div>Loading...</div>;
  }

  return (
    <App 
      signalingClient={signalingClient()!} 
      webRTCManager={webRTCManager()!}
      lightningBridge={lightningBridge()!}
    />
  );
}

interface AppProps {
  signalingClient: SignalingClient;
  webRTCManager: WebRTCManager;
  lightningBridge: LightningBridge;
}

function App(props: AppProps) {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <div class="controls" style="position: absolute; z-index: 100; top: 20px; left: 20px; background: rgba(0,0,0,0.7); color: white; padding: 20px; border-radius: 8px; font-family: sans-serif;">
        <h1 style="margin-top: 0;">SolidJS Control Panel</h1>
        <div style="margin-bottom: 10px;">
          <button onClick={() => setCount((c) => c + 1)}>
            Count is {count()}
          </button>
        </div>
        
        <div style="margin-bottom: 10px;">
          <button onClick={() => setAppStore(s => ({ ...s, isCallActive: !s.isCallActive }))}>
            Toggle Call Status: {appStore.isCallActive ? "ON" : "OFF"}
          </button>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #555; margin: 10px 0;" />
        
        <h2 style="font-size: 1.2em;">Call Store Status</h2>
        <p>Status: <span style={{ color: callStore.status === 'in-call' ? 'green' : 'red' }}>{callStore.status}</span></p>
        <p>Participants: {callStore.participants.length}</p>
        
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <button onClick={() => callActions.setStatus('connecting')}>Set Connecting</button>
          <button onClick={() => callActions.setStatus('in-call')}>Set In-Call</button>
          <button onClick={() => callActions.setStatus('idle')}>Set Idle</button>
          <button onClick={() => callActions.reset()}>Reset Store</button>
        </div>
        
        <div style="margin-top: 10px;">
          <button onClick={() => callActions.addParticipant({ id: Math.random().toString(36).substring(7), nick: 'New User', mediaState: 'active' })}>
            + Add Participant
          </button>
          <button onClick={() => {
            if (callStore.participants.length > 0) {
              callActions.removeParticipant(callStore.participants[0].id);
            }
          }}>
            - Remove First
          </button>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #555; margin: 10px 0;" />
        
        <h2 style="font-size: 1.2em;">Signaling Simulation</h2>
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <button onClick={() => props.signalingClient.simulateIncomingMessage({
            type: 'participant-joined',
            from: 'user_123',
            payload: { name: 'Simulated User' }
          } as any)}>
            Simulate: Participant Joined
          </button>
          <button onClick={() => props.signalingClient.simulateIncomingMessage({
            type: 'participant-left',
            from: 'user_123'
          } as any)}>
            Simulate: Participant Left
          </button>
          <button onClick={() => props.signalingClient.simulateIncomingMessage({
            type: 'call-started'
          } as any)}>
            Simulate: Call Started
          </button>
          <button onClick={() => props.signalingClient.simulateIncomingMessage({
            type: 'call-ended'
          } as any)}>
            Simulate: Call Ended
          </button>
        </div>
      </div>

      <div class="lightning-container" style="width: 100vw; height: 100vh; background: black;">
        <LightningCanvas lightningBridge={props.lightningBridge} />
      </div>
    </>
  );
}
