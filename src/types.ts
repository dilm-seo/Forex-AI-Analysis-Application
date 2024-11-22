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
}

export interface Analysis {
  summary: string;
  scalping: string;
  dayTrading: string;
  currencies: CurrencyStrength[];
  correlations: CurrencyCorrelation[];
}