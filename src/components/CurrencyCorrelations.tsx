import React from 'react';
import { ArrowRightLeft, TrendingUp, TrendingDown } from 'lucide-react';
import type { CurrencyCorrelation } from '../types';

interface CurrencyCorrelationsProps {
  correlations: CurrencyCorrelation[];
}

const strengthColors = {
  forte: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200'
  },
  moyenne: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  faible: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200'
  }
};

export default function CurrencyCorrelations({ correlations }: CurrencyCorrelationsProps) {
  if (!correlations?.length) {
    return null;
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-3">
        <ArrowRightLeft className="text-blue-500" size={24} />
        <span>Corrélations</span>
      </h2>

      <div className="space-y-4">
        {correlations.map((correlation, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 border ${
              strengthColors[correlation.strength].border
            } hover:shadow-md transition-all`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-mono font-semibold text-gray-800">
                  {correlation.pair}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    strengthColors[correlation.strength].bg
                  } ${strengthColors[correlation.strength].text}`}>
                    Corrélation {correlation.strength}
                  </span>
                  <span className="text-sm text-gray-500">
                    {correlation.period === '1j' ? '1 Jour' :
                     correlation.period === '1s' ? '1 Semaine' : '1 Mois'}
                  </span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                correlation.correlation > 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {Math.abs(correlation.correlation * 100).toFixed(1)}%
                {correlation.correlation > 0 
                  ? <TrendingUp className="inline ml-1" size={16} />
                  : <TrendingDown className="inline ml-1" size={16} />
                }
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Explication</h4>
                <p className="text-gray-600">{correlation.explanation}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Facteurs Fondamentaux</h4>
                <div className="grid gap-2">
                  {correlation.fundamentalDrivers.map((driver, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-600"
                    >
                      {driver}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Force de la Corrélation</span>
                  <span className="font-medium text-gray-700">
                    {Math.abs(correlation.correlation * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      Math.abs(correlation.correlation) > 0.7 
                        ? 'bg-purple-500'
                        : Math.abs(correlation.correlation) > 0.5
                        ? 'bg-blue-500'
                        : 'bg-gray-400'
                    }`}
                    style={{ width: `${Math.abs(correlation.correlation * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}