import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { setAppStore, appStore } from './core/appStore';
import { callStore, callActions } from './features/calls/stores/callStore';
import { SignalingClient } from './features/calls/stores/signalingClient';
import { WebRTCManager } from './features/calls/api/webrtcClient';
import { LightningBridge } from './bridge/lightningBridge';
import { authStore } from './features/auth/stores/authStore';
import { AuthService } from './features/auth/api/authService';
import LightningCanvas from './core/lightning/LightningCanvas';
import { observe } from './bridge/observer';
import './App.css';

export default function AppContainer() {
  const [signalingClient, setSignalingClient] = createSignal<SignalingClient | null>(null);
  const [webRTCManager, setWebRTCManager] = createSignal<WebRTCManager | null>(null);
  const [lightningBridge, setLightningBridge] = createSignal<LightningBridge | null>(null);
  const [isInitialized, setIsInitialized] = createSignal(false);
  const [showDebug, setShowDebug] = createSignal(false);
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

    // Keyboard shortcut to toggle debug overlay (Shift+D)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'D') {
        setShowDebug(!showDebug());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  onCleanup(() => {
    webRTCManager?.()?.stopAll();
    signalingClient?.()?.disconnect();
  });

  return (
    <Show when={isInitialized()} fallback={<div class="login-container">Loading...</div>}>
      <div class="lightning-canvas-container">
        <LightningCanvas lightningBridge={lightningBridge()!} />
      </div>

      <Show when={showDebug()}>
        <DebugOverlay 
          signalingClient={signalingClient()!} 
          webRTCManager={webRTCManager()!} 
        />
      </Show>
    </Show>
  );
}

function DebugOverlay(props: { signalingClient: SignalingClient; webRTCManager: WebRTCManager }) {
  const [count, setCount] = createSignal(0);

  return (
    <div class="debug-overlay">
      <h1 style="margin-top: 0; font-size: 1.5em;">Debug Panel</h1>
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
      
      <h2 style="font-size: 1.1em;">Call Store</h2>
      <p>Status: <span style={{ color: callStore.status === 'connected' ? '#4CAF50' : '#F44336' }}>{callStore.status}</span></p>
      
      <div style="display: flex; flex-direction: column; gap: 5px;">
        <button onClick={() => callActions.setStatus('connected')}>Set Connected</button>
        <button onClick={() => callActions.setStatus('idle')}>Set Idle</button>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #555; margin: 10px 0;" />
      
      <h2 style="font-size: 1.1em;">Signaling</h2>
      <div style="display: flex; flex-direction: column; gap: 5px;">
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
      <p style="font-size: 0.8em; margin-top: 15px; color: #888;">Press Shift+D to hide</p>
    </div>
  );
}
