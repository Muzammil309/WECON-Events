'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AIventHeroPixelPerfect() {
  const [timeLeft, setTimeLeft] = useState({
    days: 90,
    hours: 18,
    minutes: 22,
    seconds: 1
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
      id="section-hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #764DF0 0%, #442490 25%, #101435 50%, #1A1C26 75%, #0F0B1F 100%)',
        fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
      }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="/assets/aivent-extracted/videos/2.mp4" type="video/mp4" />
          {/* Fallback for missing video */}
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(45deg, rgba(118, 77, 240, 0.1) 0%, rgba(68, 36, 144, 0.1) 100%)',
              backgroundSize: '50px 50px',
              backgroundImage: `
                linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%)
              `
            }}
          />
        </video>
        
        {/* Gradient Overlays - Exact AIvent Style */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(118, 77, 240, 0.6) 0%, rgba(16, 20, 53, 0.8) 100%)'
          }}
        />
        
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(118, 77, 240, 0.3) 0%, rgba(15, 11, 31, 0.9) 70%)'
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-20">
          
          {/* Left Side - Main Content */}
          <motion.div
            className="w-full lg:w-3/5 text-center lg:text-left mb-12 lg:mb-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Subtitle */}
            <motion.div
              className="inline-block px-6 py-2 mb-8 rounded-full border border-purple-400/30"
              style={{
                background: 'rgba(118, 77, 240, 0.15)',
                backdropFilter: 'blur(10px)'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="text-purple-200 text-sm font-medium tracking-wider uppercase">
                [ The Future of Intelligence ]
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-none tracking-tight"
              style={{
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.02em'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              AI SUMMIT
              <br />
              <span 
                className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent"
              >
                2025
              </span>
            </motion.h1>

            {/* Event Details */}
            <motion.div
              className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {/* Date */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-white">October 1–5, 2025</h4>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-white">San Francisco, CA</h4>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.button
                className="px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 group"
                style={{
                  background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
                  boxShadow: '0 10px 30px rgba(118, 77, 240, 0.4)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 15px 40px rgba(118, 77, 240, 0.6)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Get Tickets
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </motion.button>

              <motion.button
                className="px-8 py-4 rounded-full text-white font-bold text-lg border-2 border-white/20 hover:border-purple-400 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  background: 'rgba(118, 77, 240, 0.2)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                View Schedule
                <span className="ml-2">📅</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side - Countdown & Info */}
          <motion.div
            className="w-full lg:w-2/5 lg:pl-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {/* Countdown Section */}
            <div
              className="p-8 rounded-3xl border border-purple-400/20 mb-8"
              style={{
                background: 'rgba(118, 77, 240, 0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-white mb-2">Hurry Up!</h2>
                <h4 className="text-lg text-purple-200">Book Your Seat Now</h4>
              </div>

              {/* Countdown Timer */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  >
                    <div
                      className="w-full h-16 rounded-xl flex items-center justify-center mb-2"
                      style={{
                        background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
                        boxShadow: '0 8px 25px rgba(118, 77, 240, 0.3)'
                      }}
                    >
                      <span className="text-2xl font-black text-white">
                        {item.value.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-sm text-purple-200 font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Venue Info */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-white">
                  121 AI Blvd, San Francisco BCA 94107
                </h4>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-lg"
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      
      <motion.div
        className="absolute top-40 right-32 w-24 h-24 border border-purple-400/20 rounded-full"
        animate={{ 
          y: [-20, 20, -20],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      <motion.div
        className="absolute bottom-32 left-1/4 w-16 h-16 border border-pink-400/20 rounded-lg"
        animate={{ 
          rotate: -360,
          x: [0, 30, 0]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </section>
  );
}
