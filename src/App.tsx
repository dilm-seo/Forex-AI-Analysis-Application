import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import NewsCard from './components/NewsCard';
import AnalysisCard from './components/AnalysisCard';
import SettingsModal from './components/SettingsModal';
import CurrencyStrengthMeter from './components/CurrencyStrengthMeter';
import CurrencyCorrelations from './components/CurrencyCorrelations';
import CompassCard from './components/CompassCard';
import TechnicalIndicators from './components/TechnicalIndicators';
import KeyLevels from './components/KeyLevels';
import MarketSentiment from './components/MarketSentiment';
import { loadSettings } from './utils/storage';
import type { NewsItem, Analysis, Settings as SettingsType } from './types';

export default function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [settings, setSettings] = useState<SettingsType>(loadSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const fetchNews = async () => {
    try {
      const response = await axios.get(settings.feedUrl);
      const parser = new DOMParser();
      const xml = parser.parseFromString(response.data, 'text/xml');
      const items = xml.querySelectorAll('item');
      
      const newsItems: NewsItem[] = Array.from(items).map((item) => ({
        title: item.querySelector('title')?.textContent || '',
        description: item.querySelector('description')?.textContent || '',
        pubDate: item.querySelector('pubDate')?.textContent || '',
        link: item.querySelector('link')?.textContent || '',
      }));
      
      setNews(newsItems);
    } catch (error) {
      toast.error('Échec du chargement des actualités');
    }
  };

  const analyzeNews = async () => {
    if (!settings.apiKey) {
      toast.error('Veuillez configurer votre clé API OpenAI');
      setShowSettings(true);
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: settings.model,
          messages: [
            {
              role: 'system',
              content: `Vous êtes un analyste forex professionnel. Analysez les actualités suivantes et fournissez:
              1. Un résumé du marché
              2. Une analyse de la force des devises majeures (USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD) avec pourcentage de force (0-100) et tendance (up/down/neutral)
              3. Une opportunité de scalping avec raisonnement détaillé
              4. Une opportunité de day trading avec raisonnement détaillé
              5. Les corrélations entre les devises les plus fortes et les plus faibles avec explications
              6. Les niveaux clés de support et résistance
              7. Les indicateurs techniques principaux
              8. Le sentiment général du marché
              
              Formatez la réponse en JSON:
              {
                "summary": "Aperçu du marché...",
                "currencies": [
                  {
                    "currency": "USD",
                    "strength": 75,
                    "trend": "up"
                  }
                ],
                "scalping": "Analyse détaillée pour le scalping...",
                "dayTrading": "Analyse détaillée pour le day trading...",
                "correlations": [
                  {
                    "pair": "EUR/USD",
                    "correlation": 0.85,
                    "explanation": "Forte corrélation négative due à..."
                  }
                ],
                "keyLevels": [
                  {
                    "pair": "EUR/USD",
                    "support": [1.0750, 1.0720],
                    "resistance": [1.0850, 1.0880]
                  }
                ],
                "technicalIndicators": [
                  {
                    "pair": "EUR/USD",
                    "indicators": [
                      {
                        "name": "RSI",
                        "value": 65,
                        "signal": "buy"
                      }
                    ]
                  }
                ],
                "marketSentiment": {
                  "overall": "bullish",
                  "confidence": 75,
                  "factors": [
                    "Forte croissance économique",
                    "Politique monétaire accommodante"
                  ]
                }
              }`
            },
            {
              role: 'user',
              content: JSON.stringify(news.slice(0, settings.newsCount))
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${settings.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = JSON.parse(response.data.choices[0].message.content);
      setAnalysis(result);
    } catch (error) {
      toast.error('L\'analyse a échoué. Vérifiez votre clé API.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [settings.feedUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Forex AI Analyzer
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Settings size={24} />
              </button>
              <button
                onClick={analyzeNews}
                disabled={isAnalyzing}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <RefreshCw size={20} className={`mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                Analyser le Feed
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {analysis && (
          <>
            <AnalysisCard analysis={analysis} />
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Force des Devises</h2>
              <CurrencyStrengthMeter currencies={analysis.currencies} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CompassCard currencies={analysis.currencies} />
              <MarketSentiment sentiment={analysis.marketSentiment!} />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Corrélations</h2>
              <CurrencyCorrelations correlations={analysis.correlations} />
            </div>

            <KeyLevels levels={analysis.keyLevels!} />
            <TechnicalIndicators indicators={analysis.technicalIndicators!} />
          </>
        )}
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Dernières Actualités</h2>
          {news.slice(0, settings.newsCount).map((item, index) => (
            <NewsCard
              key={index}
              news={item}
              isAnalyzing={isAnalyzing}
            />
          ))}
        </div>
      </main>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={setSettings}
      />
      
      <Toaster position="top-right" />
    </div>
  );
}