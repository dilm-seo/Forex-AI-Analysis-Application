import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { CurrencyStrength } from '../types';

interface CurrencyStrengthMeterProps {
  currencies: CurrencyStrength[];
}

const CURRENCY_FLAGS: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  CHF: '🇨🇭',
  NZD: '🇳🇿'
};

export default function CurrencyStrengthMeter({ currencies }: CurrencyStrengthMeterProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {currencies.map(({ currency, strength, trend }) => (
        <div
          key={currency}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{CURRENCY_FLAGS[currency]}</span>
              <span className="font-mono font-bold text-gray-800">{currency}</span>
            </div>
            {trend === 'up' && <TrendingUp className="text-green-500" size={20} />}
            {trend === 'down' && <TrendingDown className="text-red-500" size={20} />}
            {trend === 'neutral' && <Minus className="text-gray-400" size={20} />}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Strength</span>
              <span className="font-medium">{strength}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  strength >= 70 ? 'bg-green-500' :
                  strength >= 50 ? 'bg-blue-500' :
                  strength >= 30 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}