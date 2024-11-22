import React from 'react';
import { BarChart, TrendingUp } from 'lucide-react';
import type { Analysis } from '../types';

interface AnalysisCardProps {
  analysis: Analysis;
}

export default function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Market Analysis
      </h3>
      
      <div className="space-y-8">
        <div className="bg-gray-50/80 p-6 rounded-xl border border-gray-100">
          <div className="flex items-center mb-3">
            <BarChart className="text-blue-500 mr-3" size={24} />
            <h4 className="text-lg font-semibold text-gray-800">Market Summary</h4>
          </div>
          <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50/80 p-6 rounded-xl border border-gray-100">
            <div className="flex items-center mb-4">
              <TrendingUp className="text-green-500 mr-3" size={24} />
              <h4 className="text-lg font-semibold text-gray-800">Scalping Opportunity</h4>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {analysis.scalping}
            </p>
          </div>

          <div className="bg-gray-50/80 p-6 rounded-xl border border-gray-100">
            <div className="flex items-center mb-4">
              <TrendingUp className="text-blue-500 mr-3" size={24} />
              <h4 className="text-lg font-semibold text-gray-800">Day Trading Opportunity</h4>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {analysis.dayTrading}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}