'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
      errorId: Math.random().toString(36).substr(2, 9)
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Send error to logging service (replace with your actual service)
      await fetch('/api/admin/error-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          errorId: this.state.errorId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (logError) {
      console.error('Failed to log error to service:', logError);
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/admin';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-gray-800 border border-red-500/20 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-red-500/10 rounded-full">
                  <AlertTriangle className="h-12 w-12 text-red-500" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Oops! Something went wrong
              </h1>
              
              <p className="text-gray-400 mb-6">
                We encountered an unexpected error. Our team has been notified and is working on a fix.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <Bug className="h-4 w-4 text-red-400" />
                    <span className="text-sm font-medium text-red-400">Development Error Details</span>
                  </div>
                  <div className="text-xs text-gray-300 font-mono">
                    <p className="text-red-400 mb-2">{this.state.error.message}</p>
                    <details className="cursor-pointer">
                      <summary className="text-gray-400 hover:text-white">Stack Trace</summary>
                      <pre className="mt-2 text-xs overflow-auto max-h-40 text-gray-500">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 mb-6">
                Error ID: {this.state.errorId}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-500">
                  If this problem persists, please contact support with the error ID above.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/admin/error-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(logError => {
        console.error('Failed to log error:', logError);
      });
    }
  };
}
