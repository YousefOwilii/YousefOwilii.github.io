"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="container mx-auto px-6 py-6">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          YO
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
            Home
          </Link>
          <Link href="#about" className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
            About
          </Link>
          <Link href="#projects" className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
            Projects
          </Link>
          <Link href="#contact" className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
            Contact
          </Link>
          <ThemeToggle />
        </div>
        
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button 
            onClick={toggleMenu}
            className="ml-4 text-gray-800 dark:text-white"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 absolute left-4 right-4 z-10">
          <div className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="#about" 
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="#projects" 
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              href="#contact" 
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 