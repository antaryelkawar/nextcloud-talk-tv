// API interface for Nextcloud Talk authentication
export interface LoginResponse {
  loginUrl: string;
  pollingEndpoint: string;
  expiresIn: number;
}

export interface PollingResponse {
  authenticated: boolean;
  token?: string;
  error?: string;
}

export interface LoginError {
  message: string;
  code: number;
}

// Login API client
class LoginApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  // Generate QR code login URL
  async generateLoginUrl(): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/index.php/login/v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        loginUrl: data.login_url || data.url,
        pollingEndpoint: data.polling_endpoint || data.pollingUrl,
        expiresIn: data.expires_in || 300
      };
    } catch (error) {
      console.error('Failed to generate login URL:', error);
      throw error;
    }
  }

  // Poll for authentication status
  async pollAuthStatus(pollingEndpoint: string): Promise<PollingResponse> {
    try {
      const response = await fetch(pollingEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.status === 404) {
        return { authenticated: false };
      }

      if (!response.ok) {
        throw new Error(`Polling failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        authenticated: data.authenticated || data.success,
        token: data.token,
        error: data.error
      };
    } catch (error) {
      console.error('Polling failed:', error);
      return { authenticated: false, error: 'Polling failed' };
    }
  }

  // Direct login with credentials
  async directLogin(username: string, password: string): Promise<{ success: boolean; token?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: new URLSearchParams({
          username,
          password,
          rememberLogin: '1'
        })
      });

      if (response.ok) {
        return { success: true };
      } else if (response.status === 401) {
        return { success: false };
      } else {
        throw new Error(`Login failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Direct login failed:', error);
      return { success: false };
    }
  }
}

export default LoginApi;
