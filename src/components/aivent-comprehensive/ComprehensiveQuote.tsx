'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function ComprehensiveQuote() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with video-like effect */}
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 30% 70%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
              linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)
            `
          }}
        />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Quote Icon */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <Quote className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Quote Text */}
          <motion.blockquote
            className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-relaxed mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            "Artificial intelligence is advancing rapidly, and while it offers immense opportunity, it also poses significant risks. If not properly regulated and aligned with human values, AI could become a fundamental threat to civilization."
          </motion.blockquote>

          {/* Author */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {/* Author Image Placeholder */}
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mb-4 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white font-bold text-xl">EM</span>
            </motion.div>
            
            <cite className="text-xl font-semibold text-white not-italic">
              Elon Musk
            </cite>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full hidden lg:block"
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
            className="absolute bottom-10 right-10 w-24 h-24 border border-indigo-400/20 rounded-lg hidden lg:block"
            animate={{ 
              rotate: -360,
              y: [-10, 10, -10]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </div>
    </section>
  );
}
