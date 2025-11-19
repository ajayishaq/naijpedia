import React from 'react';
import { Logo } from './Logo';
import { Sun, Moon, Menu, Grid3X3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleTheme: () => void;
  theme: 'dark' | 'light';
}

export const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="hover:opacity-70 transition-opacity duration-300 block">
          <Logo className="origin-left transform scale-90" />
        </Link>
        
        <nav className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-black/5 dark:border-white/10 flex items-center justify-center text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95"
            >
              {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
            </button>
            <button className="w-10 h-10 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-black/5 dark:border-white/10 flex items-center justify-center text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95">
               <Grid3X3 size={18} strokeWidth={2} />
            </button>
        </nav>
      </div>
    </header>
  );
};