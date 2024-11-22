import React from 'react';

interface ProgressBarProps {
  progress: number;
  message: string;
}

export default function ProgressBar({ progress, message }: ProgressBarProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-md m-4 relative border border-gray-200 shadow-xl">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
              </div>
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  className="text-gray-200"
                  strokeWidth="5"
                  stroke="currentColor"
                  fill="transparent"
                  r="30"
                  cx="32"
                  cy="32"
                />
                <circle
                  className="text-blue-600"
                  strokeWidth="5"
                  strokeDasharray={30 * 2 * Math.PI}
                  strokeDashoffset={30 * 2 * Math.PI * (1 - progress / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="30"
                  cx="32"
                  cy="32"
                />
              </svg>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-center font-medium text-gray-800">
              {message}
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-500">
            Veuillez patienter pendant l'analyse du marché...
          </p>
        </div>
      </div>
    </div>
  );
}