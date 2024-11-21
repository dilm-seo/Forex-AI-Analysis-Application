import React, { useState } from 'react';
import { Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
  isAnalyzing: boolean;
}

export default function NewsCard({ news, isAnalyzing }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const date = new Date(news.pubDate);

  return (
    <div className="bg-blue-900/95 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/50 shadow-lg text-white hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold flex-1 text-blue-100">{news.title}</h3>
        <a
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-blue-100 ml-4 transition-colors"
        >
          <ExternalLink size={20} />
        </a>
      </div>
      
      <div className="flex items-center text-blue-300 text-sm mb-4">
        <Clock size={16} className="mr-2" />
        <time dateTime={date.toISOString()}>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </time>
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 px-4 bg-blue-800/50 rounded-xl hover:bg-blue-800/70 transition-colors mb-4 text-blue-100"
      >
        <span className="text-sm font-medium">
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </span>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isExpanded && (
        <div
          className="text-blue-100 mt-4 prose prose-sm max-w-none prose-invert"
          dangerouslySetInnerHTML={{
            __html: news.description.split('This article was written by')[0]
          }}
        />
      )}
      
      {isAnalyzing && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
        </div>
      )}
    </div>
  );
}