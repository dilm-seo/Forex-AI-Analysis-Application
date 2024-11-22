import React, { useState, useEffect } from 'react';
import { Clock, Globe, Activity, TrendingUp, AlertTriangle, Sun, Moon } from 'lucide-react';

interface Session {
  name: string;
  status: 'active' | 'upcoming' | 'closed';
  startTime: string;
  endTime: string;
  volume: number;
  pairs: Array<{
    name: string;
    volatility: 'high' | 'medium' | 'low';
    recommendation: 'buy' | 'sell' | 'neutral';
  }>;
  volatility: 'high' | 'medium' | 'low';
  overlap?: string;
  icon: 'sun' | 'moon';
  color: string;
}

export default function TradingSessions() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentSession = (): Session[] => {
    const hour = currentTime.getUTCHours();
    
    const sessions: Session[] = [
      {
        name: 'Sydney',
        startTime: '21:00',
        endTime: '06:00',
        volume: 4,
        volatility: 'low',
        overlap: 'Tokyo (23:00-06:00)',
        pairs: [
          { name: 'AUD/USD', volatility: 'high', recommendation: 'buy' },
          { name: 'NZD/USD', volatility: 'medium', recommendation: 'neutral' },
          { name: 'AUD/JPY', volatility: 'medium', recommendation: 'sell' }
        ],
        status: (hour >= 21 || hour < 6) ? 'active' : 'closed',
        icon: 'moon',
        color: 'from-purple-500/20 to-indigo-500/20'
      },
      {
        name: 'Tokyo',
        startTime: '23:00',
        endTime: '08:00',
        volume: 8,
        volatility: 'medium',
        overlap: 'Londres (08:00-09:00)',
        pairs: [
          { name: 'USD/JPY', volatility: 'high', recommendation: 'buy' },
          { name: 'EUR/JPY', volatility: 'high', recommendation: 'sell' },
          { name: 'GBP/JPY', volatility: 'medium', recommendation: 'neutral' }
        ],
        status: (hour >= 23 || hour < 8) ? 'active' : 'closed',
        icon: 'moon',
        color: 'from-blue-500/20 to-purple-500/20'
      },
      {
        name: 'Londres',
        startTime: '08:00',
        endTime: '17:00',
        volume: 35,
        volatility: 'high',
        overlap: 'New York (13:00-17:00)',
        pairs: [
          { name: 'EUR/USD', volatility: 'high', recommendation: 'buy' },
          { name: 'GBP/USD', volatility: 'high', recommendation: 'sell' },
          { name: 'EUR/GBP', volatility: 'medium', recommendation: 'neutral' }
        ],
        status: (hour >= 8 && hour < 17) ? 'active' : 'closed',
        icon: 'sun',
        color: 'from-amber-500/20 to-orange-500/20'
      },
      {
        name: 'New York',
        startTime: '13:00',
        endTime: '22:00',
        volume: 28,
        volatility: 'high',
        overlap: 'Londres (13:00-17:00)',
        pairs: [
          { name: 'EUR/USD', volatility: 'high', recommendation: 'sell' },
          { name: 'USD/CAD', volatility: 'medium', recommendation: 'buy' },
          { name: 'USD/CHF', volatility: 'medium', recommendation: 'neutral' }
        ],
        status: (hour >= 13 && hour < 22) ? 'active' : 'closed',
        icon: 'sun',
        color: 'from-blue-500/20 to-cyan-500/20'
      }
    ];

    let foundActive = false;
    return sessions.map(session => {
      if (session.status === 'active') {
        foundActive = true;
        return session;
      }
      const [startHour] = session.startTime.split(':').map(Number);
      if (!foundActive && ((hour < startHour) || (hour === 23 && startHour === 0))) {
        return { ...session, status: 'upcoming' };
      }
      return session;
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const sessions = getCurrentSession();
  const activeSessions = sessions.filter(s => s.status === 'active');

  return (
    <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900 rounded-2xl p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Globe className="text-blue-300" size={24} />
          <div>
            <h2 className="text-xl font-bold">Sessions de Trading</h2>
            <p className="text-blue-300 text-sm">
              {formatTime(currentTime)} UTC
            </p>
          </div>
        </div>
        {activeSessions.length > 0 && (
          <div className="bg-blue-800/50 px-4 py-2 rounded-xl border border-blue-700/30">
            <p className="text-sm font-medium">
              Sessions Actives: {activeSessions.map(s => s.name).join(', ')}
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {sessions.map((session) => (
          <div
            key={session.name}
            className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
              session.status === 'active'
                ? `bg-gradient-to-r ${session.color} border-blue-400/30 shadow-lg scale-[1.02]`
                : session.status === 'upcoming'
                ? 'bg-white/5 border-purple-400/30'
                : 'bg-white/5 border-gray-600 opacity-60'
            } p-4 cursor-pointer hover:bg-white/15`}
            onClick={() => setSelectedSession(selectedSession === session.name ? null : session.name)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {session.icon === 'sun' ? (
                  <Sun className={`${session.status === 'active' ? 'text-amber-300' : 'text-gray-400'}`} size={20} />
                ) : (
                  <Moon className={`${session.status === 'active' ? 'text-blue-300' : 'text-gray-400'}`} size={20} />
                )}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold flex items-center space-x-2">
                    <span>{session.name}</span>
                    {session.status === 'active' && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-blue-300">
                    <Clock size={14} />
                    <span>
                      {session.startTime} - {session.endTime} UTC
                    </span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                session.status === 'active'
                  ? 'bg-green-500/20 text-green-300'
                  : session.status === 'upcoming'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-gray-500/20 text-gray-300'
              }`}>
                {session.status === 'active' && 'Actif'}
                {session.status === 'upcoming' && 'À venir'}
                {session.status === 'closed' && 'Fermé'}
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <div className="text-sm font-medium text-blue-300 mb-2">
                  Volume & Volatilité
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Volume</span>
                      <span>{session.volume}%</span>
                    </div>
                    <div className="h-2 bg-blue-900/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          session.status === 'active'
                            ? 'bg-gradient-to-r from-blue-400 to-green-400'
                            : session.status === 'upcoming'
                            ? 'bg-purple-400'
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${(session.volume / 35) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    session.volatility === 'high'
                      ? 'bg-red-500/20 text-red-300'
                      : session.volatility === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    Volatilité {
                      session.volatility === 'high' ? 'Haute' :
                      session.volatility === 'medium' ? 'Moyenne' : 'Basse'
                    }
                  </div>
                </div>
              </div>

              {selectedSession === session.name && (
                <>
                  {session.overlap && (
                    <div className="mt-2 bg-blue-800/30 rounded-lg p-3 border border-blue-700/30">
                      <div className="flex items-center space-x-2 text-sm">
                        <AlertTriangle size={16} className="text-yellow-400" />
                        <span>Chevauchement avec {session.overlap}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-blue-300 mb-3">
                      Paires Principales
                    </h4>
                    <div className="grid gap-2">
                      {session.pairs.map((pair) => (
                        <div
                          key={pair.name}
                          className="flex items-center justify-between bg-blue-800/30 p-3 rounded-lg border border-blue-700/30"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="font-mono">{pair.name}</span>
                            <span className={`px-2 py-1 rounded-md text-xs ${
                              pair.volatility === 'high'
                                ? 'bg-red-500/20 text-red-300'
                                : pair.volatility === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}>
                              Vol. {
                                pair.volatility === 'high' ? 'Haute' :
                                pair.volatility === 'medium' ? 'Moyenne' : 'Basse'
                              }
                            </span>
                          </div>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs ${
                            pair.recommendation === 'buy'
                              ? 'bg-green-500/20 text-green-300'
                              : pair.recommendation === 'sell'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            <TrendingUp size={14} />
                            <span>
                              {pair.recommendation === 'buy' ? 'Achat' :
                               pair.recommendation === 'sell' ? 'Vente' : 'Neutre'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}