import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { saveSettings, loadSettings } from '../utils/storage';
import type { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
}

const FEED_OPTIONS = [
  { value: 'https://www.forexlive.com/feed', label: 'Général' },
  { value: 'https://www.forexlive.com/feed/news', label: 'Actualités' },
  { value: 'https://www.forexlive.com/feed/technicalanalysis', label: 'Analyse Technique' },
  { value: 'https://www.forexlive.com/feed/centralbank', label: 'Banques Centrales' },
  { value: 'https://www.forexlive.com/feed/cryptocurrency', label: 'Crypto-monnaies' }
];

const TIMEFRAMES = [
  { value: '1h', label: '1 Heure' },
  { value: '4h', label: '4 Heures' },
  { value: '1d', label: '1 Jour' },
  { value: '1w', label: '1 Semaine' },
  { value: '1m', label: '1 Mois' }
];

export default function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [settings, setSettings] = useState(loadSettings());
  const [currentTab, setCurrentTab] = useState<'general' | 'analysis' | 'risk' | 'indicators'>('general');

  if (!isOpen) return null;

  const handleSave = () => {
    saveSettings(settings);
    onSave(settings);
    onClose();
  };

  const tabs = [
    { id: 'general', label: 'Général' },
    { id: 'analysis', label: 'Analyse' },
    { id: 'risk', label: 'Gestion du Risque' },
    { id: 'indicators', label: 'Indicateurs' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-4xl m-4 relative border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Paramètres
        </h2>

        <div className="flex space-x-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="space-y-6">
          {currentTab === 'general' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clé API OpenAI
                </label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="sk-..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de Feed
                </label>
                <select
                  value={settings.feedUrl}
                  onChange={(e) => setSettings({ ...settings, feedUrl: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                >
                  {FEED_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value as Settings['language'] })}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre d'Actualités à Analyser
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.newsCount}
                  onChange={(e) => setSettings({ ...settings, newsCount: parseInt(e.target.value) || 5 })}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle OpenAI
                </label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings({ ...settings, model: e.target.value as Settings['model'] })}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                >
                  <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
            </>
          )}

          {currentTab === 'analysis' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Différence Minimale de Force (%)
                </label>
                <input
                  type="number"
                  min="10"
                  max="50"
                  value={settings.analysis.minStrengthDiff}
                  onChange={(e) => setSettings({
                    ...settings,
                    analysis: {
                      ...settings.analysis,
                      minStrengthDiff: parseInt(e.target.value) || 20
                    }
                  })}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confiance Minimale (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="90"
                  value={settings.analysis.minConfidence}
                  onChange={(e) => setSettings({
                    ...settings,
                    analysis: {
                      ...settings.analysis,
                      minConfidence: parseInt(e.target.value) || 70
                    }
                  })}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeframes d'Analyse
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TIMEFRAMES.map((tf) => (
                    <label
                      key={tf.value}
                      className="flex items-center space-x-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={settings.analysis.timeframes.includes(tf.value as any)}
                        onChange={(e) => {
                          const timeframes = e.target.checked
                            ? [...settings.analysis.timeframes, tf.value]
                            : settings.analysis.timeframes.filter(t => t !== tf.value);
                          setSettings({
                            ...settings,
                            analysis: {
                              ...settings.analysis,
                              timeframes
                            }
                          });
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tf.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volatilité Minimale
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5"
                    value={settings.analysis.volatilityFilter.min}
                    onChange={(e) => setSettings({
                      ...settings,
                      analysis: {
                        ...settings.analysis,
                        volatilityFilter: {
                          ...settings.analysis.volatilityFilter,
                          min: parseFloat(e.target.value) || 0.3
                        }
                      }
                    })}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volatilité Maximale
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5"
                    value={settings.analysis.volatilityFilter.max}
                    onChange={(e) => setSettings({
                      ...settings,
                      analysis: {
                        ...settings.analysis,
                        volatilityFilter: {
                          ...settings.analysis.volatilityFilter,
                          max: parseFloat(e.target.value) || 2.0
                        }
                      }
                    })}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {currentTab === 'risk' && (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="text-yellow-500 mt-0.5" size={20} />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-1">Attention à la Gestion du Risque</p>
                    <p>Ces paramètres affectent directement vos positions. Ajustez-les avec précaution selon votre profil de risque.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Positions Maximum
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.riskManagement.maxPositions}
                    onChange={(e) => setSettings({
                      ...settings,
                      riskManagement: {
                        ...settings.riskManagement,
                        maxPositions: parseInt(e.target.value) || 3
                      }
                    })}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risque Maximum par Trade (%)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={settings.riskManagement.maxRiskPerTrade}
                    onChange={(e) => setSettings({
                      ...settings,
                      riskManagement: {
                        ...settings.riskManagement,
                        maxRiskPerTrade: parseFloat(e.target.value) || 2
                      }
                    })}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Perte Journalière Maximum (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={settings.riskManagement.maxDailyLoss}
                  onChange={(e) => setSettings({
                    ...settings,
                    riskManagement: {
                      ...settings.riskManagement,
                      maxDailyLoss: parseFloat(e.target.value) || 6
                    }
                  })}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ratio Risque/Récompense Préféré
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={settings.riskManagement.preferredRiskRewardRatio}
                  onChange={(e) => setSettings({
                    ...settings,
                    riskManagement: {
                      ...settings.riskManagement,
                      preferredRiskRewardRatio: parseFloat(e.target.value) || 2.5
                    }
                  })}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            </>
          )}

          {currentTab === 'indicators' && (
            <>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">RSI</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.customIndicators.rsi.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          customIndicators: {
                            ...settings.customIndicators,
                            rsi: {
                              ...settings.customIndicators.rsi,
                              enabled: e.target.checked
                            }
                          }
                        })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Activer RSI</span>
                    </label>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Période
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="50"
                          value={settings.customIndicators.rsi.period}
                          onChange={(e) => setSettings({
                            ...settings,
                            customIndicators: {
                              ...settings.customIndicators,
                              rsi: {
                                ...settings.customIndicators.rsi,
                                period: parseInt(e.target.value) || 14
                              }
                            }
                          })}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Suracheté
                        </label>
                        <input
                          type="number"
                          min="60"
                          max="90"
                          value={settings.customIndicators.rsi.overbought}
                          onChange={(e) => setSettings({
                            ...settings,
                            customIndicators: {
                              ...settings.customIndicators,
                              rsi: {
                                ...settings.customIndicators.rsi,
                                overbought: parseInt(e.target.value) || 70
                              }
                            }
                          })}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Survendu
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="40"
                          value={settings.customIndicators.rsi.oversold}
                          onChange={(e) => setSettings({
                            ...settings,
                            customIndicators: {
                              ...settings.customIndicators,
                              rsi: {
                                ...settings.customIndicators.rsi,
                                oversold: parseInt(e.target.value) || 30
                              }
                            }
                          })}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">MACD</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.customIndicators.macd.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          customIndicators: {
                            ...settings.customIndicators,
                            macd: {
                              ...settings.customIndicators.macd,
                              enabled: e.target.checked
                            }
                          }
                        })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Activer MACD</span>
                    </label>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Période Rapide
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="20"
                          value={settings.customIndicators.macd.fastPeriod}
                          onChange={(e) => setSettings({
                            ...settings,
                            customIndicators: {
                              ...settings.customIndicators,
                              macd: {
                                ...settings.customIndicators.macd,
                                fastPeriod: parseInt(e.target.value) || 12
                              }
                            }
                          })}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Période Lente
                        </label>
                        <input
                          type="number"
                          min="20"
                          max="40"
                          value={settings.customIndicators.macd.slowPeriod}
                          onChange={(e) => setSettings({
                            ...settings,
                            customIndicators: {
                              ...settings.customIndicators,
                              macd: {
                                ...settings.customIndicators.macd,
                                slowPeriod: parseInt(e.target.value) || 26
                              }
                            }
                          })}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Période Signal
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="15"
                          value={settings.customIndicators.macd.signalPeriod}
                          onChange={(e) => setSettings({
                            ...settings,
                            customIndicators: {
                              ...settings.customIndicators,
                              macd: {
                                ...settings.customIndicators.macd,
                                signalPeriod: parseInt(e.target.value) || 9
                              }
                            }
                          })}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus: ring-blue-400 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Bandes de Bollinger</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.customIndicators.bollinger.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          customIndicators: {
                            ...settings.customIndicators,
                            bollinger: {
                              ...settings.customIndicators.bollinger,
                              enabled: e.target.checked
                            }
                          }
                        })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Activer Bollinger</span>
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Période
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="50"
                          value={settings.customIndicators.bollinger.period}
                          onChange={(e) => setSettings({
                            ...settings,
                            customIndicators: {
                              ...settings.customIndicators,
                              bollinger: {
                                ...settings.customIndicators.bollinger,
                                period: parseInt(e.target.value) || 20
                              }
                            }
                          })}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Écarts-types
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="3"
                          step="0.5"
                          value={settings.customIndicators.bollinger.standardDeviations}
                          onChange={(e) => setSettings({
                            ...settings,
                            customIndicators: {
                              ...settings.customIndicators,
                              bollinger: {
                                ...settings.customIndicators.bollinger,
                                standardDeviations: parseFloat(e.target.value) || 2
                              }
                            }
                          })}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          <button
            onClick={handleSave}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}