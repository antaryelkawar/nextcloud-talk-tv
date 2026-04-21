import { authActions, type User } from '../stores/authStore';

export class AuthService {
  async login(credentials: { username?: string; password?: string }): Promise<User> {
    authActions.setLoading(true);
    console.log("Attempting login with credentials:", credentials);

    // In a real implementation, this would be a request to the Nextcloud server
    // or a redirect to an OAuth2 provider.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'password') {
          const user: User = {
            id: 'user_123',
            username: 'admin',
            display_name: 'Administrator',
            avatar_url: 'https://nextcloud.com/avatar.png'
          };
          const token = 'mock_token_123456789';
          authActions.setAuthenticated(user, token);
          resolve(user);
        } else {
          const error = 'Invalid username or password';
          authActions.setError(error);
          reject(new Error(error));
        }
      }, 1000);
    });
  }

  async logout() {
    console.log("Logging out...");
    authActions.setUnauthenticated();
  }

  async checkAuth(): Promise<void> {
    const token = localStorage.getItem('nc_token');
    if (token) {
      console.log("Found token in localStorage, verifying...");
      // In a real implementation, we would verify the token with the server.
      // For now, we'll assume it's valid and mock the user.
      const user: User = {
        id: 'user_123',
        username: 'admin',
        display_name: 'Administrator'
      };
      authActions.setAuthenticated(user, token);
    } else {
      authActions.setUnauthenticated();
    }
  }
}
