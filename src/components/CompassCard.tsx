import React, { useState, useEffect } from 'react';
import { Compass, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
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
  const [opportunities, setOpportunities] = useState<TradingOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const apiKey = localStorage.getItem('forex-analyzer-settings') 
    ? JSON.parse(localStorage.getItem('forex-analyzer-settings')!).apiKey 
    : '';

  useEffect(() => {
    const generateOpportunities = async () => {
      const sortedByStrength = [...currencies].sort((a, b) => b.strength - a.strength);
      const strongest = sortedByStrength[0];
      const weakest = sortedByStrength[sortedByStrength.length - 1];
      
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4-turbo-preview',
            messages: [
              {
                role: 'system',
                content: `Vous êtes un analyste forex professionnel. Analysez les paires de devises et fournissez une analyse détaillée en HTML avec la structure suivante:

                <div class="analysis">
                  <div class="section">
                    <h3>Analyse Fondamentale</h3>
                    <ul>
                      <li>[Point fondamental 1]</li>
                      <li>[Point fondamental 2]</li>
                    </ul>
                  </div>
                  
                  <div class="section">
                    <h3>Analyse Technique</h3>
                    <ul>
                      <li>[Point technique 1]</li>
                      <li>[Point technique 2]</li>
                    </ul>
                  </div>
                  
                  <div class="section">
                    <h3>Catalyseurs Potentiels</h3>
                    <ul>
                      <li>[Catalyseur 1]</li>
                      <li>[Catalyseur 2]</li>
                    </ul>
                  </div>
                  
                  <div class="section">
                    <h3>Recommandation</h3>
                    <p>[Votre recommandation détaillée]</p>
                  </div>
                </div>`
              },
              {
                role: 'user',
                content: `Analysez l'opportunité de trading pour:
                Devise la plus forte: ${strongest.currency} (Force: ${strongest.strength}%, Tendance: ${strongest.trend})
                Devise la plus faible: ${weakest.currency} (Force: ${weakest.strength}%, Tendance: ${weakest.trend})`
              }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const analysis = response.data.choices[0].message.content;
        
        const newOpportunities: TradingOpportunity[] = [];
        
        if (strongest.trend === 'up' && weakest.trend === 'down') {
          newOpportunities.push({
            pair: `${strongest.currency}/${weakest.currency}`,
            type: 'buy',
            strength: Math.round((strongest.strength + (100 - weakest.strength)) / 2),
            reasoning: analysis
          });
        }
        
        // Analyser d'autres opportunités potentielles
        for (let i = 0; i < 2 && i < sortedByStrength.length - 1; i++) {
          const strong = sortedByStrength[i];
          const weak = sortedByStrength[sortedByStrength.length - 1 - i];
          
          if (strong.currency !== strongest.currency && weak.currency !== weakest.currency) {
            if (strong.strength - weak.strength > 30) {
              const pairResponse = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                  model: 'gpt-4-turbo-preview',
                  messages: [
                    {
                      role: 'system',
                      content: `Vous êtes un analyste forex professionnel. Analysez la paire de devises et fournissez une analyse détaillée en HTML avec la structure suivante:

                      <div class="analysis">
                        <div class="section">
                          <h3>Analyse Fondamentale</h3>
                          <ul>
                            <li>[Point fondamental 1]</li>
                            <li>[Point fondamental 2]</li>
                          </ul>
                        </div>
                        
                        <div class="section">
                          <h3>Analyse Technique</h3>
                          <ul>
                            <li>[Point technique 1]</li>
                            <li>[Point technique 2]</li>
                          </ul>
                        </div>
                        
                        <div class="section">
                          <h3>Catalyseurs Potentiels</h3>
                          <ul>
                            <li>[Catalyseur 1]</li>
                            <li>[Catalyseur 2]</li>
                          </ul>
                        </div>
                        
                        <div class="section">
                          <h3>Recommandation</h3>
                          <p>[Votre recommandation détaillée]</p>
                        </div>
                      </div>`
                    },
                    {
                      role: 'user',
                      content: `Analysez l'opportunité de trading pour:
                      ${strong.currency} (Force: ${strong.strength}%, Tendance: ${strong.trend}) vs
                      ${weak.currency} (Force: ${weak.strength}%, Tendance: ${weak.trend})`
                    }
                  ]
                },
                {
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                  }
                }
              );

              newOpportunities.push({
                pair: `${strong.currency}/${weak.currency}`,
                type: strong.trend === 'up' ? 'buy' : 'sell',
                strength: Math.round((strong.strength + (100 - weak.strength)) / 2),
                reasoning: pairResponse.data.choices[0].message.content
              });
            }
          }
        }
        
        setOpportunities(newOpportunities.sort((a, b) => b.strength - a.strength));
      } catch (error) {
        toast.error('Échec de l\'analyse des opportunités');
      } finally {
        setIsLoading(false);
      }
    };

    if (apiKey) {
      generateOpportunities();
    } else {
      setIsLoading(false);
    }
  }, [currencies, apiKey]);
  
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <Compass className="text-blue-200" size={28} />
        <h2 className="text-xl font-bold text-white">Boussole de Trading</h2>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-200"></div>
        </div>
      ) : opportunities.length > 0 ? (
        <div className="space-y-6">
          {opportunities.map((opportunity, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
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
              
              <div className="prose prose-invert max-w-none">
                <div 
                  className="text-blue-200"
                  dangerouslySetInnerHTML={{ __html: opportunity.reasoning }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-blue-200">
            {apiKey ? 'Aucune opportunité significative détectée pour le moment' : 'Veuillez configurer votre clé API OpenAI'}
          </p>
        </div>
      )}
    </div>
  );
}