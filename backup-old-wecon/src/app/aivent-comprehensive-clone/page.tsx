'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Import all comprehensive components
import ComprehensiveNavigation from '@/components/aivent-comprehensive/ComprehensiveNavigation';
import ComprehensiveHero from '@/components/aivent-comprehensive/ComprehensiveHero';
import ComprehensiveAbout from '@/components/aivent-comprehensive/ComprehensiveAbout';
import ComprehensiveMarquee from '@/components/aivent-comprehensive/ComprehensiveMarquee';
import ComprehensiveWhyAttend from '@/components/aivent-comprehensive/ComprehensiveWhyAttend';
import ComprehensiveQuote from '@/components/aivent-comprehensive/ComprehensiveQuote';
import ComprehensiveSpeakers from '@/components/aivent-comprehensive/ComprehensiveSpeakers';
import ComprehensiveSchedule from '@/components/aivent-comprehensive/ComprehensiveSchedule';
import ComprehensiveTickets from '@/components/aivent-comprehensive/ComprehensiveTickets';
import ComprehensiveVenue from '@/components/aivent-comprehensive/ComprehensiveVenue';
import ComprehensiveFAQ from '@/components/aivent-comprehensive/ComprehensiveFAQ';
import ComprehensiveNewsletter from '@/components/aivent-comprehensive/ComprehensiveNewsletter';
import ComprehensiveFooter from '@/components/aivent-comprehensive/ComprehensiveFooter';

export default function AIventComprehensiveClonePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Global Styles - Exact AIvent Replication */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
          font-size: 16px;
        }
        
        body {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #000;
          color: #fff;
          overflow-x: hidden;
          line-height: 1.6;
          font-weight: 400;
        }
        
        /* Exact AIvent Color Scheme */
        :root {
          --primary-color: #6366f1;
          --secondary-color: #8b5cf6;
          --accent-color: #ec4899;
          --background-dark: #0a0a0a;
          --background-darker: #050505;
          --surface-color: #1a1a1a;
          --text-primary: #ffffff;
          --text-secondary: rgba(255, 255, 255, 0.8);
          --text-muted: rgba(255, 255, 255, 0.6);
          --border-color: rgba(255, 255, 255, 0.1);
          --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          --gradient-secondary: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          --gradient-background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
        }
        
        /* Custom Scrollbar - Exact AIvent Style */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: var(--gradient-primary);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: var(--gradient-secondary);
        }
        
        /* Selection Styles */
        ::selection {
          background: rgba(99, 102, 241, 0.3);
          color: white;
        }
        
        /* Typography - Exact AIvent Hierarchy */
        .text-hero {
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          line-height: 0.9;
          letter-spacing: -0.02em;
        }
        
        .text-display {
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }
        
        .text-heading {
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          line-height: 1.3;
        }
        
        .text-body {
          font-family: 'Manrope', sans-serif;
          font-weight: 400;
          line-height: 1.6;
        }
        
        /* Glass Morphism Effects - Exact AIvent Style */
        .glass-effect {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .glass-effect-strong {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
        }
        
        /* Gradient Text Effects */
        .gradient-text {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-text-secondary {
          background: var(--gradient-secondary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Button Styles - Exact AIvent Design */
        .btn-primary {
          background: var(--gradient-primary);
          border: none;
          color: white;
          font-weight: 600;
          font-family: 'Manrope', sans-serif;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.4);
        }
        
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .btn-primary:hover::before {
          left: 100%;
        }
        
        .btn-secondary {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-weight: 600;
          font-family: 'Manrope', sans-serif;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .btn-secondary:hover {
          border-color: var(--primary-color);
          background: rgba(99, 102, 241, 0.1);
          transform: translateY(-2px);
        }
        
        /* Animation Keyframes - Exact AIvent Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes marquee-reverse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        
        /* Utility Animation Classes */
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slideInUp 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-rotate {
          animation: rotate 20s linear infinite;
        }
        
        /* Responsive Typography */
        @media (max-width: 768px) {
          .text-hero {
            font-size: 2.5rem !important;
            line-height: 1.1 !important;
          }
          
          .text-display {
            font-size: 2rem !important;
          }
          
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .text-hero {
            font-size: 2rem !important;
          }
          
          .text-display {
            font-size: 1.75rem !important;
          }
        }
        
        /* Background Patterns */
        .bg-pattern-dots {
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .bg-pattern-grid {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        /* Particle Effects */
        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(99, 102, 241, 0.6);
          border-radius: 50%;
          animation: particle-float 15s linear infinite;
        }
        
        @keyframes particle-float {
          0% {
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(100px) rotate(360deg);
            opacity: 0;
          }
        }
        
        /* Loading States */
        .loading-shimmer {
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0.1) 25%, 
            rgba(255, 255, 255, 0.2) 50%, 
            rgba(255, 255, 255, 0.1) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Smooth Transitions */
        .transition-all {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .transition-transform {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .transition-colors {
          transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Particle Background System */}
      {isClient && (
        <div className="particles">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
                background: `rgba(${99 + Math.random() * 40}, ${102 + Math.random() * 40}, 241, ${0.3 + Math.random() * 0.4})`
              }}
            />
          ))}
        </div>
      )}

      {/* Navigation */}
      <ComprehensiveNavigation />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <ComprehensiveHero />

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ComprehensiveAbout />
        </motion.div>

        {/* Scrolling Marquee */}
        <ComprehensiveMarquee />

        {/* Why Attend Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ComprehensiveWhyAttend />
        </motion.div>

        {/* Quote Section */}
        <ComprehensiveQuote />

        {/* Speakers Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ComprehensiveSpeakers />
        </motion.div>

        {/* Schedule Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ComprehensiveSchedule />
        </motion.div>

        {/* Tickets Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ComprehensiveTickets />
        </motion.div>

        {/* Venue Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ComprehensiveVenue />
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ComprehensiveFAQ />
        </motion.div>

        {/* Newsletter Section */}
        <ComprehensiveNewsletter />
      </main>

      {/* Footer */}
      <ComprehensiveFooter />

      {/* Scroll to Top Button */}
      {isClient && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          <motion.button
            className="w-14 h-14 rounded-full btn-primary flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
