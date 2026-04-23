import { describe, it, expect, beforeEach } from 'vitest';
import { createAuthStore } from './authStore';

describe('AuthStore - TDD Tests', () => {
  let authStoreInstance: any;

  beforeEach(() => {
    // Create a fresh instance for each test to avoid state pollution
    authStoreInstance = createAuthStore();
  });

  describe('Initial State', () => {
    it('should have idle as default login status', () => {
      expect(authStoreInstance.loginStatus).toBe('idle');
    });

    it('should have empty server URL by default', () => {
      expect(authStoreInstance.serverUrl).toBe('');
    });

    it('should have null credentials by default', () => {
      expect(authStoreInstance.credentials).toBeNull();
    });

    it('should have empty error by default', () => {
      expect(authStoreInstance.error).toBeNull();
    });
  });

  describe('State Transitions - Valid Flow', () => {
    it('should transition from idle to qr_display', () => {
      authStoreInstance.startQrFlow();
      expect(authStoreInstance.loginStatus).toBe('qr_display');
    });

    it('should transition from qr_display to polling', () => {
      authStoreInstance.startQrFlow();
      expect(authStoreInstance.loginStatus).toBe('qr_display');
      
      authStoreInstance.startPolling();
      expect(authStoreInstance.loginStatus).toBe('polling');
    });

    it('should transition from polling to authenticated', () => {
      authStoreInstance.startQrFlow();
      authStoreInstance.startPolling();
      
      authStoreInstance.authenticateSuccess();
      expect(authStoreInstance.loginStatus).toBe('authenticated');
    });

    it('should handle complete login flow', () => {
      const flow: string[] = [];
      
      authStoreInstance.startQrFlow();
      flow.push(authStoreInstance.loginStatus);
      
      authStoreInstance.startPolling();
      flow.push(authStoreInstance.loginStatus);
      
      authStoreInstance.authenticateSuccess();
      flow.push(authStoreInstance.loginStatus);
      
      expect(flow).toEqual(['qr_display', 'polling', 'authenticated']);
    });
  });

  describe('Error Handling', () => {
    it('should set error message', () => {
      authStoreInstance.setError('Test error message');
      expect(authStoreInstance.error).toBe('Test error message');
    });

    it('should transition to error state on failure', () => {
      authStoreInstance.authenticateFailure('Authentication failed');
      expect(authStoreInstance.loginStatus).toBe('error');
      expect(authStoreInstance.error).toBe('Authentication failed');
    });

    it('should not start polling without QR flow', () => {
      // This should not throw, but also shouldn't change state
      authStoreInstance.startPolling();
      expect(authStoreInstance.loginStatus).toBe('idle');
    });

    it('should not authenticate without polling', () => {
      // This should not change state
      authStoreInstance.authenticateSuccess();
      expect(authStoreInstance.loginStatus).toBe('idle');
    });
  });

  describe('Server URL Management', () => {
    it('should accept valid URLs', () => {
      authStoreInstance.setServerUrl('https://example.com');
      expect(authStoreInstance.serverUrl).toBe('https://example.com');
    });

    it('should handle trailing slashes', () => {
      authStoreInstance.setServerUrl('https://example.com/');
      expect(authStoreInstance.serverUrl).toBe('https://example.com/');
    });

    it('should clear on reset', () => {
      authStoreInstance.setServerUrl('https://example.com');
      authStoreInstance.reset();
      expect(authStoreInstance.serverUrl).toBe('');
    });
  });

  describe('Credentials Management', () => {
    it('should store credentials object', () => {
      const creds = { username: 'testuser', password: 'testpass' };
      authStoreInstance.setCredentials(creds);
      expect(authStoreInstance.credentials).toEqual(creds);
    });

    it('should clear credentials on reset', () => {
      authStoreInstance.setCredentials({ username: 'user', password: 'pass' });
      authStoreInstance.reset();
      expect(authStoreInstance.credentials).toBeNull();
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all state to defaults', () => {
      // Set up complex state
      authStoreInstance.setServerUrl('https://example.com');
      authStoreInstance.setCredentials({ username: 'user', password: 'pass' });
      authStoreInstance.startQrFlow();
      authStoreInstance.startPolling();
      authStoreInstance.setError('Some error');
      
      // Reset
      authStoreInstance.reset();
      
      // Verify reset
      expect(authStoreInstance.loginStatus).toBe('idle');
      expect(authStoreInstance.serverUrl).toBe('');
      expect(authStoreInstance.credentials).toBeNull();
      expect(authStoreInstance.error).toBeNull();
    });
  });

  describe('QrCode URL Management', () => {
    it('should set QR code URL', () => {
      authStoreInstance.setQrCodeUrl('https://example.com/login?token=abc123');
      expect(authStoreInstance.qrCodeUrl).toBe('https://example.com/login?token=abc123');
    });

    it('should clear on reset', () => {
      authStoreInstance.setQrCodeUrl('https://example.com/login');
      authStoreInstance.reset();
      expect(authStoreInstance.qrCodeUrl).toBe('');
    });
  });

  describe('Concurrent State Changes', () => {
    it('should handle rapid state changes without errors', () => {
      expect(() => {
        authStoreInstance.startQrFlow();
        authStoreInstance.startPolling();
        authStoreInstance.authenticateFailure('Error');
        authStoreInstance.reset();
        authStoreInstance.startQrFlow();
      }).not.toThrow();
    });

    it('should maintain state consistency', () => {
      authStoreInstance.setServerUrl('https://test.com');
      authStoreInstance.startQrFlow();
      
      // Should have valid state after flow start
      expect(authStoreInstance.serverUrl).toBe('https://test.com');
      expect(authStoreInstance.loginStatus).toBe('qr_display');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple resets gracefully', () => {
      authStoreInstance.reset();
      authStoreInstance.reset();
      authStoreInstance.reset();
      expect(authStoreInstance.loginStatus).toBe('idle');
    });

    it('should handle setting same value multiple times', () => {
      authStoreInstance.setServerUrl('https://example.com');
      authStoreInstance.setServerUrl('https://example.com');
      authStoreInstance.setServerUrl('https://example.com');
      expect(authStoreInstance.serverUrl).toBe('https://example.com');
    });

    it('should handle null error properly', () => {
      authStoreInstance.setError('Error occurred');
      expect(authStoreInstance.error).toBe('Error occurred');
      
      authStoreInstance.setError(null);
      expect(authStoreInstance.error).toBeNull();
    });
  });
});
