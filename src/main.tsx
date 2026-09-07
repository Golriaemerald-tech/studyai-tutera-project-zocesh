import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './store/AppContext';
import App from './App';
import './index.css';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', color: '#f87171', fontFamily: 'monospace', background: '#020617', minHeight: '100vh' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#fca5a5' }}>Runtime Error Caught:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {this.state.error?.toString()}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "706971985194-qm8sivf0qquafuqf0pc9spgcdj65lv1k.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
