'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ExactAIventScrollingBanner() {
  const bannerItems = [
    'Next Intelligence',
    'Future Now',
    'Empowering Innovation',
    'Smarter Tomorrow',
    'Think Forward',
    'Cognitive Shift'
  ];

  return (
    <section className="relative py-8 overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
      {/* Top Banner */}
      <div className="relative">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [0, -1920] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Duplicate the items to create seamless loop */}
          {[...bannerItems, ...bannerItems, ...bannerItems].map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-2xl md:text-3xl font-bold text-white mx-8">
                {item}
              </span>
              <span className="text-2xl md:text-3xl text-white/60 mx-4">/</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Banner - Reverse Direction */}
      <div className="relative mt-4">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [-1920, 0] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Duplicate the items to create seamless loop */}
          {[...bannerItems, ...bannerItems, ...bannerItems].map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-2xl md:text-3xl font-bold text-white mx-8">
                {item}
              </span>
              <span className="text-2xl md:text-3xl text-white/60 mx-4">/</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-indigo-600 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-pink-600 to-transparent z-10" />
    </section>
  );
}
