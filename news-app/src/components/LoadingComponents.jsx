import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

export const LoadingSpinner = ({ size = 'md', color = 'cyan' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  const colorClasses = {
    cyan: 'text-cyan-400',
    blue: 'text-blue-500',
    gray: 'text-zinc-400',
    white: 'text-white',
  };

  return (
    <div className="flex justify-center items-center">
      <Loader2
        className={`animate-spin ${sizeClasses[size] || sizeClasses.md} ${
          colorClasses[color] || colorClasses.cyan
        }`}
      />
    </div>
  );
};

export const SkeletonCard = () => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`rounded-xl overflow-hidden w-full border animate-pulse ${
        isDarkMode ? 'bg-zinc-900/70 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
      }`}
    >
      <div className={`w-full h-36 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
      <div className="p-4 space-y-2.5">
        <div className={`h-3.5 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
        <div className={`h-3.5 w-3/4 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
        <div className={`h-2.5 w-1/2 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
      </div>
    </div>
  );
};

export const SkeletonList = ({ count = 4 }) => (
  <div className="grid grid-cols-1 gap-3.5 p-4">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

export const ChartSkeleton = () => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`animate-pulse p-5 rounded-2xl border ${
        isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
      }`}
    >
      <div className={`h-5 w-1/3 mb-4 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={`h-14 rounded-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
        <div className={`h-14 rounded-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
        <div className={`h-14 rounded-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
      </div>
      <div className={`h-64 w-full rounded-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
    </div>
  );
};

export const ErrorMessage = ({ message, onRetry }) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`p-6 rounded-2xl text-center border ${
        isDarkMode
          ? 'bg-red-500/10 border-red-500/30 text-red-200'
          : 'bg-red-50 border-red-200 text-red-900'
      }`}
    >
      <AlertTriangle className="w-8 h-8 mx-auto mb-2.5 text-red-500" />
      <h3 className="text-sm font-bold uppercase tracking-wider font-mono mb-1">
        Telemetry Feed Interrupted
      </h3>
      <p className="text-xs opacity-80 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors bg-red-600 hover:bg-red-500 text-white cursor-pointer"
        >
          Retry Feed Sync
        </button>
      )}
    </div>
  );
};
