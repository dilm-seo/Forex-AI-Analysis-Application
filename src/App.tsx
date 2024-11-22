import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import NewsCard from './components/NewsCard';
import AnalysisCard from './components/AnalysisCard';
import SettingsModal from './components/SettingsModal';
import CurrencyStrengthMeter from './components/CurrencyStrengthMeter';
import CurrencyCorrelations from './components/CurrencyCorrelations';
import { loadSettings } from './utils/storage';
import type { NewsItem, Analysis, Settings as SettingsType } from './types';

function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [settings, setSettings] = useState<SettingsType>(loadSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const fetchNews = async () => {
    try {
      const response = await axios.get('https://www.forexlive.com/feed/news/');
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
              content: `You are a professional forex analyst. Analyze the following news and provide:
              1. A market summary
              2. Currency strength analysis for major currencies (USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD) with strength percentage (0-100) and trend (up/down/neutral)
              3. Scalping opportunity with detailed reasoning
              4. Day trading opportunity with detailed reasoning
              5. Currency correlations between strongest and weakest currencies with explanations
              
              Format the response as JSON:
              {
                "summary": "Market overview...",
                "currencies": [
                  {
                    "currency": "USD",
                    "strength": 75,
                    "trend": "up"
                  },
                  ...
                ],
                "scalping": "Detailed scalping analysis...",
                "dayTrading": "Detailed day trading analysis...",
                "correlations": [
                  {
                    "pair": "EUR/USD",
                    "correlation": 0.85,
                    "explanation": "Strong negative correlation due to..."
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
  }, []);

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
                Analyze Feed
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {analysis && <AnalysisCard analysis={analysis} />}
        
        {analysis?.currencies && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Currency Strength</h2>
            <CurrencyStrengthMeter currencies={analysis.currencies} />
          </div>
        )}

        {analysis?.correlations && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Currency Correlations</h2>
            <CurrencyCorrelations correlations={analysis.correlations} />
          </div>
        )}
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Latest News</h2>
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

export default App;