'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Presentation, Lightbulb } from 'lucide-react';

export default function ExactAIventAbout() {
  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      text: "5 days of keynotes, workshops, and networking"
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: "50 world-class speakers"
    },
    {
      icon: <Presentation className="w-6 h-6" />,
      text: "Startup showcase and live demos"
    }
  ];

  return (
    <section 
      id="section-about"
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 mb-6 rounded-full glass-effect border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-indigo-300 text-sm font-medium tracking-wider uppercase">
                About the Event
              </span>
            </motion.div>
            
            <motion.h2
              className="text-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              A Global Gathering of{' '}
              <span className="gradient-text">AI Innovators</span>
            </motion.h2>
            
            <motion.p
              className="text-xl text-white/80 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.
            </motion.p>

            {/* Features List */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <span className="text-lg text-white/90 font-medium">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Visual Element */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Main Visual Container */}
            <div className="relative">
              {/* Central Orb */}
              <motion.div
                className="relative mx-auto w-80 h-80 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.6) 50%, rgba(16, 21, 62, 0.8) 100%)'
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                }}
              >
                {/* Inner Glow */}
                <div 
                  className="absolute inset-4 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)'
                  }}
                />
                
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, -360] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  >
                    <Lightbulb className="w-16 h-16 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Orbiting Elements */}
              {Array.from({ length: 8 }).map((_, index) => {
                const angle = (index * 45) * (Math.PI / 180);
                const radius = 180;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.div
                    key={index}
                    className="absolute w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      marginLeft: '-8px',
                      marginTop: '-8px'
                    }}
                    animate={{
                      x: [x, x * 1.2, x],
                      y: [y, y * 1.2, y],
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 3 + index * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  />
                );
              })}

              {/* Connecting Lines */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ transform: 'translate(-10%, -10%)' }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
                    <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
                  </linearGradient>
                </defs>
                {Array.from({ length: 4 }).map((_, index) => (
                  <motion.line
                    key={index}
                    x1="50%"
                    y1="50%"
                    x2={`${50 + Math.cos(index * 90 * Math.PI / 180) * 30}%`}
                    y2={`${50 + Math.sin(index * 90 * Math.PI / 180) * 30}%`}
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: index * 0.3 }}
                  />
                ))}
              </svg>
            </div>

            {/* Floating Text Elements */}
            <motion.div
              className="absolute -top-8 -left-8 glass-effect px-4 py-2 rounded-full border border-white/20"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-sm text-white/80 font-medium">Innovation</span>
            </motion.div>

            <motion.div
              className="absolute -bottom-8 -right-8 glass-effect px-4 py-2 rounded-full border border-white/20"
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <span className="text-sm text-white/80 font-medium">Future</span>
            </motion.div>

            <motion.div
              className="absolute top-1/2 -right-16 glass-effect px-4 py-2 rounded-full border border-white/20"
              animate={{ x: [-10, 10, -10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <span className="text-sm text-white/80 font-medium">AI</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
