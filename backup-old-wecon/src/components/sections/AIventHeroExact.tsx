'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AIVENT_ASSETS } from '@/constants/aivent-assets';

export default function AIventHeroExact() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-12-15T09:00:00');
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #764DF0 0%, #442490 25%, #101435 50%, #1A1C26 75%, #0F0B1F 100%)`,
        fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
      }}
    >
      {/* Exact AIvent Background Pattern */}
      <div className="absolute inset-0">
        {/* Geometric Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-lg"
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
          className="absolute top-40 right-32 w-24 h-24 border border-purple-400/30 rounded-full"
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
          className="absolute bottom-32 left-1/4 w-16 h-16"
          style={{ background: 'linear-gradient(45deg, #764DF0, #442490)' }}
          animate={{ 
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Event Badge */}
          <motion.div
            className="inline-block mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span 
              className="px-6 py-2 rounded-full text-sm font-bold text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              DECEMBER 15-17, 2025
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-white mb-6"
            style={{ 
              fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: '1.1'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            AI<span style={{ color: '#764DF0' }}>VENT</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto"
            style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            The Future of Artificial Intelligence Conference
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            className="flex justify-center gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <motion.div
                key={unit}
                className="text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '20px 16px'
                }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
              >
                <div 
                  className="text-3xl md:text-4xl font-bold text-white"
                  style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
                >
                  {value.toString().padStart(2, '0')}
                </div>
                <div 
                  className="text-sm text-white/70 uppercase tracking-wider mt-2"
                  style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
                >
                  {unit}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.button
              className="px-8 py-4 rounded-lg font-bold text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
                boxShadow: '0 8px 24px rgba(118, 77, 240, 0.3)',
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 12px 32px rgba(118, 77, 240, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get Tickets Now
            </motion.button>
            
            <motion.button
              className="px-8 py-4 rounded-lg font-bold text-white transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
              }}
              whileHover={{ 
                scale: 1.05,
                background: 'rgba(255, 255, 255, 0.2)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              View Schedule
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}