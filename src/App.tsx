import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAnalysisStore } from './store/analysisStore';
import { useAnalysisQueue } from './hooks/useAnalysisQueue';

import NewsCard from './components/NewsCard';
import AnalysisCard from './components/AnalysisCard';
import SettingsModal from './components/SettingsModal';
import CurrencyStrengthMeter from './components/CurrencyStrengthMeter';
import CurrencyCorrelations from './components/CurrencyCorrelations';
import CompassCard from './components/CompassCard';
import MarketSentiment from './components/MarketSentiment';
import TradingSessions from './components/TradingSessions';
import ProgressBar from './components/ProgressBar';
import AnalysisStatus from './components/AnalysisStatus';

import { loadSettings } from './utils/storage';
import type { NewsItem, Settings as SettingsType } from './types';

export default function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [settings, setSettings] = useState<SettingsType>(loadSettings());
  const [showSettings, setShowSettings] = useState(false);

  const { 
    analysis, 
    isAnalyzing, 
    progress, 
    error,
    analyzeNews: startAnalysis 
  } = useAnalysisStore();

  const { addToQueue, queueLength, isProcessing } = useAnalysisQueue();

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

  const handleAnalysis = async () => {
    if (!settings.apiKey) {
      toast.error('Veuillez configurer votre clé API OpenAI');
      setShowSettings(true);
      return;
    }

    if (news.length === 0) {
      toast.error('Aucune actualité à analyser');
      return;
    }

    if (isAnalyzing) {
      toast.error('Une analyse est déjà en cours');
      return;
    }

    try {
      addToQueue(news.slice(0, settings.newsCount), settings.apiKey);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'analyse');
    }
  };

  useEffect(() => {
    fetchNews();
  }, [settings.feedUrl]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
                onClick={handleAnalysis}
                disabled={isAnalyzing || isProcessing}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <RefreshCw 
                  size={20} 
                  className={`mr-2 ${isAnalyzing || isProcessing ? 'animate-spin' : ''}`} 
                />
                Analyser
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {analysis && (
          <AnalysisStatus
            timestamp={analysis.timestamp}
            confidence={analysis.confidence}
            isProcessing={isAnalyzing || isProcessing}
            queueLength={queueLength}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradingSessions />
          {analysis?.marketSentiment && (
            <MarketSentiment sentiment={analysis.marketSentiment} />
          )}
        </div>

        {analysis && (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Force des Devises</h2>
              <CurrencyStrengthMeter currencies={analysis.currencies} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CompassCard opportunities={analysis.opportunities} />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Corrélations</h2>
              <CurrencyCorrelations correlations={analysis.correlations} />
            </div>
          </>
        )}
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Dernières Actualités</h2>
          {news.slice(0, settings.newsCount).map((item, index) => (
            <NewsCard
              key={index}
              news={item}
              isAnalyzing={isAnalyzing && index === 0}
            />
          ))}
        </div>
      </main>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={setSettings}
      />
      
      {(isAnalyzing || isProcessing) && (
        <ProgressBar
          progress={progress.value}
          message={progress.message}
        />
      )}
      
      <Toaster position="top-right" />
    </div>
  );
}