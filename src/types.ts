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
  factors: string[];
}

export interface TradingOpportunity {
  pair: string;
  type: 'buy' | 'sell';
  timeframe: 'court' | 'moyen' | 'long';
  strength: number;
  reasoning: string[];
  risk: 'faible' | 'modéré' | 'élevé';
  stopLoss: number;
  target: number;
}

export interface CurrencyCorrelation {
  pair: string;
  correlation: number;
  explanation: string;
  factors: string[];
}

export interface MarketSentiment {
  overall: 'risk-on' | 'risk-off' | 'neutral';
  confidence: number;
  drivers: string[];
}

export interface Analysis {
  currencies: CurrencyStrength[];
  opportunities: TradingOpportunity[];
  correlations: CurrencyCorrelation[];
  marketSentiment: MarketSentiment;
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