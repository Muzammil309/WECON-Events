'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AIventNavigationPixelPerfect from '@/components/aivent/AIventNavigationPixelPerfect';
import AIventHeroPixelPerfect from '@/components/aivent/AIventHeroPixelPerfect';
import AIventAbout from '@/components/sections/AIventAbout';
import AIventWhyAttend from '@/components/sections/AIventWhyAttend';
import AIventSpeakersPixelPerfect from '@/components/aivent/AIventSpeakersPixelPerfect';
import AIventSchedule from '@/components/sections/AIventSchedule';
import AIventTicketsPixelPerfect from '@/components/aivent/AIventTicketsPixelPerfect';
import AIventVenue from '@/components/sections/AIventVenue';
import AIventFAQ from '@/components/sections/AIventFAQ';
import AIventFooter from '@/components/layout/AIventFooter';

export default function AIventPixelPerfectPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #101435 0%, #0F0B1F 50%, #1A1C26 100%)',
        fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
      }}
    >
      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        
        * {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Manrope', Helvetica, Arial, sans-serif;
          overflow-x: hidden;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #101435;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #764DF0 0%, #442490 100%);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #8B5CF6 0%, #5B21B6 100%);
        }
        
        /* Selection styles */
        ::selection {
          background: rgba(118, 77, 240, 0.3);
          color: white;
        }
        
        /* Smooth animations */
        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Glass morphism utility */
        .glass-morphism {
          background: rgba(118, 77, 240, 0.1);
          border: 1px solid rgba(118, 77, 240, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        /* Gradient text utility */
        .gradient-text {
          background: linear-gradient(135deg, #764DF0 0%, #E879F9 50%, #764DF0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Button hover effects */
        .btn-primary {
          background: linear-gradient(135deg, #764DF0 0%, #442490 100%);
          box-shadow: 0 10px 30px rgba(118, 77, 240, 0.3);
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(118, 77, 240, 0.4);
        }
        
        /* Floating animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Pulse animation */
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(118, 77, 240, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(118, 77, 240, 0.6);
          }
        }
        
        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        /* Particle background */
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
          background: rgba(118, 77, 240, 0.5);
          border-radius: 50%;
          animation: particle-float 20s linear infinite;
        }
        
        @keyframes particle-float {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(100px);
            opacity: 0;
          }
        }
        
        /* Responsive typography */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem !important;
          }
          
          .hero-subtitle {
            font-size: 1.25rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.5rem !important;
          }
          
          .hero-subtitle {
            font-size: 1rem !important;
          }
        }
      `}</style>

      {/* Particle Background */}
      {isClient && (
        <div className="particles">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Navigation */}
      <AIventNavigationPixelPerfect />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <AIventHeroPixelPerfect />

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <AIventAbout />
        </motion.div>

        {/* Why Attend Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <AIventWhyAttend />
        </motion.div>

        {/* Speakers Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <AIventSpeakersPixelPerfect />
        </motion.div>

        {/* Schedule Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <AIventSchedule />
        </motion.div>

        {/* Tickets Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <AIventTicketsPixelPerfect />
        </motion.div>

        {/* Venue Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <AIventVenue />
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <AIventFAQ />
        </motion.div>
      </main>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <AIventFooter />
      </motion.div>

      {/* Floating Action Button */}
      {isClient && (
        <motion.div
          className="fixed bottom-8 right-8 z-40"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          <motion.button
            className="w-14 h-14 rounded-full text-white font-bold shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
              boxShadow: '0 8px 25px rgba(118, 77, 240, 0.4)'
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: '0 12px 35px rgba(118, 77, 240, 0.6)'
            }}
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
