import React from 'react';
import { TrendingUp, BarChart, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import type { Analysis } from '../types';
import SignalCard from './SignalCard';

interface AnalysisCardProps {
  analysis: Analysis;
}

const SentimentIcon = ({ sentiment }: { sentiment: string }) => {
  switch (sentiment) {
    case 'bullish':
      return <ArrowUp className="text-green-400" size={20} />;
    case 'bearish':
      return <ArrowDown className="text-red-400" size={20} />;
    default:
      return <Minus className="text-gray-400" size={20} />;
  }
};

const StrengthBar = ({ strength }: { strength: number }) => {
  return (
    <div className="w-24 h-2 bg-blue-950 rounded-full overflow-hidden">
      <div 
        className="h-full bg-blue-400 rounded-full transition-all duration-500"
        style={{ width: `${strength}%` }}
      />
    </div>
  );
};

export default function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <div className="bg-blue-900/95 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50 shadow-lg text-white">
      <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">
        AI Market Analysis
      </h3>
      
      <div className="space-y-8">
        <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700/30">
          <div className="flex items-center mb-3">
            <BarChart className="text-blue-300 mr-3" size={24} />
            <h4 className="text-lg font-semibold text-blue-100">Market Summary</h4>
          </div>
          <p className="text-blue-100 leading-relaxed">{analysis.summary}</p>
        </div>

        <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700/30">
          <h4 className="text-lg font-semibold text-blue-100 mb-4">Currency Pairs Analysis</h4>
          <div className="grid gap-4">
            {analysis.currencies.map((currency, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-blue-950/50 rounded-lg border border-blue-800/30"
              >
                <div className="flex items-center space-x-4">
                  <SentimentIcon sentiment={currency.sentiment} />
                  <span className="text-lg font-mono text-blue-100">{currency.pair}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-300">Strength</span>
                  <StrengthBar strength={currency.strength} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-4">
            <TrendingUp className="text-blue-300 mr-3" size={24} />
            <h4 className="text-lg font-semibold text-blue-100">Trading Signals</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.signals.map((signal, index) => (
              <SignalCard key={index} signal={signal} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}