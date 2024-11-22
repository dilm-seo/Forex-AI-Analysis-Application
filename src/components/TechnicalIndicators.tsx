import React from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TechnicalIndicatorsProps {
  indicators: {
    pair: string;
    indicators: {
      name: string;
      value: number;
      signal: 'buy' | 'sell' | 'neutral';
    }[];
  }[];
}

export default function TechnicalIndicators({ indicators }: TechnicalIndicatorsProps) {
  if (!indicators?.length) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="text-blue-500" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Indicateurs Techniques</h2>
      </div>

      <div className="grid gap-6">
        {indicators.map((item, index) => (
          <div key={index} className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
            <h3 className="text-lg font-mono font-semibold text-gray-800 mb-4">{item.pair}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {item.indicators.map((indicator, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">{indicator.name}</span>
                    {indicator.signal === 'buy' && <TrendingUp className="text-green-500" size={20} />}
                    {indicator.signal === 'sell' && <TrendingDown className="text-red-500" size={20} />}
                    {indicator.signal === 'neutral' && <Minus className="text-gray-400" size={20} />}
                  </div>
                  <div className="text-sm text-gray-500">
                    Valeur: {indicator.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}