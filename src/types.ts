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
  fundamentals: {
    economicGrowth: number;
    inflation: number;
    interestRates: number;
    employment: number;
    tradeBalance: number;
  };
  events: {
    impact: 'high' | 'medium' | 'low';
    description: string;
    date: string;
  }[];
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
  riskRewardRatio: number;
  fundamentalFactors: {
    monetaryPolicy: string;
    economicData: string;
    politicalFactors: string;
    marketSentiment: string;
  };
}

export interface CurrencyCorrelation {
  pair: string;
  correlation: number;
  explanation: string;
  factors: string[];
  strength: 'forte' | 'moyenne' | 'faible';
  fundamentalDrivers: string[];
  period: '1j' | '1s' | '1m';
}

export interface MarketSentiment {
  overall: 'risk-on' | 'risk-off' | 'neutral';
  confidence: number;
  drivers: string[];
  fundamentalFactors: {
    economicHealth: number;
    monetaryPolicy: 'hawkish' | 'dovish' | 'neutral';
    geopoliticalRisk: number;
    marketLiquidity: number;
    globalGrowth: number;
  };
  keyEvents: {
    event: string;
    impact: 'high' | 'medium' | 'low';
    date: string;
  }[];
}

export interface Analysis {
  currencies: CurrencyStrength[];
  opportunities: TradingOpportunity[];
  correlations: CurrencyCorrelation[];
  marketSentiment: MarketSentiment;
  timestamp: number;
  confidence: number;
  timeframe: AnalysisTimeframe;
}

export interface AnalysisSettings {
  minStrengthDiff: number;
  minConfidence: number;
  maxRisk: 'faible' | 'modéré' | 'élevé';
  preferredPairs: string[];
  excludedPairs: string[];
  minRiskRewardRatio: number;
  timeframes: AnalysisTimeframe[];
  fundamentalFactors: {
    economicImportance: number;
    monetaryPolicyWeight: number;
    geopoliticalRiskWeight: number;
  };
  volatilityFilter: {
    min: number;
    max: number;
  };
}

export type AnalysisTimeframe = '1h' | '4h' | '1d' | '1w' | '1m';

export interface Settings {
  apiKey: string;
  language: 'en' | 'fr' | 'es';
  newsCount: number;
  model: 'gpt-4-turbo-preview' | 'gpt-4' | 'gpt-3.5-turbo';
  feedUrl: string;
  theme: 'light' | 'dark';
  timeframe: AnalysisTimeframe;
  alertsEnabled: boolean;
  favoritesPairs: string[];
  analysis: AnalysisSettings;
  notifications: {
    email: boolean;
    desktop: boolean;
    mobile: boolean;
    telegram: boolean;
  };
  riskManagement: {
    maxPositions: number;
    maxRiskPerTrade: number;
    maxDailyLoss: number;
    preferredRiskRewardRatio: number;
  };
}