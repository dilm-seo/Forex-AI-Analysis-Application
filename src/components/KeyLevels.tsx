import React from 'react';
import { Target } from 'lucide-react';

interface KeyLevelsProps {
  levels: {
    pair: string;
    support: number[];
    resistance: number[];
  }[];
}

export default function KeyLevels({ levels }: KeyLevelsProps) {
  if (!levels?.length) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="text-blue-500" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Niveaux Clés</h2>
      </div>

      <div className="grid gap-6">
        {levels.map((item, index) => (
          <div key={index} className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
            <h3 className="text-lg font-mono font-semibold text-gray-800 mb-4">{item.pair}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Supports</h4>
                <div className="space-y-2">
                  {item.support.map((level, idx) => (
                    <div
                      key={idx}
                      className="bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-100 font-mono"
                    >
                      {level.toFixed(5)}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Résistances</h4>
                <div className="space-y-2">
                  {item.resistance.map((level, idx) => (
                    <div
                      key={idx}
                      className="bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-100 font-mono"
                    >
                      {level.toFixed(5)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}