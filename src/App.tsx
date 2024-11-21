import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import NewsCard from './components/NewsCard';
import AnalysisCard from './components/AnalysisCard';
import SettingsModal from './components/SettingsModal';
import { loadSettings } from './utils/storage';
import type { NewsItem, Analysis, Settings as SettingsType, TradingSignal } from './types';

function App() {
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
      toast.error('Failed to fetch news');
    }
  };

  const analyzeNews = async () => {
    if (!settings.apiKey) {
      toast.error('Please set your OpenAI API key first');
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
              content: `Vous êtes un analyste professionnel en forex. Analysez les actualités suivantes et fournissez une réponse au format JSON comprenant :

Résumé du marché – Décrivez la situation actuelle des marchés financiers en mettant l'accent sur les mouvements macroéconomiques, les nouvelles économiques majeures et les principaux facteurs influençant le sentiment du marché. Précisez l'impact de ces facteurs sur les principales devises concernées.

Analyse des paires de devises – Identifiez les principales paires de devises affectées par ces actualités et analysez leur sentiment (haussier, baissier ou neutre). Veillez à spécifier clairement l'impact sur chaque devise : par exemple, une baisse de USD/JPY signifie une baisse du dollar américain et une hausse du yen japonais. Précisez les raisons économiques, politiques ou géopolitiques qui soutiennent chaque sentiment.

Signaux de trading avec justification détaillée – Fournissez des signaux de trading clairs (achat/vente/attente) pour les paires de devises analysées, accompagnés d'une justification détaillée expliquant les raisons de chaque recommandation, en prenant en compte l'analyse fondamentale et les réactions potentielles du marché.

Concentrez-vous sur les implications des actualités sur les devises et sur les mouvements des marchés financiers. Répondez en français, au format suivant :
              {
                "summary": "Brief market overview",
                "currencies": [
                  {
                    "pair": "here",
                    "sentiment": "here",
                    "strength": 0-100
                  }
                ],
                "signals": [
                  {
                    "pair": "EUR/USD",
                    "type": "buy|sell",
                    "timeframe": "scalping|day",
                    "strength": 0-100,
                    "impact": "high|medium|low",
                    "reasons": ["reason1", "reason2"]
                  }
                ]
              }
              Respond in ${settings.language}.`
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
      toast.error('Analysis failed. Please check your API key.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [settings.feedUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900">
      <nav className="bg-blue-900/80 backdrop-blur-md shadow-lg sticky top-0 z-10 border-b border-blue-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">
              Forex AI Analyzer
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-blue-300 hover:text-blue-100 transition-colors"
              >
                <Settings size={24} />
              </button>
              <button
                onClick={analyzeNews}
                disabled={isAnalyzing}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl hover:from-blue-500 hover:to-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <RefreshCw size={20} className={`mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                Analyze Feed
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {analysis && <AnalysisCard analysis={analysis} />}
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-blue-100">Latest News</h2>
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
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e3a8a',
            color: '#fff',
            border: '1px solid rgba(59, 130, 246, 0.5)'
          }
        }}
      />
    </div>
  );
}

export default App;
