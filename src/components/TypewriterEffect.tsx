'use client';

import { useState, useEffect, useRef } from 'react';

interface TypewriterEffectProps {
  strings: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export default function TypewriterEffect({
  strings,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500,
}: TypewriterEffectProps) {
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  
  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);
  
  useEffect(() => {
    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (!strings.length) return;
    
    const currentString = strings[currentIndex];
    
    // If waiting, don't do anything
    if (isWaiting) return;
    
    const timeout = setTimeout(() => {
      // Make sure component is still mounted
      if (!isMounted.current) return;
      
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentString.length) {
          setCurrentText(currentString.substring(0, currentText.length + 1));
        } else {
          // Finished typing, wait before deleting
          setIsWaiting(true);
          setTimeout(() => {
            if (isMounted.current) {
              setIsWaiting(false);
              setIsDeleting(true);
            }
          }, pauseTime);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentString.substring(0, currentText.length - 1));
        } else {
          // Finished deleting, move to next string
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % strings.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex, strings, typingSpeed, deletingSpeed, pauseTime, isWaiting]);
  
  return (
    <span className="inline-block min-h-[1.5em]">
      {currentText}
      <span className="animate-blink">|</span>
    </span>
  );
} 