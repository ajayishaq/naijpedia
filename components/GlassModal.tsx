import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const GlassModal: React.FC<GlassModalProps> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl z-10 animate-slide-up">
        <GlassCard className="max-h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl border-white/40 dark:border-white/15" hoverEffect={false}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md">
             <h2 className="text-xl font-bold text-black dark:text-white truncate pr-4">
               {title || 'Details'}
             </h2>
             <button 
               onClick={onClose}
               className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
             >
               <X size={20} className="text-black dark:text-white" />
             </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};