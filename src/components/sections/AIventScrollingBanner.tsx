'use client';

import React from 'react';

export default function AIventScrollingBanner() {
  const texts = [
    "Next Intelligence",
    "Future Now",
    "Empowering Innovation", 
    "Smarter Tomorrow",
    "Think Forward",
    "Cognitive Shift"
  ];

  // Create the scrolling text by repeating the array
  const scrollingText = texts.join(" / ");

  return (
    <section className="py-6 bg-surface-primary border-y border-border-primary overflow-hidden">
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface-primary to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface-primary to-transparent z-10" />
        
        {/* Scrolling container with CSS animation */}
        <div className="scrolling-banner-container">
          <div className="scrolling-banner-content">
            <span className="scrolling-banner-text">
              {scrollingText} / {scrollingText} / {scrollingText} / {scrollingText}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrolling-banner-container {
          display: flex;
          white-space: nowrap;
          width: 100%;
        }
        
        .scrolling-banner-content {
          display: flex;
          animation: scroll-left 40s linear infinite;
          will-change: transform;
        }
        
        .scrolling-banner-text {
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--text-primary);
          padding-right: 2rem;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }
        
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        
        @media (max-width: 768px) {
          .scrolling-banner-text {
            font-size: 1.25rem;
          }
          
          .scrolling-banner-content {
            animation-duration: 30s;
          }
        }
        
        @media (max-width: 480px) {
          .scrolling-banner-text {
            font-size: 1rem;
          }
        }
        
        /* Pause animation on hover for accessibility */
        .scrolling-banner-container:hover .scrolling-banner-content {
          animation-play-state: paused;
        }
        
        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .scrolling-banner-content {
            animation: none;
          }
          
          .scrolling-banner-text {
            animation: fade-in-out 3s ease-in-out infinite;
          }
          
          @keyframes fade-in-out {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
        }
      `}</style>
    </section>
  );
}
