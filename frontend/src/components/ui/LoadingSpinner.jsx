import React from 'react';
import { cn } from '../../utils';

const LoadingSpinner = ({ size = 'md', className = '', fullScreen = false }) => {
  const sizes = {
    xs: 'h-3 w-3 border-2',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
    xl: 'h-12 w-12 border-4',
  };

  const spinner = (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-primary-500 border-t-transparent',
        sizes[size],
        className
      )}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="text-center">
          <div className={cn('inline-block animate-spin rounded-full border-primary-500 border-t-transparent', 'h-12 w-12 border-4')} />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
