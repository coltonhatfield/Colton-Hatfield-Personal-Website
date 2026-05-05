import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // If it is a chunk load error, we can reload the page once
    if (error.name === 'ChunkLoadError' || error.message.includes('dynamically imported module') || error.message.includes('Failed to fetch dynamically imported module')) {
      if (!sessionStorage.getItem('reloaded-for-chunk-error')) {
        sessionStorage.setItem('reloaded-for-chunk-error', 'true');
        window.location.reload();
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-[#F0B800] space-y-4 p-8 text-center font-mono">
          <h1 className="text-2xl font-bold uppercase tracking-widest">System Error</h1>
          <p className="text-sm text-[#A3A3A3] max-w-lg">
            {this.state.error?.message || 'An unexpected error occurred while loading the application.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 border border-[#F0B800] text-[#F0B800] hover:bg-[#F0B800] hover:text-black transition-colors uppercase tracking-widest text-xs font-bold"
          >
            Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
