import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Catches rendering errors in child components and shows a friendly fallback
 * instead of crashing the entire app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-orange" />
          </div>
          <h3 className="text-sm font-semibold text-dark mb-1">Something went wrong</h3>
          <p className="text-xs text-med-gray mb-4 max-w-sm">
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                       bg-teal rounded-lg hover:bg-teal-dark transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
