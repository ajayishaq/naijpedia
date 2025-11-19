import React from 'react';

// Basic replacement for markdown rendering to avoid heavy dependencies 
// while keeping the text clean and formatted.
export const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const paragraphs = content.split('\n\n');

  return (
    <div className="space-y-4 text-gray-800 dark:text-gray-200 leading-relaxed">
      {paragraphs.map((p, idx) => {
        // Bold formatting
        const formatted = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // List formatting
        if (p.trim().startsWith('* ') || p.trim().startsWith('- ')) {
             const items = p.split('\n').map(item => item.replace(/^[\*\-]\s/, ''));
             return (
                 <ul key={idx} className="list-disc pl-5 space-y-1">
                     {items.map((li, liIdx) => (
                         <li key={liIdx} dangerouslySetInnerHTML={{ __html: li.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                     ))}
                 </ul>
             );
        }

        return <p key={idx} dangerouslySetInnerHTML={{ __html: formatted }} />;
      })}
    </div>
  );
};