import React, { useState } from 'react';
import { Search, Mic, Command } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  centered?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialValue = "", centered = false }) => {
  const [val, setVal] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim()) onSearch(val);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative group w-full transition-all duration-500 ${centered ? 'max-w-2xl scale-100 hover:scale-[1.02]' : 'max-w-4xl'}`}
    >
      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-300" strokeWidth={2.5} />
      </div>
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className={`
          block w-full pl-14 pr-14 py-6
          bg-white/60 dark:bg-[#1c1c1e]/60
          backdrop-blur-2xl
          border border-black/5 dark:border-white/10
          rounded-[24px]
          text-xl font-medium text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600
          focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-black/10 dark:focus:border-white/20 focus:outline-none focus:bg-white/80 dark:focus:bg-[#2c2c2e]
          shadow-lg dark:shadow-2xl
          transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        `}
        placeholder="Search Naijpedia..."
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
        {centered && (
          <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg border border-black/5 dark:border-white/10 text-xs text-gray-400 dark:text-gray-600 font-medium">
            <Command size={12} />
          </div>
        )}
        <button 
          type="button" 
          className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Mic className="h-5 w-5 text-black dark:text-white opacity-50 hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </form>
  );
};