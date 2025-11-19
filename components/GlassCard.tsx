import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick, hoverEffect = true }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-white/80 dark:bg-[#1c1c1e]/60
        glass-panel
        border border-white/50 dark:border-white/10
        shadow-[0_4px_24px_-1px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_24px_-1px_rgba(0,0,0,0.5)]
        rounded-2xl
        transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${hoverEffect ? 'hover:bg-white dark:hover:bg-[#2c2c2e]/80 hover:scale-[1.02] hover:shadow-2xl cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};