import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { fetchTrendingNews, generateArticleSummary } from '../services/gemini';
import { Loader2, ExternalLink, Sparkles, ArrowRight, Clock, Newspaper } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassModal } from '../components/GlassModal';
import { NewsItem, ArticleSummary } from '../types';

const CATEGORIES = ["All", "Politics", "Business", "Technology", "Sports", "Entertainment", "Metro"];

// --- Main Page Component ---

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Read Mode State
  const [readingArticle, setReadingArticle] = useState<NewsItem | null>(null);
  const [summary, setSummary] = useState<ArticleSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const trendingTopics = ["Afrobeats", "Naira Rate", "Lagos Tech", "Elections", "Startups"];

  const getSafeUrl = (url?: string) => {
    if (!url) return null;
    let cleanUrl = url.trim();
    if (!cleanUrl.match(/^https?:\/\//i)) {
      cleanUrl = `https://${cleanUrl}`;
    }
    return cleanUrl;
  };

  const loadNews = async (category: string) => {
    setLoadingNews(true);
    setNews([]); 
    
    const dataStr = await fetchTrendingNews(category);
    try {
      const jsonStr = dataStr.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data)) {
        setNews(data);
      }
    } catch (e) {
      console.error("Failed to parse news", e);
      setNews([]);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    loadNews(selectedCategory);
  }, [selectedCategory]);

  const handleReadSummary = async (item: NewsItem) => {
    setReadingArticle(item);
    setLoadingSummary(true);
    setSummary(null);
    
    const result = await generateArticleSummary(item.title, item.source || 'News');
    setSummary(result);
    setLoadingSummary(false);
  };

  const closeReadMode = () => {
    setReadingArticle(null);
    setSummary(null);
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden flex flex-col">
      
      {/* Subtle Gradient Backgrounds */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-gray-200/40 to-transparent dark:from-gray-800/20 dark:to-transparent blur-[120px] opacity-60" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-gray-300/40 to-transparent dark:from-gray-700/10 dark:to-transparent blur-[120px] opacity-50" />
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-32 pb-12">
        
        {/* Hero Section */}
        <div className="w-full max-w-2xl flex flex-col items-center animate-fade-in space-y-10 mb-16">
          <div className="transform transition-transform duration-700 cursor-default">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-center text-black dark:text-white mb-2">
              Naijpedia
            </h1>
          </div>
          
          <div className="w-full relative z-10">
            <SearchBar onSearch={handleSearch} centered />
          </div>

          <div className="flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
             <div className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600 mr-2">
                Trending
             </div>
             {trendingTopics.map((topic, i) => (
               <button 
                  key={topic}
                  onClick={() => handleSearch(topic)}
                  className="px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 backdrop-blur-md"
                  style={{ animationDelay: `${0.1 + (i * 0.05)}s` }}
               >
                 {topic}
               </button>
             ))}
          </div>
        </div>

        {/* News Section */}
        <div className="w-full max-w-5xl animate-slide-up space-y-8" style={{ animationDelay: '0.3s' }}>
           
           {/* Header & Filters */}
           <div className="flex flex-col md:flex-row justify-between items-end md:items-center px-2 border-b border-black/5 dark:border-white/10 pb-6 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-black dark:text-white tracking-tight mb-1">Briefings</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fast, verified updates from Nigerian sources</p>
              </div>
              
              {/* Category Filters */}
              <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border
                      ${selectedCategory === cat 
                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                        : 'bg-transparent border-black/5 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10'}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
           </div>

           {/* Restored Card Grid (No Photos, Visible Actions) */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {loadingNews ? (
                 [1, 2, 3, 4, 5, 6].map((i) => (
                    <GlassCard key={i} className="h-64 flex items-center justify-center" hoverEffect={false}>
                       <Loader2 className="animate-spin text-gray-400 w-6 h-6" />
                    </GlassCard>
                 ))
              ) : news.length > 0 ? (
                 news.map((item, idx) => {
                    const safeUrl = getSafeUrl(item.url);
                    return (
                      <GlassCard 
                        key={idx} 
                        onClick={() => handleReadSummary(item)}
                        className="p-6 flex flex-col h-full justify-between group min-h-[260px] hover:border-black/20 dark:hover:border-white/20 transition-all"
                      >
                         <div>
                           <div className="flex justify-between items-center mb-4">
                              <span className="px-2 py-1 rounded border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 bg-black/5 dark:bg-white/5">
                                {item.category}
                              </span>
                              <div className="flex items-center text-gray-400 text-xs font-medium">
                                <Clock size={12} className="mr-1" />
                                {item.time}
                              </div>
                           </div>
                           
                           <h3 className="text-lg font-bold leading-snug text-black dark:text-white mb-3 line-clamp-3">
                             {item.title}
                           </h3>
                           
                           {/* Teaser/Snippet */}
                           {item.summary && (
                             <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 mb-4">
                               {item.summary}
                             </p>
                           )}
                         </div>

                         <div className="pt-4 border-t border-dashed border-black/5 dark:border-white/10 mt-auto flex items-center justify-between">
                            <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">
                               <Newspaper size={12} className="mr-1.5" />
                               {item.source || 'Source'}
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleReadSummary(item); }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-semibold transition-all duration-300"
                                >
                                    <Sparkles size={12} />
                                    Quick Read
                                </button>
                                
                                {safeUrl && (
                                    <a 
                                        href={safeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1.5 rounded-full text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                         </div>
                      </GlassCard>
                    );
                 })
              ) : (
                <div className="col-span-1 md:col-span-3 py-20 text-center flex flex-col items-center">
                   <span className="text-gray-400 font-medium mb-2">No news found for {selectedCategory}.</span>
                   <button onClick={() => setSelectedCategory('All')} className="text-blue-500 text-sm underline">Reset Filters</button>
                </div>
              )}
           </div>
        </div>

        {/* Read Mode Modal */}
        <GlassModal isOpen={!!readingArticle} onClose={closeReadMode} title="Quick Summary">
           {readingArticle && (
             <div className="space-y-8 pt-2">
                {/* Minimal Header */}
                <div className="border-b border-black/5 dark:border-white/5 pb-6">
                   <div className="flex items-center gap-3 mb-4">
                      <span className="px-2 py-1 rounded border border-black/10 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
                        {readingArticle.category}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        {readingArticle.source}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">{readingArticle.time}</span>
                   </div>
                   <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white leading-tight">
                     {readingArticle.title}
                   </h2>
                </div>

                {/* AI Summary Content */}
                <div className="space-y-8 min-h-[200px]">
                  {loadingSummary ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400 space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-black dark:text-white" />
                      <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Analyzing Article...</span>
                    </div>
                  ) : summary ? (
                    <div className="space-y-8 animate-fade-in">
                       
                       {/* Why It Matters */}
                       <div className="p-5 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                          <div className="flex items-center gap-2 mb-3 text-black dark:text-white font-bold text-xs uppercase tracking-widest">
                            <Sparkles size={14} /> Why It Matters
                          </div>
                          <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                            {summary.whyItMatters}
                          </p>
                       </div>

                       {/* Bullet Points */}
                       <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Key Details</h4>
                          <ul className="space-y-4">
                            {summary.points.map((point, idx) => (
                              <li key={idx} className="flex gap-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                <ArrowRight size={16} className="mt-1.5 shrink-0 text-black dark:text-white" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                       </div>
                    </div>
                  ) : (
                    <div className="text-center text-red-400">Failed to load summary.</div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-6 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row gap-3">
                   <a 
                     href={getSafeUrl(readingArticle.url) || '#'} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex-1 py-4 px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm text-center flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                   >
                     Read Full Article <ExternalLink size={14} />
                   </a>
                   <button 
                     onClick={closeReadMode}
                     className="flex-1 py-4 px-6 rounded-xl bg-gray-100 dark:bg-white/5 text-black dark:text-white font-bold text-sm text-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                   >
                     Close
                   </button>
                </div>
             </div>
           )}
        </GlassModal>

      </div>
      
      <footer className="w-full py-8 border-t border-black/5 dark:border-white/5 mt-auto">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-gray-400 uppercase tracking-wider">
            <span>&copy; {new Date().getFullYear()} Naijpedia Inc.</span>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">API</a>
            </div>
         </div>
      </footer>
    </div>
  );
};