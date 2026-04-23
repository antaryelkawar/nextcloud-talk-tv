import { createSignal } from 'solid-js';

// Type definitions
export type LoginStatus = 'idle' | 'qr_display' | 'polling' | 'authenticated' | 'error';

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthState {
  loginStatus: LoginStatus;
  serverUrl: string;
  credentials: Credentials | null;
  qrCodeUrl: string;
  error: string | null;
  pollingInterval: number;
}

export interface AuthStore extends AuthState {
  setServerUrl: (url: string) => void;
  setCredentials: (creds: Credentials) => void;
  setQrCodeUrl: (url: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  startQrFlow: () => void;
  startPolling: () => void;
  authenticateSuccess: () => void;
  authenticateFailure: (message: string) => void;
}

export function createAuthStore(): AuthStore {
  const [loginStatus, setLoginStatus] = createSignal<LoginStatus>('idle');
  const [serverUrl, setServerUrlSignal] = createSignal<string>('');
  const [credentials, setCredentialsSignal] = createSignal<Credentials | null>(null);
  const [qrCodeUrl, setQrCodeUrlSignal] = createSignal<string>('');
  const [error, setErrorSignal] = createSignal<string | null>(null);

  return {
    // Getters
    get loginStatus() { return loginStatus(); },
    get serverUrl() { return serverUrl(); },
    get credentials() { return credentials(); },
    get qrCodeUrl() { return qrCodeUrl(); },
    get error() { return error(); },
    get pollingInterval() { return 2000; },

    // Setters
    setServerUrl: (url: string) => setServerUrlSignal(url),
    setCredentials: (creds: Credentials) => setCredentialsSignal(creds),
    setQrCodeUrl: (url: string) => setQrCodeUrlSignal(url),
    setError: (message: string | null) => setErrorSignal(message),

    // State management
    reset: () => {
      setLoginStatus('idle');
      setServerUrlSignal('');
      setCredentialsSignal(null);
      setQrCodeUrlSignal('');
      setErrorSignal(null);
    },

    startQrFlow: () => {
      if (!serverUrl()) {
        setErrorSignal('Server URL is required');
        return;
      }
      setLoginStatus('qr_display');
    },

    startPolling: () => {
      if (loginStatus() !== 'qr_display') {
        setErrorSignal('Must display QR code before polling');
        return;
      }
      setLoginStatus('polling');
    },

    authenticateSuccess: () => {
      if (loginStatus() !== 'polling') {
        setErrorSignal('Must be in polling state to authenticate');
        return;
      }
      setLoginStatus('authenticated');
    },

    authenticateFailure: (message: string) => {
      setErrorSignal(message);
      setLoginStatus('error');
    },
  } as AuthStore;
}

// Default instance for the application
const authStoreInstance = createAuthStore();
export default authStoreInstance;
