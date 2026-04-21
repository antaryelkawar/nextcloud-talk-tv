import { createStore } from "solid-js/store";

export interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  serverUrl: string | null;
  loginStatus: 'idle' | 'qr_display' | 'polling' | 'authenticated';
}

export const [authStore, setAuthStore] = createStore<AuthState>({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
  serverUrl: null,
  loginStatus: 'idle',
});

export const authActions = {
  setAuthenticated: (user: User, token: string) => {
    setAuthStore({
      isAuthenticated: true,
      user,
      token,
      isLoading: false,
      error: null,
      loginStatus: 'authenticated',
    });
    localStorage.setItem('nc_token', token);
  },
  setUnauthenticated: () => {
    setAuthStore({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      serverUrl: null,
      loginStatus: 'idle',
    });
    localStorage.removeItem('nc_token');
  },
  setLoading: (isLoading: boolean) => {
    setAuthStore({ isLoading, error: null });
  },
  setError: (error: string | null) => {
    setAuthStore({ error, isLoading: false });
  },
  setToken: (token: string | null) => {
    setAuthStore({ token });
    if (token) {
      localStorage.setItem('nc_token', token);
    } else {
      localStorage.removeItem('nc_token');
    }
  },
  setServerUrl: (serverUrl: string | null) => {
    setAuthStore({ serverUrl });
  },
  setLoginStatus: (loginStatus: 'idle' | 'qr_display' | 'polling' | 'authenticated') => {
    setAuthStore({ loginStatus });
  },
};
