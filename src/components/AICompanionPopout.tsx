"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

export default function AICompanionPopout() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen this popout in this session
    const hasSeenPopout = sessionStorage.getItem("aiCompanionPopoutSeen");
    
    if (!hasSeenPopout) {
      // Show popout after a short delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("aiCompanionPopoutSeen", "true");
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleVisitAI = () => {
    setIsOpen(false);
    const aiSection = document.getElementById("ai");
    if (aiSection) {
      aiSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-lg w-full transform transition-all duration-300 animate-in fade-in zoom-in-95 overflow-visible">
          {/* AI Companion Character - Centered above modal */}
          <div className="absolute -top-10 sm:-top-24 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
            <Image
              src="/images/ai-companion.png"
              alt="AI Companion - Joe"
              width={280}
              height={280}
              className="object-cover"
            />
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6 rounded-t-lg flex items-center justify-between relative z-10">
            <h2 className="text-2xl font-bold text-white">Try me!</h2>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              aria-label="Close popout"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-semibold">Meet Joe</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-base mb-6">
              Experience an interactive AI version of me. Ask questions, and get instant responses.
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span className="text-gray-600 dark:text-gray-400">Instant answers to your questions</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span className="text-gray-600 dark:text-gray-400">Reach out to me in a different way</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-pink-500 font-bold">•</span>
                <span className="text-gray-600 dark:text-gray-400">Available 24/7</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Maybe Later
            </button>
            <button
              onClick={handleVisitAI}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Try AI Companion
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
