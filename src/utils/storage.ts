const STORAGE_KEY = 'forex-analyzer-settings';

export const saveSettings = (settings: { 
  apiKey: string; 
  language: string;
  newsCount: number;
  model: string;
  feedUrl: string;
}) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const loadSettings = () => {
  const settings = localStorage.getItem(STORAGE_KEY);
  return settings ? JSON.parse(settings) : {
    apiKey: '',
    language: 'en',
    newsCount: 5,
    model: 'gpt-4-turbo-preview',
    feedUrl: 'https://www.forexlive.com/feed/news/'
  };
};