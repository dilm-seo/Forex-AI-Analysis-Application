const STORAGE_KEY = 'forex-analyzer-settings';

const DEFAULT_SETTINGS = {
  apiKey: '',
  language: 'fr',
  newsCount: 5,
  model: 'gpt-4-turbo-preview',
  feedUrl: 'https://www.forexlive.com/feed/news/',
  theme: 'light',
  timeframe: '4h',
  alertsEnabled: true,
  favoritesPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
  analysis: {
    minStrengthDiff: 20,
    minConfidence: 70,
    maxRisk: 'modéré',
    preferredPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
    excludedPairs: [],
    minRiskRewardRatio: 2,
    timeframes: ['1h', '4h', '1d'],
    volatilityFilter: {
      min: 0.3,
      max: 2.0
    },
    correlationThreshold: 0.7,
    momentumThreshold: 60,
    trendStrengthThreshold: 50
  },
  notifications: {
    email: false,
    desktop: true,
    mobile: false,
    telegram: false
  },
  riskManagement: {
    maxPositions: 3,
    maxRiskPerTrade: 2,
    maxDailyLoss: 6,
    preferredRiskRewardRatio: 2.5
  },
  customIndicators: {
    rsi: {
      enabled: true,
      period: 14,
      overbought: 70,
      oversold: 30
    },
    macd: {
      enabled: true,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9
    },
    bollinger: {
      enabled: true,
      period: 20,
      standardDeviations: 2
    }
  }
};

export const saveSettings = (settings: typeof DEFAULT_SETTINGS) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const loadSettings = () => {
  const settings = localStorage.getItem(STORAGE_KEY);
  return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS;
};