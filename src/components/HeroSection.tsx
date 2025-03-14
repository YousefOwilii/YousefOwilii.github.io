'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import TypewriterEffect with client-side rendering only
const TypewriterEffect = dynamic(() => import('./TypewriterEffect'), {
  ssr: false,
  loading: () => <span className="text-blue-600 dark:text-blue-400">Loading...</span>
});

export default function HeroSection() {
  return (
    <section className="container mx-auto px-6 py-16 md:py-24">
      <div className="w-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Hi, I'm <span className="text-blue-600 dark:text-blue-400">Yousef Owili</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          <TypewriterEffect 
            strings={[
              "AI Agents Developer",
              "Copywriter",
              "Full Stack Developer",
              "SwiftUI App Developer",
              "Videographer"
            ]}
          />
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          A jack of all trades can be a master of all.
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="#contact" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Get in Touch
          </a>
          <a 
            href="#projects" 
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400 text-gray-800 dark:text-white font-medium rounded-lg transition"
          >
            View My Work
          </a>
        </div>
      </div>
    </section>
  );
} 