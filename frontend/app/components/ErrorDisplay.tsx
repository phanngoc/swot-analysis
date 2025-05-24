'use client';

import React from 'react';
import { AlertCircle, XCircle, RefreshCw } from 'lucide-react';

type ErrorDisplayProps = {
  error: string | null;
  onRetry?: () => void;
  className?: string;
  variant?: 'default' | 'large';
};

/**
 * Error display component for showing user-friendly error messages
 * with optional retry functionality
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  className = '',
  variant = 'default',
}) => {
  if (!error) return null;

  // Parse and format backend errors that may come as JSON strings
  let errorMessage = error;
  try {
    const parsedError = JSON.parse(error);
    if (parsedError.detail) {
      errorMessage = parsedError.detail;
    } else if (parsedError.error) {
      errorMessage = parsedError.error;
    }
  } catch (e) {
    // Not JSON, use as is
  }

  if (variant === 'large') {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 mb-6 ${className}`}>
        <div className="flex items-center mb-3">
          <XCircle className="h-8 w-8 text-red-500 mr-3" />
          <h3 className="text-lg font-semibold text-red-800">Đã xảy ra lỗi</h3>
        </div>
        <p className="text-red-700 mb-4">{errorMessage}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Thử lại</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-4 ${className}`}>
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
        <p className="text-sm text-red-700">{errorMessage}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 mt-2 text-sm text-red-600 hover:text-red-800"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Thử lại</span>
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
