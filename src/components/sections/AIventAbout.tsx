'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Users, Calendar, Award } from 'lucide-react';

export default function AIventAbout() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.03, 0.28, 0.98]
      }
    }
  };

  const stats = [
    { icon: Users, number: "500+", label: "Attendees" },
    { icon: Calendar, number: "5", label: "Days" },
    { icon: Award, number: "50+", label: "Speakers" }
  ];

  const features = [
    "Cutting-edge AI research presentations",
    "Hands-on workshops and technical sessions",
    "Networking with industry leaders",
    "Startup showcase and innovation demos"
  ];

  return (
    <section
      id="about"
      className="relative py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0F0B1F 0%, #1A1B3A 50%, #0F0B1F 100%)',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Complex Background Pattern - Exact AIvent Style */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(180deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 border border-white/10 rotate-45"
          animate={{
            rotate: [45, 135, 45],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
            backdropFilter: 'blur(10px)'
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content - Exact AIvent Style */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Subtitle - Exact AIvent Style */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-5 py-2 rounded-full text-sm font-medium"
              style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                color: '#A5B4FC'
              }}
            >
              About the Event
            </motion.div>

            {/* Title - Exact AIvent Typography */}
            <motion.h2
              variants={itemVariants}
              className="text-white font-black leading-tight"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              A Global Gathering of{' '}
              <span
                className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                AI Innovators
              </span>
            </motion.h2>

            {/* Description - Exact AIvent Style */}
            <motion.p
              variants={itemVariants}
              className="text-white/80 leading-relaxed"
              style={{
                fontSize: '18px',
                lineHeight: 1.7,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.
            </motion.p>

            {/* Features List - Exact AIvent Style */}
            <motion.div
              variants={containerVariants}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-4"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span
                    className="text-white/90 font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Stats Cards - Exact AIvent Style */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-1 gap-6">
              {/* Stats Cards */}
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div
                        className="text-white font-black text-2xl"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {stat.number}
                      </div>
                      <div
                        className="text-white/70 text-sm font-medium"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Central AI Visual Element */}
              <motion.div
                variants={itemVariants}
                className="relative p-8 rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute top-1/2 left-1/2 w-32 h-32 border border-white/20 rounded-full"
                    style={{ transform: 'translate(-50%, -50%)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute top-1/2 left-1/2 w-20 h-20 border border-white/10 rounded-full"
                    style={{ transform: 'translate(-50%, -50%)' }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                {/* Central content */}
                <div className="relative z-10 text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
                    }}
                  >
                    <span
                      className="text-2xl font-black"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      AI
                    </span>
                  </div>
                  <h3
                    className="text-lg font-bold text-white mb-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Future of Intelligence
                  </h3>
                  <p
                    className="text-white/70 text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Shaping Tomorrow's Technology
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
