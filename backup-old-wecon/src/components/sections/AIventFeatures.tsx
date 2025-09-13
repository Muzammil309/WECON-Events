'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Code,
  Users,
  Rocket,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Target
} from 'lucide-react';

export default function AIventFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const features = [
    {
      icon: <Brain className="w-7 h-7" />,
      title: "Cutting-Edge Knowledge",
      description: "Stay ahead with insights from AI leaders shaping tomorrow's technology landscape."
    },
    {
      icon: <Code className="w-7 h-7" />,
      title: "Hands-On Learning",
      description: "Join live workshops and labs to build practical skills in AI and machine learning."
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Global Networking",
      description: "Connect with developers, founders, and researchers from around the world."
    },
    {
      icon: <Rocket className="w-7 h-7" />,
      title: "Startup Showcase",
      description: "Explore the latest AI tools and ideas from promising startups and research labs."
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Career Growth",
      description: "Access exclusive job fairs, mentorship sessions, and recruiting opportunities."
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Ethics & Future",
      description: "Engage in vital conversations around AI ethics, policy, and responsible innovation."
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Innovation Labs",
      description: "Experience cutting-edge demos and prototype testing in our innovation spaces."
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: "Global Impact",
      description: "Learn how AI is solving real-world problems across industries and continents."
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "Strategic Insights",
      description: "Gain actionable strategies for implementing AI solutions in your organization."
    }
  ];

  return (
    <section
      id="why-attend"
      className="relative py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1A1B3A 0%, #0F0B1F 50%, #1A1B3A 100%)',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Complex Background Pattern - Exact AIvent Style */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px),
              linear-gradient(180deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />

        {/* Floating elements */}
        <motion.div
          className="absolute top-32 right-32 w-24 h-24 border border-white/10 rotate-12"
          animate={{
            rotate: [12, 102, 12],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
            backdropFilter: 'blur(10px)'
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header - Exact AIvent Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div
            className="inline-flex items-center px-5 py-2 rounded-full text-sm font-medium mb-8"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              color: '#A5B4FC'
            }}
          >
            Why Attend
          </div>

          <h2
            className="text-white font-black mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            What You'll{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Gain
            </span>
          </h2>

          <p
            className="text-white/80 leading-relaxed"
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Hear from global AI pioneers, industry disruptors, and bold thinkers shaping the future across every domain.
          </p>
        </motion.div>

        {/* Features Grid - Exact AIvent Style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-8 rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
              whileHover={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)'
              }}
            >
              {/* Icon - Exact AIvent Style */}
              <motion.div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                }}
                whileHover={{
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)'
                }}
              >
                {feature.icon}
              </motion.div>

              {/* Content - Exact AIvent Typography */}
              <h3
                className="text-white font-bold mb-4 group-hover:text-blue-300 transition-colors duration-300"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: 1.3
                }}
              >
                {feature.title}
              </h3>

              <p
                className="text-white/70 leading-relaxed"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  lineHeight: 1.6
                }}
              >
                {feature.description}
              </p>

              {/* Hover effect line - Exact AIvent Style */}
              <div
                className="w-0 h-0.5 mt-6 group-hover:w-full transition-all duration-500"
                style={{
                  background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)'
                }}
              ></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
