import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Clock, Zap, AlertTriangle } from 'lucide-react';
import type { TradingSignal } from '../types';

interface SignalCardProps {
  signal: TradingSignal;
}

const ImpactBadge = ({ impact }: { impact: 'high' | 'medium' | 'low' }) => {
  const colors = {
    high: 'bg-red-500/20 text-red-300 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-300 border-green-500/30'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[impact]}`}>
      {impact.toUpperCase()}
    </span>
  );
};

const StrengthIndicator = ({ strength }: { strength: number }) => {
  const getColor = (value: number) => {
    if (value >= 80) return 'bg-green-400';
    if (value >= 60) return 'bg-blue-400';
    if (value >= 40) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-blue-300">
        <span>Signal Strength</span>
        <span>{strength}%</span>
      </div>
      <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(strength)}`}
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  );
};

export default function SignalCard({ signal }: SignalCardProps) {
  return (
    <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/30 p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {signal.type === 'buy' ? (
            <ArrowUpCircle className="text-green-400" size={24} />
          ) : (
            <ArrowDownCircle className="text-red-400" size={24} />
          )}
          <div>
            <h4 className="text-lg font-bold text-blue-100">{signal.pair}</h4>
            <div className="flex items-center space-x-2 mt-1">
              {signal.timeframe === 'scalping' ? (
                <Zap className="text-blue-300" size={16} />
              ) : (
                <Clock className="text-blue-300" size={16} />
              )}
              <span className="text-sm text-blue-300 capitalize">{signal.timeframe}</span>
            </div>
          </div>
        </div>
        <ImpactBadge impact={signal.impact} />
      </div>

      <StrengthIndicator strength={signal.strength} />

      <div className="mt-6 space-y-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="text-blue-300 mt-1 flex-shrink-0" size={16} />
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-blue-200">Key Reasons:</h5>
            <ul className="space-y-2">
              {signal.reasons.map((reason, index) => (
                <li key={index} className="text-sm text-blue-100 leading-relaxed">
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}