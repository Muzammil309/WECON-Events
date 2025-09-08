'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, Users, Presentation } from 'lucide-react';

interface AboutSectionProps {
  subtitle?: string;
  title?: string;
  description?: string;
  features?: string[];
}

export default function AboutSection({
  subtitle = "[ About the Event ]",
  title = "A Global Gathering of AI Innovators",
  description = "Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.",
  features = [
    "5 days of keynotes, workshops, and networking",
    "50+ world-class speakers",
    "Startup showcase and live demos"
  ]
}: AboutSectionProps) {
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

  return (
    <section id="section-about" className="section bg-primary-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Subtitle */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 bg-surface-primary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-8"
          >
            {subtitle}
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-8 leading-tight"
          >
            {title}
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Features List */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center justify-center md:justify-start gap-4 p-6 bg-surface-primary border border-border-primary rounded-xl hover:bg-surface-secondary transition-colors duration-300"
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-text-secondary font-medium text-center md:text-left">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto"
          >
            {[
              { icon: <Calendar className="w-6 h-6" />, number: "5", label: "Days" },
              { icon: <Users className="w-6 h-6" />, number: "50+", label: "Speakers" },
              { icon: <Presentation className="w-6 h-6" />, number: "100+", label: "Sessions" },
              { icon: <Users className="w-6 h-6" />, number: "1000+", label: "Attendees" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-text-muted font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
