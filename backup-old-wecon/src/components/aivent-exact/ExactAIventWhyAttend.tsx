'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Wrench, Users, Rocket, TrendingUp, Shield } from 'lucide-react';

export default function ExactAIventWhyAttend() {
  const reasons = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Cutting-Edge Knowledge",
      description: "Stay ahead of the curve with insights from AI leaders shaping tomorrow's technology."
    },
    {
      icon: <Wrench className="w-8 h-8" />,
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
    <section 
      id="section-why-attend"
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
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
              Why Attend
            </span>
          </motion.div>
          
          <motion.h2
            className="text-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            What You'll <span className="gradient-text">Gain</span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Hear from global AI pioneers, industry disruptors, and bold thinkers shaping the future across every domain.
          </motion.p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="glass-effect p-8 rounded-2xl border border-white/10 h-full transition-all duration-500 group-hover:border-indigo-400/40 group-hover:bg-white/10">
                {/* Icon */}
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <div className="text-white">
                    {reason.icon}
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors duration-300">
                  {reason.title}
                </h3>
                
                <p className="text-white/70 leading-relaxed">
                  {reason.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="btn-primary px-8 py-4 rounded-full text-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join the Summit
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
