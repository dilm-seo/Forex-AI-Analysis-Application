import React, { useState } from 'react';
import { Compass, TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronUp, Target } from 'lucide-react';
import type { CurrencyStrength } from '../types';

interface CompassCardProps {
  currencies: CurrencyStrength[];
}

interface TradingOpportunity {
  pair: string;
  type: 'buy' | 'sell';
  strength: number;
  reasoning: string;
}

export default function CompassCard({ currencies }: CompassCardProps) {
  const [expandedOpportunity, setExpandedOpportunity] = useState<number | null>(null);

  // Generate trading opportunities based on currency strengths
  const opportunities: TradingOpportunity[] = currencies
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 3)
    .map((currency) => ({
      pair: `${currency.currency}/USD`,
      type: currency.trend === 'up' ? 'buy' : 'sell',
      strength: currency.strength,
      reasoning: `Strong ${currency.trend === 'up' ? 'bullish' : 'bearish'} momentum detected for ${currency.currency} with ${currency.strength}% strength indicator.`
    }));

  return (
    <div className="relative overflow-hidden">
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900 rounded-2xl p-6 shadow-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Compass className="text-blue-200 h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Trading Compass</h2>
              <p className="text-blue-200 text-sm mt-1">AI-Detected Opportunities</p>
            </div>
          </div>
          
          <div className="grid gap-4">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => setExpandedOpportunity(expandedOpportunity === index ? null : index)}
                  className="w-full"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all group-hover:border-white/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${
                          opportunity.type === 'buy' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {opportunity.type === 'buy' ? (
                            <TrendingUp className="h-6 w-6" />
                          ) : (
                            <TrendingDown className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-mono font-bold text-white group-hover:text-blue-200 transition-colors">
                            {opportunity.pair}
                          </h3>
                          <div className="flex items-center space-x-2 mt-2">
                            <Target className="h-4 w-4 text-blue-300" />
                            <span className="text-sm text-blue-200">
                              {opportunity.type === 'buy' ? 'Long Position' : 'Short Position'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-200">
                            Signal Strength
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {opportunity.strength}%
                          </div>
                        </div>
                        {expandedOpportunity === index ? (
                          <ChevronUp className="text-blue-200 h-5 w-5" />
                        ) : (
                          <ChevronDown className="text-blue-200 h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
                
                {expandedOpportunity === index && (
                  <div className="mt-2 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="text-yellow-300 h-5 w-5 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-200 mb-2">
                            Key Analysis Points
                          </h4>
                          <p className="text-blue-100 leading-relaxed">
                            {opportunity.reasoning}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="text-yellow-300 h-4 w-4" />
                          <span className="text-sm text-yellow-200">
                            This analysis is AI-generated. Always validate with your own analysis.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}