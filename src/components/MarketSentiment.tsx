import React from 'react';
import { BarChart2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketSentimentProps {
  sentiment: {
    overall: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    factors: string[];
  };
}

export default function MarketSentiment({ sentiment }: MarketSentimentProps) {
  if (!sentiment) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <BarChart2 className="text-blue-500" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Market Sentiment</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {sentiment.overall === 'bullish' && <TrendingUp className="text-green-500" size={24} />}
            {sentiment.overall === 'bearish' && <TrendingDown className="text-red-500" size={24} />}
            {sentiment.overall === 'neutral' && <Minus className="text-gray-400" size={24} />}
            <span className="text-lg font-medium capitalize">
              {sentiment.overall}
            </span>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            sentiment.confidence >= 70 ? 'bg-green-100 text-green-800' :
            sentiment.confidence >= 40 ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            Confidence: {sentiment.confidence}%
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Key Factors</h3>
          <ul className="space-y-2">
            {sentiment.factors.map((factor, index) => (
              <li key={index} className="flex items-start space-x-2 text-gray-600">
                <span className="text-blue-500 mt-1">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}