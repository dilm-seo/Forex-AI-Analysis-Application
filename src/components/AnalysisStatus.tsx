import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AnalysisStatusProps {
  timestamp: number | null;
  confidence: number;
  isProcessing: boolean;
  queueLength: number;
}

export default function AnalysisStatus({ 
  timestamp, 
  confidence, 
  isProcessing,
  queueLength 
}: AnalysisStatusProps) {
  if (!timestamp) return null;

  const timeAgo = formatDistanceToNow(timestamp, { 
    addSuffix: true,
    locale: fr 
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="text-blue-500" size={20} />
          <div>
            <p className="text-sm text-gray-600">
              Dernière analyse: <span className="font-medium">{timeAgo}</span>
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                Confiance: {confidence}%
              </div>
              {isProcessing && (
                <div className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                  Analyse en cours
                </div>
              )}
              {queueLength > 0 && (
                <div className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                  File d&apos;attente: {queueLength}
                </div>
              )}
            </div>
          </div>
        </div>

        {Date.now() - timestamp > 30 * 60 * 1000 && (
          <div className="flex items-center space-x-2 text-yellow-600">
            <AlertTriangle size={16} />
            <span className="text-xs">Analyse supérieure à 30min</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}