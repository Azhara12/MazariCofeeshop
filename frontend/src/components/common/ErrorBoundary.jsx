import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Global ErrorBoundary – catches unexpected rendering errors gracefully.
 * Wrap around your main app or individual route sections.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)',
            fontFamily: 'Inter, -apple-system, sans-serif',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <AlertTriangle size={36} color="#ef4444" />
          </div>

          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#3D2817',
              margin: '0 0 10px',
              fontFamily: 'Playfair Display, Georgia, serif',
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: '#78716c', fontSize: 14, maxWidth: 440, margin: '0 0 24px', lineHeight: 1.6 }}>
            An unexpected error occurred in the MazariCS application. Our team has been notified.
          </p>

          {/* Error details (dev only) */}
          {import.meta.env.DEV && this.state.error && (
            <details
              style={{
                background: '#1c1917',
                color: '#fca5a5',
                padding: '12px 16px',
                borderRadius: 12,
                fontSize: 12,
                fontFamily: 'monospace',
                textAlign: 'left',
                maxWidth: 600,
                width: '100%',
                marginBottom: 24,
                overflow: 'auto',
              }}
            >
              <summary style={{ cursor: 'pointer', marginBottom: 8, color: '#fdba74' }}>
                Error details (dev mode)
              </summary>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={this.handleReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: '#3D2817',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: '#f5f5f4',
                color: '#3D2817',
                border: '1.5px solid #e7e5e4',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
