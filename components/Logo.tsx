import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-bold text-2xl tracking-tight text-black dark:text-white leading-none">
        Naijpedia
      </span>
    </div>
  );
};