import { createSignal } from 'solid-js';
import { authStore } from '../stores/authStore';
import { AuthService } from '../api/authService';

export default function LoginPage(props: { onLoginSuccess: () => void }) {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const authService = new AuthService();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      await authService.login({ username: username(), password: password() });
      props.onLoginSuccess();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div class="login-container">
      <div class="login-card">
        <h2 class="login-title">Nextcloud Login</h2>
        
        {authStore.error && (
          <div class="error-message">
            {authStore.error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label class="form-label">Username</label>
            <input
              type="text"
              class="form-input"
              value={username()}
              onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input
              type="password"
              class="form-input"
              value={password()}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              required
            />
          </div>
          <button
            type="submit"
            class="btn-primary"
            disabled={authStore.isLoading}
          >
            {authStore.isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
