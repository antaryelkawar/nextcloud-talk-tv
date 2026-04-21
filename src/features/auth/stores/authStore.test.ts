import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authStore, authActions, setAuthStore } from './authStore';

describe('authStore', () => {
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

    // Reset the store before each test
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

  it('should set serverUrl', () => {
    authActions.setServerUrl('https://example.com');
    expect(authStore.serverUrl).toBe('https://example.com');
  });

  it('should set loginStatus', () => {
    authActions.setLoginStatus('qr_display');
    expect(authStore.loginStatus).toBe('qr_display');
  });

  it('should update isAuthenticated and user when setAuthenticated is called', () => {
    const user = { id: '1', username: 'test', display_name: 'Test User' };
    const token = 'test-token';
    authActions.setAuthenticated(user, token);
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user).toEqual(user);
    expect(authStore.token).toBe(token);
    expect(authStore.loginStatus).toBe('authenticated');
    expect(localStorage.getItem('nc_token')).toBe(token);
  });

  it('should set unauthenticated state', () => {
    const user = { id: '1', username: 'test', display_name: 'Test User' };
    const token = 'test-token';
    authActions.setAuthenticated(user, token);
    authActions.setUnauthenticated();
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
    expect(authStore.serverUrl).toBeNull();
    expect(authStore.loginStatus).toBe('idle');
    expect(localStorage.getItem('nc_token')).toBeNull();
  });
});
