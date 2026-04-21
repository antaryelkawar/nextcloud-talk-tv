import { createSignal } from 'solid-js';
import { authActions, authStore } from '../stores/authStore';
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
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; font-family: sans-serif;">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px;">
        <h2 style="margin-top: 0; text-align: center; color: #1c1e21;">Nextcloud Login</h2>
        
        {authStore.error && (
          <div style="background: #ffebe9; color: #d93025; padding: 10px; border-radius: 4px; margin-bottom: 20px; font-size: 0.9em;">
            {authStore.error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Username</label>
            <input
              type="text"
              value={username()}
              onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
              style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"
              required
            />
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Password</label>
            <input
              type="password"
              value={password()}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"
              required
            />
          </div>
          <button
            type="submit"
            disabled={authStore.isLoading}
            style="width: 100%; padding: 10px; background: #0082c9; color: white; border: none; border-radius: 4px; font-size: 1em; font-weight: 600; cursor: pointer;"
          >
            {authStore.isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
