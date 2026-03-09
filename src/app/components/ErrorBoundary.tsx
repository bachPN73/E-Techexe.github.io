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
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-red-100">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi!</h1>
            <p className="text-gray-600 mb-4">
              Hệ thống gặp sự cố trong quá trình hiển thị giao diện.
            </p>
            <div className="bg-gray-100 p-4 rounded text-sm text-red-800 font-mono break-words mb-6 max-h-40 overflow-auto">
              {this.state.error?.message}
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Quay lại Trang chủ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
