'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollingBannerProps {
  texts?: string[];
  speed?: number;
  className?: string;
}

export default function ScrollingBanner({
  texts = [
    "Next Intelligence",
    "Future Now", 
    "Empowering Innovation",
    "Smarter Tomorrow",
    "Think Forward",
    "Cognitive Shift",
    "AI Revolution",
    "Digital Transformation"
  ],
  speed = 50,
  className = ""
}: ScrollingBannerProps) {
  // Create the scrolling text by repeating the array
  const scrollingText = [...texts, ...texts, ...texts].join(" / ");

  return (
    <section className={`py-8 bg-surface-primary border-y border-border-primary overflow-hidden ${className}`}>
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface-primary to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface-primary to-transparent z-10" />
        
        {/* Scrolling container */}
        <div className="flex whitespace-nowrap">
          <motion.div
            className="flex items-center gap-8 text-2xl md:text-3xl font-bold text-text-primary"
            animate={{
              x: [0, -1000]
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {scrollingText}
          </motion.div>
          
          {/* Duplicate for seamless loop */}
          <motion.div
            className="flex items-center gap-8 text-2xl md:text-3xl font-bold text-text-primary ml-8"
            animate={{
              x: [0, -1000]
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {scrollingText}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Alternative implementation with CSS animations for better performance
export function ScrollingBannerCSS({
  texts = [
    "Next Intelligence",
    "Future Now", 
    "Empowering Innovation",
    "Smarter Tomorrow",
    "Think Forward",
    "Cognitive Shift"
  ],
  className = ""
}: ScrollingBannerProps) {
  const scrollingText = texts.join(" / ");

  return (
    <section className={`py-8 bg-surface-primary border-y border-border-primary overflow-hidden ${className}`}>
      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface-primary to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface-primary to-transparent z-10" />
        
        {/* CSS Animation Scrolling */}
        <div className="scrolling-banner-container">
          <div className="scrolling-banner-content">
            <span className="scrolling-banner-text">
              {scrollingText} / {scrollingText} / {scrollingText}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrolling-banner-container {
          display: flex;
          white-space: nowrap;
        }
        
        .scrolling-banner-content {
          display: flex;
          animation: scroll-left 60s linear infinite;
        }
        
        .scrolling-banner-text {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-primary);
          padding-right: 2rem;
        }
        
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @media (max-width: 768px) {
          .scrolling-banner-text {
            font-size: 1.5rem;
          }
        }
        
        /* Pause animation on hover */
        .scrolling-banner-container:hover .scrolling-banner-content {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
