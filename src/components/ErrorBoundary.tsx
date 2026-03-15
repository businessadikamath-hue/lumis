// src/components/ErrorBoundary.tsx
import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props  { children: ReactNode }
interface State  { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console in dev. In production you could send to a logging service.
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '32px',
        background: 'var(--bg-base)',
        color: 'var(--text-primary)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '40px' }}>⚠️</p>
        <p style={{ fontSize: '20px', fontWeight: '600' }}>Something went wrong</p>
        <p style={{ fontSize: '14px', opacity: '0.6', fontFamily: 'monospace' }}>
          {this.state.error?.message}
        </p>
        <button
          onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/' }}
          style={{
            marginTop: '16px',
            padding: '12px 28px',
            background: 'var(--accent-violet)',
            color: '#fff',
            border: 'none',
            borderRadius: '100px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Reload app
        </button>
      </div>
    )
  }
}