export interface NewsItem {
  title: string;
  description: string;
  pubDate: string;
  link: string;
}

export interface CurrencyStrength {
  currency: string;
  strength: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface CurrencyCorrelation {
  pair: string;
  correlation: number;
  explanation: string;
}

export interface Settings {
  apiKey: string;
  language: 'en' | 'fr' | 'es';
  newsCount: number;
  model: 'gpt-4-turbo-preview' | 'gpt-4' | 'gpt-3.5-turbo';
  feedUrl: string;
  theme: 'light' | 'dark';
  timeframe: '1h' | '4h' | '1d';
  alertsEnabled: boolean;
  favoritesPairs: string[];
}

export interface Analysis {
  summary: string;
  currencies: CurrencyStrength[];
  scalping: string;
  dayTrading: string;
  correlations: CurrencyCorrelation[];
  keyLevels?: {
    pair: string;
    support: number[];
    resistance: number[];
  }[];
  marketSentiment?: {
    overall: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    factors: string[];
  };
  technicalIndicators?: {
    pair: string;
    indicators: {
      name: string;
      value: number;
      signal: 'buy' | 'sell' | 'neutral';
    }[];
  }[];
}