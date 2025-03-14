import React from 'react';

interface StylizedQuoteProps {
  children: React.ReactNode;
  author?: string;
  className?: string;
}

export default function StylizedQuote({ 
  children, 
  author, 
  className = '' 
}: StylizedQuoteProps) {
  return (
    <div className={`relative p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md ${className}`}>
      {/* Large quote mark at top left */}
      <div className="absolute top-4 left-4 text-6xl text-blue-200 dark:text-blue-900 opacity-50 font-serif">
        "
      </div>
      
      {/* Content with proper padding to avoid overlap with quote marks */}
      <div className="relative z-10 pl-6 pr-6 text-gray-700 dark:text-gray-300">
        {children}
      </div>
      
      {/* Large quote mark at bottom right */}
      <div className="absolute bottom-4 right-4 text-6xl text-blue-200 dark:text-blue-900 opacity-50 font-serif">
        "
      </div>
      
      {/* Author attribution if provided */}
      {author && (
        <div className="mt-4 text-right text-gray-500 dark:text-gray-400 italic">
          — {author}
        </div>
      )}
    </div>
  );
} 