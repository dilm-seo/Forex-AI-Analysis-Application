import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { Analysis, NewsItem } from '../types';
import { analyzeMarketData } from '../utils/analysis';

interface AnalysisState {
  analysis: Analysis | null;
  isAnalyzing: boolean;
  lastAnalysisTime: number | null;
  progress: { value: number; message: string };
  error: string | null;
  analyzeNews: (news: NewsItem[], apiKey: string) => Promise<void>;
  resetAnalysis: () => void;
}

const ANALYSIS_COOLDOWN = 5 * 60 * 1000; // 5 minutes

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      analysis: null,
      isAnalyzing: false,
      lastAnalysisTime: null,
      progress: { value: 0, message: '' },
      error: null,

      analyzeNews: async (news: NewsItem[], apiKey: string) => {
        const { lastAnalysisTime } = get();
        const now = Date.now();

        if (lastAnalysisTime && now - lastAnalysisTime < ANALYSIS_COOLDOWN) {
          const remainingTime = Math.ceil((ANALYSIS_COOLDOWN - (now - lastAnalysisTime)) / 1000);
          throw new Error(`Veuillez attendre ${remainingTime} secondes avant la prochaine analyse`);
        }

        set({ isAnalyzing: true, error: null });

        try {
          const result = await analyzeMarketData(
            news,
            apiKey,
            (value, message) => set({ progress: { value, message } })
          );

          set({
            analysis: result,
            lastAnalysisTime: Date.now(),
            isAnalyzing: false,
            progress: { value: 0, message: '' }
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Une erreur est survenue',
            isAnalyzing: false,
            progress: { value: 0, message: '' }
          });
          throw error;
        }
      },

      resetAnalysis: () => {
        set({
          analysis: null,
          isAnalyzing: false,
          progress: { value: 0, message: '' },
          error: null
        });
      }
    }),
    {
      name: 'forex-analysis-storage',
      partialize: (state) => ({
        analysis: state.analysis,
        lastAnalysisTime: state.lastAnalysisTime
      })
    }
  )
);