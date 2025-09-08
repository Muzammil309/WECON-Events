'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Code, 
  Users, 
  Rocket, 
  TrendingUp, 
  Shield 
} from 'lucide-react';

export default function AIventFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        duration: 0.6,
        ease: [0.6, 0.03, 0.28, 0.98]
      }
    }
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Cutting-Edge Knowledge",
      description: "Stay ahead of the curve with insights from AI leaders shaping tomorrow's technology."
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Hands-On Learning",
      description: "Join live workshops and labs to build practical skills in AI and machine learning."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Global Networking",
      description: "Meet developers, founders, and researchers from around the world to collaborate and grow."
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Startup Showcase",
      description: "Explore the latest AI tools and ideas from promising startups and research labs."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "AI Career Boost",
      description: "Access exclusive job fairs, mentorship sessions, and recruiting events to grow your career."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Ethics & Future",
      description: "Engage in vital conversations around AI ethics, policy, and the future of intelligence."
    }
  ];

  return (
    <section id="why-attend" className="section bg-primary-bg relative overflow-hidden" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-surface-primary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6">
            Why Attend
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold text-text-primary mb-6"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.015em'
            }}
          >
            What You'll Gain
          </h2>

          <p
            className="text-lg text-text-secondary leading-relaxed"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Hear from global AI pioneers, industry disruptors, and bold thinkers shaping the future across every domain.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-surface-primary border border-border-primary rounded-2xl p-8 hover:bg-surface-secondary hover:border-border-secondary transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <h3
                className="text-xl font-semibold text-text-primary mb-4 group-hover:text-accent-blue transition-colors duration-300"
                style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600 }}
              >
                {feature.title}
              </h3>

              <p
                className="text-text-secondary leading-relaxed"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                {feature.description}
              </p>

              {/* Hover effect line */}
              <div className="w-0 h-0.5 bg-gradient-to-r from-accent-blue to-accent-purple mt-6 group-hover:w-full transition-all duration-500"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
