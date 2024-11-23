import { useState, useCallback } from 'react';
import { useInterval } from 'react-use';
import { toast } from 'react-hot-toast';
import type { NewsItem } from '../types';
import { useAnalysisStore } from '../store/analysisStore';

const QUEUE_INTERVAL = 10000; // 10 seconds
const MAX_RETRIES = 3;

interface QueueItem {
  news: NewsItem[];
  apiKey: string;
  retries: number;
}

export function useAnalysisQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { analyzeNews } = useAnalysisStore();

  const addToQueue = useCallback((news: NewsItem[], apiKey: string) => {
    setQueue(prev => [...prev, { news, apiKey, retries: 0 }]);
    toast.success('Analyse ajoutée à la file d\'attente');
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessing || queue.length === 0) return;

    setIsProcessing(true);
    const item = queue[0];

    try {
      await analyzeNews(item.news, item.apiKey);
      setQueue(prev => prev.slice(1));
      toast.success('Analyse terminée avec succès');
    } catch (error) {
      if (item.retries < MAX_RETRIES) {
        setQueue(prev => [
          { ...item, retries: item.retries + 1 },
          ...prev.slice(1)
        ]);
        toast.error(`Tentative ${item.retries + 1}/${MAX_RETRIES} échouée`);
      } else {
        setQueue(prev => prev.slice(1));
        toast.error('Analyse abandonnée après plusieurs tentatives');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [queue, isProcessing, analyzeNews]);

  useInterval(processQueue, queue.length > 0 ? QUEUE_INTERVAL : null);

  return {
    addToQueue,
    queueLength: queue.length,
    isProcessing
  };
}