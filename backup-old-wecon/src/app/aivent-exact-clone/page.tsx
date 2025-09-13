'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ExactAIventNavigation from '@/components/aivent-exact/ExactAIventNavigation';
import ExactAIventHero from '@/components/aivent-exact/ExactAIventHero';
import ExactAIventAbout from '@/components/aivent-exact/ExactAIventAbout';
import ExactAIventScrollingBanner from '@/components/aivent-exact/ExactAIventScrollingBanner';
import ExactAIventWhyAttend from '@/components/aivent-exact/ExactAIventWhyAttend';
import ExactAIventQuote from '@/components/aivent-exact/ExactAIventQuote';
import ExactAIventSpeakers from '@/components/aivent-exact/ExactAIventSpeakers';
import ExactAIventSchedule from '@/components/aivent-exact/ExactAIventSchedule';
import ExactAIventTickets from '@/components/aivent-exact/ExactAIventTickets';
import ExactAIventVenue from '@/components/aivent-exact/ExactAIventVenue';
import ExactAIventFAQ from '@/components/aivent-exact/ExactAIventFAQ';
import ExactAIventNewsletter from '@/components/aivent-exact/ExactAIventNewsletter';
import ExactAIventFooter from '@/components/aivent-exact/ExactAIventFooter';

export default function AIventExactClonePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Global Styles - Exact AIvent Styling */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #000;
          color: #fff;
          overflow-x: hidden;
          line-height: 1.6;
        }
        
        /* Custom scrollbar - Exact AIvent style */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #4f46e5 0%, #7c3aed 100%);
        }
        
        /* Selection styles */
        ::selection {
          background: rgba(99, 102, 241, 0.3);
          color: white;
        }
        
        /* Smooth transitions */
        .transition-all {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Glass morphism effects */
        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Button styles */
        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
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
        
        /* Animation keyframes */
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
        
        /* Utility classes */
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
        
        /* Typography */
        .text-hero {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        
        .text-display {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          line-height: 1.2;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .text-hero {
            font-size: 2.5rem !important;
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
        }
        
        /* Dark theme adjustments */
        .bg-dark-gradient {
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
        }
        
        .bg-purple-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        /* Particle effects */
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
        
        /* Loading states */
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
      `}</style>

      {/* Particle Background */}
      {isClient && (
        <div className="particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Navigation */}
      <ExactAIventNavigation />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <ExactAIventHero />

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ExactAIventAbout />
        </motion.div>

        {/* Scrolling Banner */}
        <ExactAIventScrollingBanner />

        {/* Why Attend Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ExactAIventWhyAttend />
        </motion.div>

        {/* Quote Section */}
        <ExactAIventQuote />

        {/* Speakers Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ExactAIventSpeakers />
        </motion.div>

        {/* Schedule Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ExactAIventSchedule />
        </motion.div>

        {/* Tickets Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ExactAIventTickets />
        </motion.div>

        {/* Venue Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ExactAIventVenue />
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ExactAIventFAQ />
        </motion.div>

        {/* Newsletter Section */}
        <ExactAIventNewsletter />
      </main>

      {/* Footer */}
      <ExactAIventFooter />

      {/* Scroll to Top Button */}
      {isClient && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          <motion.button
            className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            ↑
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
