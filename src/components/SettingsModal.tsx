import React, { useState } from 'react';
import { X } from 'lucide-react';
import { saveSettings, loadSettings } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { 
    apiKey: string; 
    language: string;
    newsCount: number;
    model: string;
    feedUrl: string;
  }) => void;
}

export default function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [settings, setSettings] = useState(loadSettings());

  if (!isOpen) return null;

  const handleSave = () => {
    saveSettings(settings);
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-blue-900/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-md relative border border-blue-700/50 shadow-xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-300 hover:text-blue-100 transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">
          Settings
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              className="w-full p-3 border border-blue-700/50 rounded-xl bg-blue-800/50 text-blue-100 placeholder-blue-400/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              placeholder="sk-..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              News Feed URL
            </label>
            <input
              type="url"
              value={settings.feedUrl}
              onChange={(e) => setSettings({ ...settings, feedUrl: e.target.value })}
              className="w-full p-3 border border-blue-700/50 rounded-xl bg-blue-800/50 text-blue-100 placeholder-blue-400/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              placeholder="https://..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full p-3 border border-blue-700/50 rounded-xl bg-blue-800/50 text-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Number of News to Analyze
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.newsCount}
              onChange={(e) => setSettings({ ...settings, newsCount: parseInt(e.target.value) })}
              className="w-full p-3 border border-blue-700/50 rounded-xl bg-blue-800/50 text-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              OpenAI Model
            </label>
            <select
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
              className="w-full p-3 border border-blue-700/50 rounded-xl bg-blue-800/50 text-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            >
              <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>
          
          <button
            onClick={handleSave}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl hover:from-blue-500 hover:to-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
