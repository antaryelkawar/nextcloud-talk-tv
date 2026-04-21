import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginApi } from './loginApi';
import { authStore, authActions, setAuthStore } from '../stores/authStore';

describe('LoginApi', () => {
  let loginApi: LoginApi;

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
      };
    })();
    vi.stubGlobal('localStorage', localStorageMock);

    loginApi = new LoginApi();
    setAuthStore({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      serverUrl: null,
      loginStatus: 'idle',
    });
  });

  it('should select a server', async () => {
    const url = 'https://nextcloud.example.com';
    await loginApi.selectServer(url);
    expect(authStore.serverUrl).toBe(url);
  });

  it('should get a QR code URL', async () => {
    const url = 'https://nextcloud.example.com';
    await loginApi.selectServer(url);
    const qrUrl = await loginApi.getQrCodeUrl();
    expect(qrUrl).toMatch(/^data:image\/png;base64,/);
  });

  it('should throw error if getQrCodeUrl is called before selecting server', async () => {
    await expect(loginApi.getQrCodeUrl()).rejects.toThrow('Server URL must be selected before generating QR code');
  });

  it('should poll authentication status until authenticated', async () => {
    vi.useFakeTimers();
    
    const pollingPromise = loginApi.pollAuthenticationStatus(100);

    // Advance time
    await vi.advanceTimersByTimeAsync(100);
    expect(authStore.loginStatus).toBe('polling');
    expect(authStore.isAuthenticated).toBe(false);

    // Simulate authentication
    authActions.setAuthenticated({ id: '1', username: 'test', display_name: 'Test User' }, 'token');
    
    await vi.advanceTimersByTimeAsync(100);
    
    await pollingPromise;
    
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.loginStatus).toBe('authenticated');
    
    vi.useRealTimers();
  });
});
