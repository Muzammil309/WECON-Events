'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function ExactAIventHero() {
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
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Animated background pattern instead of video for better performance */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
              linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
            `
          }}
        />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          
          {/* Left Side - Main Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Subtitle */}
            <motion.div
              className="inline-flex items-center px-4 py-2 mb-8 rounded-full glass-effect border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="text-indigo-300 text-sm font-medium tracking-wider uppercase">
                The Future of Intelligence
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-hero text-6xl md:text-7xl lg:text-8xl text-white mb-8 leading-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              AI SUMMIT
              <br />
              <span className="gradient-text">2025</span>
            </motion.h1>

            {/* Event Details */}
            <motion.div
              className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {/* Date */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">October 1–5, 2025</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">San Francisco, CA</span>
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
                className="btn-primary px-8 py-4 rounded-full text-lg font-semibold group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Tickets
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </motion.button>

              <motion.button
                className="px-8 py-4 rounded-full text-lg font-semibold border-2 border-white/20 text-white hover:border-indigo-400 hover:bg-white/5 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Schedule
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side - Countdown & Info */}
          <motion.div
            className="flex flex-col items-center lg:items-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {/* Countdown Section */}
            <div className="glass-effect p-8 rounded-3xl border border-white/20 mb-8 w-full max-w-md">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-2xl font-bold text-white">Hurry Up!</h2>
                </div>
                <p className="text-white/70">Book Your Seat Now</p>
              </div>

              {/* Countdown Timer */}
              <div className="grid grid-cols-4 gap-3 mb-6">
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
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-3 mb-2">
                      <span className="text-xl font-bold text-white block">
                        {item.value.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs text-white/70 font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Venue Info */}
            <motion.div
              className="text-center lg:text-right"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <div className="flex items-center justify-center lg:justify-end gap-3 mb-2">
                <MapPin className="w-5 h-5 text-indigo-400" />
                <span className="text-lg font-semibold text-white">
                  121 AI Blvd, San Francisco BCA 94107
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-lg hidden lg:block"
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
        className="absolute top-40 right-32 w-24 h-24 border border-indigo-400/20 rounded-full hidden lg:block"
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
        className="absolute bottom-32 left-1/4 w-16 h-16 border border-purple-400/20 rounded-lg hidden lg:block"
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
