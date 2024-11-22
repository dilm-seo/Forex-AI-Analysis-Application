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
  volatility: number;
  momentum: number;
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
  volatility: number;
  volume: number;
  pivotPoints: {
    r3: number;
    r2: number;
    r1: number;
    pivot: number;
    s1: number;
    s2: number;
    s3: number;
  };
}

export interface CurrencyCorrelation {
  pair: string;
  correlation: number;
  explanation: string;
  factors: string[];
  strength: 'forte' | 'moyenne' | 'faible';
  stability: number;
  period: '1j' | '1s' | '1m';
}

export interface MarketSentiment {
  overall: 'risk-on' | 'risk-off' | 'neutral';
  confidence: number;
  drivers: string[];
  volatilityIndex: number;
  marketStress: number;
  liquidityScore: number;
  technicalFactors: {
    trendStrength: number;
    momentum: number;
    volatility: number;
    volume: number;
  };
  fundamentalFactors: {
    economicHealth: number;
    monetaryPolicy: 'hawkish' | 'dovish' | 'neutral';
    geopoliticalRisk: number;
  };
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
  volatilityFilter: {
    min: number;
    max: number;
  };
  correlationThreshold: number;
  momentumThreshold: number;
  trendStrengthThreshold: number;
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
  customIndicators: {
    rsi: {
      enabled: boolean;
      period: number;
      overbought: number;
      oversold: number;
    };
    macd: {
      enabled: boolean;
      fastPeriod: number;
      slowPeriod: number;
      signalPeriod: number;
    };
    bollinger: {
      enabled: boolean;
      period: number;
      standardDeviations: number;
    };
  };
}