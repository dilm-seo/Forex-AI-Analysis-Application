import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
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

interface CurrencyAnalysisModalProps {
  currency: CurrencyStrength;
  onClose: () => void;
  apiKey: string;
}

function CurrencyAnalysisModal({ currency, onClose, apiKey }: CurrencyAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const analyzeCurrency = async () => {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4-turbo-preview',
            messages: [
              {
                role: 'system',
                content: `Vous êtes un analyste forex professionnel. Analysez la force de la devise suivante et fournissez une explication détaillée du sentiment actuel du marché, des facteurs clés et des risques potentiels. Gardez la réponse concise mais informative. Formatez la réponse en HTML avec la structure suivante:

                <div class="analysis">
                  <div class="section">
                    <h3>Sentiment du Marché</h3>
                    <p>[Votre analyse du sentiment actuel]</p>
                  </div>
                  
                  <div class="section">
                    <h3>Facteurs Clés</h3>
                    <ul>
                      <li>[Facteur 1]</li>
                      <li>[Facteur 2]</li>
                      <li>[Facteur 3]</li>
                    </ul>
                  </div>
                  
                  <div class="section">
                    <h3>Risques Potentiels</h3>
                    <ul>
                      <li>[Risque 1]</li>
                      <li>[Risque 2]</li>
                    </ul>
                  </div>
                  
                  <div class="section">
                    <h3>Conclusion</h3>
                    <p>[Votre conclusion et recommandation]</p>
                  </div>
                </div>`
              },
              {
                role: 'user',
                content: `Analysez ${currency.currency} avec une force de ${currency.strength}% et une tendance ${currency.trend}`
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

        setAnalysis(response.data.choices[0].message.content);
      } catch (error) {
        toast.error('Échec de l\'analyse de la devise');
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    analyzeCurrency();
  }, [currency, apiKey]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-2xl m-4 relative border border-gray-200 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <span className="text-4xl">{CURRENCY_FLAGS[currency.currency]}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Analyse {currency.currency}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                currency.trend === 'up' ? 'bg-green-100 text-green-800' :
                currency.trend === 'down' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {currency.trend === 'up' && <TrendingUp size={16} className="mr-1" />}
                {currency.trend === 'down' && <TrendingDown size={16} className="mr-1" />}
                {currency.trend === 'neutral' && <Minus size={16} className="mr-1" />}
                {currency.trend === 'up' ? 'Haussier' : currency.trend === 'down' ? 'Baissier' : 'Neutre'}
              </span>
              <span className="text-sm text-gray-500">
                Force: {currency.strength}%
              </span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="prose prose-blue max-w-none">
            <div 
              className="bg-blue-50/50 rounded-xl p-6 border border-blue-100"
              dangerouslySetInnerHTML={{ __html: analysis }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CurrencyStrengthMeter({ currencies }: CurrencyStrengthMeterProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyStrength | null>(null);
  const apiKey = localStorage.getItem('forex-analyzer-settings') 
    ? JSON.parse(localStorage.getItem('forex-analyzer-settings')!).apiKey 
    : '';

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currencies.map((currency) => (
          <button
            key={currency.currency}
            onClick={() => setSelectedCurrency(currency)}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-md hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{CURRENCY_FLAGS[currency.currency]}</span>
                <span className="font-mono font-bold text-gray-800">{currency.currency}</span>
              </div>
              {currency.trend === 'up' && <TrendingUp className="text-green-500" size={20} />}
              {currency.trend === 'down' && <TrendingDown className="text-red-500" size={20} />}
              {currency.trend === 'neutral' && <Minus className="text-gray-400" size={20} />}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Force</span>
                <span className="font-medium">{currency.strength}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currency.strength >= 70 ? 'bg-green-500' :
                    currency.strength >= 50 ? 'bg-blue-500' :
                    currency.strength >= 30 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${currency.strength}%` }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedCurrency && (
        <CurrencyAnalysisModal
          currency={selectedCurrency}
          onClose={() => setSelectedCurrency(null)}
          apiKey={apiKey}
        />
      )}
    </>
  );
}