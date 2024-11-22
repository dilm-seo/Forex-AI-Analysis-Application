import React from 'react';
import { BarChart2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MarketSentiment as MarketSentimentType } from '../types';

interface MarketSentimentProps {
  sentiment: MarketSentimentType;
}

const sentimentConfig = {
  'risk-on': {
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    label: 'Risk On'
  },
  'risk-off': {
    icon: TrendingDown,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    label: 'Risk Off'
  },
  'neutral': {
    icon: Minus,
    color: 'text-gray-400',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    label: 'Neutre'
  }
};

export default function MarketSentiment({ sentiment }: MarketSentimentProps) {
  if (!sentiment) return null;

  const config = sentimentConfig[sentiment.overall];
  const Icon = config.icon;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <BarChart2 className="text-blue-500" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Sentiment du Marché</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className={config.color} size={24} />
            <span className="text-lg font-medium">
              {config.label}
            </span>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
            Confiance: {sentiment.confidence}%
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Facteurs Clés</h3>
          <ul className="space-y-2">
            {sentiment.drivers.map((driver, index) => (
              <li key={index} className="flex items-start space-x-2 text-gray-600">
                <span className="text-blue-500 mt-1">•</span>
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Indice de Confiance</span>
            <span className="font-medium">{sentiment.confidence}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                sentiment.confidence >= 70 ? 'bg-green-500' :
                sentiment.confidence >= 50 ? 'bg-blue-500' :
                sentiment.confidence >= 30 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${sentiment.confidence}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}