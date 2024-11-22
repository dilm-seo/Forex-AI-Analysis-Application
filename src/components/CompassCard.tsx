import React from 'react';
import { Compass, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
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

function generateTradingOpportunities(currencies: CurrencyStrength[]): TradingOpportunity[] {
  const sortedByStrength = [...currencies].sort((a, b) => b.strength - a.strength);
  const strongest = sortedByStrength[0];
  const weakest = sortedByStrength[sortedByStrength.length - 1];
  
  const opportunities: TradingOpportunity[] = [];
  
  if (strongest.trend === 'up' && weakest.trend === 'down') {
    opportunities.push({
      pair: `${strongest.currency}/${weakest.currency}`,
      type: 'buy',
      strength: Math.round((strongest.strength + (100 - weakest.strength)) / 2),
      reasoning: `${strongest.currency} montre une forte tendance haussière (${strongest.strength}%) tandis que ${weakest.currency} est en tendance baissière (${weakest.strength}%)`
    });
  }
  
  // Chercher d'autres opportunités parmi les devises fortes/faibles
  for (let i = 0; i < 2 && i < sortedByStrength.length - 1; i++) {
    const strong = sortedByStrength[i];
    const weak = sortedByStrength[sortedByStrength.length - 1 - i];
    
    if (strong.currency !== strongest.currency && weak.currency !== weakest.currency) {
      if (strong.strength - weak.strength > 30) {
        opportunities.push({
          pair: `${strong.currency}/${weak.currency}`,
          type: strong.trend === 'up' ? 'buy' : 'sell',
          strength: Math.round((strong.strength + (100 - weak.strength)) / 2),
          reasoning: `Divergence de force significative: ${strong.currency} (${strong.strength}%) vs ${weak.currency} (${weak.strength}%)`
        });
      }
    }
  }
  
  return opportunities.sort((a, b) => b.strength - a.strength);
}

export default function CompassCard({ currencies }: CompassCardProps) {
  const opportunities = generateTradingOpportunities(currencies);
  
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <Compass className="text-blue-200" size={28} />
        <h2 className="text-xl font-bold text-white">Boussole de Trading</h2>
      </div>
      
      {opportunities.length > 0 ? (
        <div className="space-y-4">
          {opportunities.map((opportunity, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {opportunity.type === 'buy' ? (
                    <TrendingUp className="text-green-400" size={24} />
                  ) : (
                    <TrendingDown className="text-red-400" size={24} />
                  )}
                  <div>
                    <h3 className="text-lg font-mono font-bold text-white">
                      {opportunity.pair}
                    </h3>
                    <span className="text-sm text-blue-200">
                      {opportunity.type === 'buy' ? 'Achat' : 'Vente'} • Force: {opportunity.strength}%
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  opportunity.strength >= 70 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                  opportunity.strength >= 50 ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                } border`}>
                  {opportunity.strength}%
                </div>
              </div>
              
              <div className="flex items-start space-x-2 text-sm text-blue-200">
                <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
                <p>{opportunity.reasoning}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-blue-200">Aucune opportunité significative détectée pour le moment</p>
        </div>
      )}
    </div>
  );
}