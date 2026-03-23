import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    blue: 'text-blue-600',
    gray: 'text-gray-400',
    white: 'text-white',
  };

  return (
    <div className="flex justify-center items-center">
      <Loader2 className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} />
    </div>
  );
};

export const SkeletonCard = ({ isDarkMode }) => (
  <div className={`rounded-lg overflow-hidden w-[300px] animate-pulse ${
    isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
  }`}>
    <div className={`w-full h-[180px] ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
    <div className="p-4 space-y-3">
      <div className={`h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
      <div className={`h-4 w-3/4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
      <div className={`h-3 w-1/2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
    </div>
  </div>
);

export const SkeletonList = ({ count = 3, isDarkMode }) => (
  <div className="flex flex-wrap gap-5 p-5 justify-center">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} isDarkMode={isDarkMode} />
    ))}
  </div>
);

export const ChartSkeleton = ({ isDarkMode }) => (
  <div className={`animate-pulse p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
    <div className={`h-6 w-1/3 mb-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
    <div className={`h-64 w-full rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
  </div>
);

export const ErrorMessage = ({ message, onRetry, isDarkMode }) => (
  <div className={`p-6 rounded-xl text-center border shadow-sm ${
    isDarkMode ? 'bg-red-900/10 border-red-500/20' : 'bg-red-50 border-red-100'
  }`}>
    <AlertTriangle className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>
      Something went wrong
    </h3>
    <p className={`mb-4 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
      {message}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          isDarkMode 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        Try Again
      </button>
    )}
  </div>
);