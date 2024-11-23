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
    fundamentalFactors: {
      economicImportance: 40,
      monetaryPolicyWeight: 35,
      geopoliticalRiskWeight: 25
    },
    volatilityFilter: {
      min: 0.3,
      max: 2.0
    }
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
  }
} as const;

export const saveSettings = (settings: typeof DEFAULT_SETTINGS) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const loadSettings = () => {
  const settings = localStorage.getItem(STORAGE_KEY);
  return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS;
};