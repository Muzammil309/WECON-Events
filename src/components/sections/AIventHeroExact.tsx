'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function AIventHeroExact() {
  // Countdown timer state - exact from reference
  const [timeLeft, setTimeLeft] = useState<CountdownState>({
    days: 25,
    hours: 14,
    minutes: 32,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, #6366F1 0%, #4F46E5 25%, #3730A3 50%, #312E81 75%, #1E1B4B 100%),
          radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)
        `,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Complex 3D Geometric Background Pattern - Exact AIvent Style */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main geometric pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(30deg, transparent 40%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.1) 60%, transparent 60%),
              linear-gradient(150deg, transparent 40%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, transparent 60%),
              linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.03) 60%, transparent 60%)
            `,
            backgroundSize: '120px 120px, 80px 80px, 60px 60px'
          }}
        />
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rotate-45"
          animate={{
            rotate: [45, 135, 45],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-white/15 rotate-12"
          animate={{
            rotate: [12, 102, 12],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
            backdropFilter: 'blur(8px)'
          }}
        />

        {/* Particle system */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
          {/* Left Column - Main Content - Exact AIvent Layout */}
          <motion.div 
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Subtitle - Exact styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span
                className="inline-block text-white/90 tracking-widest uppercase font-medium"
                style={{
                  fontSize: '13px',
                  letterSpacing: '3px',
                  fontWeight: 500
                }}
              >
                The Future of Intelligence
              </span>
            </motion.div>

            {/* Main Title - Exact AIvent Typography */}
            <motion.h1
              className="text-white font-black leading-none"
              style={{
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: '-0.03em',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              AI Summit 2025
            </motion.h1>

            {/* Event Details Pills - Exact AIvent Style */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div 
                className="flex items-center gap-3 px-6 py-3 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-sm">
                  October 1–5, 2025
                </span>
              </div>
              <div 
                className="flex items-center gap-3 px-6 py-3 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-sm">
                  San Francisco, CA
                </span>
              </div>
            </motion.div>

            {/* CTA Buttons - Exact AIvent Style */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button
                className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl transition-all duration-300"
                style={{
                  fontSize: '12px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  boxShadow: '0 8px 32px rgba(255,255,255,0.3)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 12px 40px rgba(255,255,255,0.4)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                Get Tickets
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl transition-all duration-300"
                style={{
                  fontSize: '12px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  background: 'rgba(255, 255, 255, 0.2)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                View Schedule
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Countdown & Info Cards - Exact AIvent Style */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Countdown Timer Card - Exact AIvent Glass-morphism */}
            <motion.div
              className="p-8 rounded-3xl"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="text-center mb-8">
                <h3 className="text-white font-bold text-xl mb-2">
                  Hurry Up!
                </h3>
                <p className="text-white/80 text-sm">
                  Book Your Seat Now
                </p>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {[
                  { value: timeLeft.days.toString().padStart(2, '0'), label: 'Days' },
                  { value: timeLeft.hours.toString().padStart(2, '0'), label: 'Hours' },
                  { value: timeLeft.minutes.toString().padStart(2, '0'), label: 'Minutes' },
                  { value: timeLeft.seconds.toString().padStart(2, '0'), label: 'Seconds' }
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    <div
                      className="rounded-2xl p-4 text-center mb-2"
                      style={{
                        background: 'rgba(255, 255, 255, 1)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                      }}
                    >
                      <div className="text-3xl font-black text-gray-900 mb-1">
                        {item.value}
                      </div>
                    </div>
                    <div className="text-xs text-white/80 uppercase tracking-wider font-medium">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Location Info Card - Exact AIvent Style */}
            <motion.div
              className="p-6 rounded-3xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white text-sm font-medium">
                121 AI Blvd, San Francisco BCA 94107
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
