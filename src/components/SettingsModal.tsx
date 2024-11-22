import React, { useState } from 'react';
import { X } from 'lucide-react';
import { saveSettings, loadSettings } from '../utils/storage';
import type { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
}

export default function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [settings, setSettings] = useState<Settings>(loadSettings());

  if (!isOpen) return null;

  const handleSave = () => {
    saveSettings(settings);
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-md relative border border-gray-200 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
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
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value as Settings['language'] })}
              className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of News to Analyze
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.newsCount.toString()}
              onChange={(e) => setSettings({ ...settings, newsCount: parseInt(e.target.value) || 5 })}
              className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI Model
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
          
          <button
            onClick={handleSave}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}