import { Component, createSignal, onMount, For } from 'solid-js';
import { authStoreInstance } from '../store/authStore';
import LoginApi, { LoginResponse } from '../api/loginApi';

interface LoginViewProps {
  onAuthenticated?: () => void;
}

const LoginView: Component<LoginViewProps> = (props) => {
  const [serverUrl, setServerUrl] = createSignal('');
  const [showQr, setShowQr] = createSignal(false);
  const [qrData, setQrData] = createSignal('');
  const [error, setError] = createSignal('');
  const [loginApi, setLoginApi] = createSignal<LoginApi | null>(null);
  const [selectedTab, setSelectedTab] = createSignal<'server' | 'qr' | 'import' | 'cert'>('server');
  const [pollingTimer, setPollingTimer] = createSignal<NodeJS.Timeout | null>(null);

  onMount(async () => {
    // Auto-focus server input
    const input = document.getElementById('server-input');
    if (input) {
      input.focus();
    }
  });

  const handleServerUrlSubmit = async () => {
    const url = serverUrl().trim();
    if (!url) {
      setError('Please enter a server URL');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      setError('Invalid URL format. Use http:// or https://');
      return;
    }

    // Set server URL in auth store
    authStoreInstance.setServerUrl(url);

    // Initialize API
    const api = new LoginApi(url);
    setLoginApi(api);

    try {
      // Try to generate QR login
      const loginData = await api.generateLoginUrl();
      setQrData(loginData.loginUrl);
      setShowQr(true);
      authStoreInstance.setQrCodeUrl(loginData.loginUrl);
      authStoreInstance.startQrFlow();
      setSelectedTab('qr');
    } catch (err) {
      console.error('QR login not supported, falling back to direct login');
      setSelectedTab('server');
      setError('QR login not available. Please use direct login.');
    }
  };

  const startPolling = async () => {
    const api = loginApi();
    if (!api) return;

    // Start polling for authentication
    const poll = async () => {
      try {
        // Extract polling endpoint from QR data
        const pollingEndpoint = qrData().replace('/login', '/login-poll');
        const result = await api.pollAuthStatus(pollingEndpoint);

        if (result.authenticated) {
          // Auth successful
          if (pollingTimer()) {
            clearInterval(pollingTimer());
          }
          authStoreInstance.authenticateSuccess();
          props.onAuthenticated?.();
        } else {
          // Still waiting
          pollingTimer() && clearInterval(pollingTimer());
          setPollingTimer(setTimeout(poll, 2000));
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    poll();
  };

  const handleQrSubmit = () => {
    authStoreInstance.startPolling();
    startPolling();
  };

  const handleImport = () => {
    // Import accounts functionality
    alert('Import accounts not implemented yet');
  };

  const handleCertificate = () => {
    // Certificate authentication
    alert('Certificate authentication not implemented yet');
  };

  const handleDirectLogin = () => {
    // Switch to direct login with username/password
    alert('Direct login not implemented yet');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        const tabs = ['server', 'qr', 'import', 'cert'] as const;
        const currentIndex = tabs.indexOf(selectedTab());
        const nextIndex = (currentIndex + 1) % tabs.length;
        setSelectedTab(tabs[nextIndex]);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        const tabs = ['server', 'qr', 'import', 'cert'] as const;
        const currentIndex = tabs.indexOf(selectedTab());
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        setSelectedTab(tabs[prevIndex]);
        break;
    }
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const timer = pollingTimer();
      if (timer) {
        clearInterval(timer);
      }
    };
  });

  return (
    <div class="login-view" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Nextcloud Talk Logo */}
      <div class="login-header" style={{
        backgroundColor: 'var(--primary, #0082C9)',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '48px',
          margin: '0',
          fontWeight: 700
        }}>
          Nextcloud Talk TV
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: '24px',
          margin: '10px 0 0 0'
        }}>
          Video Calls for TV
        </p>
      </div>

      {/* Error Message */}
      {error() && (
        <div class="error-message" style={{
          backgroundColor: '#f44336',
          color: 'white',
          padding: '20px 40px',
          fontSize: '24px',
          margin: '0 40px 20px 40px',
          borderRadius: '8px'
        }}>
          {error()}
        </div>
      )}

      {/* Main Content */}
      <div class="login-content" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* QR Code Display */}
        <div class="qr-section" style={{
          display: showQr() ? 'block' : 'none',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            marginBottom: '20px',
            display: 'inline-block',
            borderRadius: '8px'
          }}>
            {/* QR Code placeholder - replace with actual QR library */}
            <div style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#666'
            }}>
              QR Code
            </div>
          </div>
          <p style={{ fontSize: '24px', marginTop: '20px' }}>
            Scan with Nextcloud Talk app
          </p>
        </div>

        {/* Server URL Input */}
        <div class="server-input-section" style={{
          display: !showQr() ? 'block' : 'none',
          width: '100%',
          maxWidth: '600px',
          padding: '0 40px'
        }}>
          <label for="server-input" style={{
            display: 'block',
            fontSize: '24px',
            marginBottom: '10px',
            color: 'white'
          }}>
            Server URL
          </label>
          <input
            id="server-input"
            type="text"
            value={serverUrl()}
            onInput={(e) => setServerUrl(e.target.value)}
            placeholder="https://your-nextcloud.com"
            style={{
              width: '100%',
              padding: '20px 30px',
              fontSize: '24px',
              border: '2px solid #0082C9',
              borderRadius: '8px',
              outline: 'none',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleServerUrlSubmit();
              }
            }}
          />
        </div>

        {/* Action Buttons */}
        <div class="action-buttons" style={{
          display: 'flex',
          gap: '20px',
          marginTop: '40px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            class="btn-primary"
            onClick={handleServerUrlSubmit}
            style={{
              padding: '20px 40px',
              fontSize: '24px',
              backgroundColor: '#0082C9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '200px'
            }}
            tabIndex={0}
          >
            Connect
          </button>

          <button
            class="btn-secondary"
            onClick={handleQrSubmit}
            disabled={!showQr()}
            style={{
              padding: '20px 40px',
              fontSize: '24px',
              backgroundColor: showQr() ? '#4CAF50' : '#666',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: showQr() ? 'pointer' : 'not-allowed',
              minWidth: '200px'
            }}
            tabIndex={0}
          >
            {showQr() ? 'Start Polling' : 'Waiting for QR...'}
          </button>
        </div>
      </div>

      {/* Bottom Navigation Tabs */}
      <div class="login-tabs" style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '20px 40px',
        display: 'flex',
        gap: '20px',
        justifyContent: 'center'
      }}>
        <button
          class={`tab ${selectedTab() === 'server' ? 'active' : ''}`}
          onClick={() => setSelectedTab('server')}
          style={{
            padding: '15px 30px',
            fontSize: '20px',
            backgroundColor: selectedTab() === 'server' ? '#0082C9' : 'transparent',
            color: selectedTab() === 'server' ? 'white' : 'white',
            border: '2px solid #0082C9',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          tabIndex={0}
        >
          Server Login
        </button>

        <button
          class={`tab ${selectedTab() === 'qr' ? 'active' : ''}`}
          onClick={() => setSelectedTab('qr')}
          style={{
            padding: '15px 30px',
            fontSize: '20px',
            backgroundColor: selectedTab() === 'qr' ? '#0082C9' : 'transparent',
            color: selectedTab() === 'qr' ? 'white' : 'white',
            border: '2px solid #0082C9',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          tabIndex={0}
        >
          QR Code
        </button>

        <button
          class={`tab ${selectedTab() === 'import' ? 'active' : ''}`}
          onClick={handleImport}
          style={{
            padding: '15px 30px',
            fontSize: '20px',
            backgroundColor: selectedTab() === 'import' ? '#0082C9' : 'transparent',
            color: selectedTab() === 'import' ? 'white' : 'white',
            border: '2px solid #0082C9',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          tabIndex={0}
        >
          Import Accounts
        </button>

        <button
          class={`tab ${selectedTab() === 'cert' ? 'active' : ''}`}
          onClick={handleCertificate}
          style={{
            padding: '15px 30px',
            fontSize: '20px',
            backgroundColor: selectedTab() === 'cert' ? '#0082C9' : 'transparent',
            color: selectedTab() === 'cert' ? 'white' : 'white',
            border: '2px solid #0082C9',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          tabIndex={0}
        >
          Certificate
        </button>
      </div>
    </div>
  );
};

export default LoginView;
