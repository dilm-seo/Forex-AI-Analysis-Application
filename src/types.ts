export interface NewsItem {
  title: string;
  description: string;
  pubDate: string;
  link: string;
}

export interface TradingSignal {
  pair: string;
  type: 'buy' | 'sell';
  timeframe: 'scalping' | 'day';
  strength: number;
  reasons: string[];
  impact: 'high' | 'medium' | 'low';
}

export interface Analysis {
  summary: string;
  currencies: {
    pair: string;
    sentiment: 'bullish' | 'bearish' | 'neutral';
    strength: number;
  }[];
  signals: TradingSignal[];
}

export interface Settings {
  apiKey: string;
  language: 'en' | 'fr' | 'es';
  newsCount: number;
  model: 'gpt-4-turbo-preview' | 'gpt-4' | 'gpt-3.5-turbo';
  feedUrl: string;
}