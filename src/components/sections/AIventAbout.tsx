'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function AIventAbout() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  const features = [
    "5 days of keynotes, workshops, and networking",
    "50 world-class speakers",
    "Startup showcase and live demos"
  ];

  return (
    <section id="about" className="section bg-primary-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Subtitle */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-4 py-2 bg-surface-primary border border-border-primary rounded-full text-sm font-medium text-text-secondary"
            >
              About the Event
            </motion.div>

            {/* Title */}
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-text-primary leading-tight"
            >
              A Global Gathering of AI Innovators
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-text-secondary leading-relaxed"
            >
              Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.
            </motion.p>

            {/* Features List */}
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
                  <div className="w-6 h-6 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-text-secondary font-medium">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Element */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              variants={itemVariants}
              className="relative bg-surface-primary border border-border-primary rounded-2xl p-8 h-96 flex items-center justify-center overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-accent-blue rounded-full blur-2xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-purple rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-border-primary rounded-full" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-border-primary rounded-full" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
              </div>

              {/* Central content */}
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  <span className="text-3xl font-bold">AI</span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Future of Intelligence
                </h3>
                <p className="text-text-muted">
                  Shaping Tomorrow's Technology
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
