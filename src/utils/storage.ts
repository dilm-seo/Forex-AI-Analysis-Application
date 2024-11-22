const STORAGE_KEY = 'forex-analyzer-settings';

export const saveSettings = (settings: { 
  apiKey: string; 
  language: string;
  newsCount: number;
  model: string;
  feedUrl: string;
  theme: string;
  timeframe: string;
  alertsEnabled: boolean;
  favoritesPairs: string[];
}) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const loadSettings = () => {
  const settings = localStorage.getItem(STORAGE_KEY);
  return settings ? JSON.parse(settings) : {
    apiKey: '',
    language: 'fr',
    newsCount: 5,
    model: 'gpt-4-turbo-preview',
    feedUrl: 'https://www.forexlive.com/feed/news/',
    theme: 'light',
    timeframe: '1h',
    alertsEnabled: true,
    favoritesPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY']
  };
};