import { authActions, authStore } from '../stores/authStore';
import QRCode from 'qrcode';

export class LoginApi {
  async selectServer(url: string): Promise<void> {
    authActions.setServerUrl(url);
  }

  async getQrCodeUrl(): Promise<string> {
    const serverUrl = authStore.serverUrl;
    if (!serverUrl) {
      throw new Error('Server URL must be selected before generating QR code');
    }
    // In a real implementation, this would be an API call to the server to get an auth URL
    const authUrl = `${serverUrl}/auth/qr?session_id=mock_session_id`;
    
    // Generate QR code as a Data URL
    return await QRCode.toDataURL(authUrl);
  }

  async pollAuthenticationStatus(intervalMs: number = 2000): Promise<void> {
    authActions.setLoginStatus('polling');

    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          if (authStore.isAuthenticated) {
            clearInterval(interval);
            authActions.setLoginStatus('authenticated');
            resolve();
          } else if (authStore.error) {
            clearInterval(interval);
            authActions.setLoginStatus('idle');
            reject(new Error(authStore.error || 'Unknown error during polling'));
          }
        } catch (e) {
          clearInterval(interval);
          authActions.setLoginStatus('idle');
          reject(e);
        }
      }, intervalMs);
    });
  }
}
