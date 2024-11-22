import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import type { CurrencyCorrelation } from '../types';

interface CurrencyCorrelationsProps {
  correlations: CurrencyCorrelation[];
}

export default function CurrencyCorrelations({ correlations }: CurrencyCorrelationsProps) {
  return (
    <div className="grid gap-4">
      {correlations.map((correlation, index) => (
        <div
          key={index}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex items-start space-x-4">
            <ArrowRightLeft 
              className={`mt-1 flex-shrink-0 ${
                Math.abs(correlation.correlation) > 0.7 
                  ? 'text-purple-500' 
                  : Math.abs(correlation.correlation) > 0.5 
                    ? 'text-blue-500' 
                    : 'text-gray-400'
              }`}
              size={24} 
            />
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-mono font-semibold text-gray-800">
                  {correlation.pair}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  Math.abs(correlation.correlation) > 0.7 
                    ? 'bg-purple-100 text-purple-700' 
                    : Math.abs(correlation.correlation) > 0.5 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  {(correlation.correlation * 100).toFixed(1)}% Correlation
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {correlation.explanation}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}