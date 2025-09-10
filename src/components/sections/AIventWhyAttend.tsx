'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getAiventIcon, getAiventImage } from '@/constants/aivent-assets';

export default function AIventWhyAttend() {
  const features = [
    {
      icon: '3',
      title: 'World-Class Speakers',
      description: 'Learn from industry leaders and AI pioneers who are shaping the future of artificial intelligence.'
    },
    {
      icon: '5',
      title: 'Cutting-Edge Technology',
      description: 'Experience the latest AI innovations and breakthrough technologies firsthand.'
    },
    {
      icon: '6',
      title: 'Networking Opportunities',
      description: 'Connect with like-minded professionals, researchers, and entrepreneurs in the AI space.'
    },
    {
      icon: '8',
      title: 'Hands-On Workshops',
      description: 'Participate in interactive sessions and gain practical experience with AI tools and frameworks.'
    },
    {
      icon: '10',
      title: 'Future Insights',
      description: 'Discover emerging trends and get exclusive insights into the future of AI development.'
    },
    {
      icon: '3',
      title: 'Global Community',
      description: 'Join a worldwide community of AI enthusiasts and build lasting professional relationships.'
    }
  ];

  return (
    <section 
      id="section-why-attend"
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #101435 0%, #0F0B1F 50%, #1A1C26 100%)',
        fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(118, 77, 240, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(118, 77, 240, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block px-6 py-2 mb-6 rounded-full border border-purple-500/30"
            style={{
              background: 'rgba(118, 77, 240, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span className="text-purple-300 text-sm font-medium tracking-wider uppercase">
              Why Attend
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Why You Should
            <br />
            <span 
              className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Join Us
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the transformative power of AI at the most comprehensive summit 
            bringing together innovators, researchers, and industry leaders.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div
                className="h-full p-8 rounded-2xl border border-purple-500/20 transition-all duration-300 group-hover:border-purple-400/40"
                style={{
                  background: 'rgba(118, 77, 240, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)'
                    }}
                  >
                    <img
                      src={getAiventIcon(feature.icon)}
                      alt={feature.title}
                      className="w-8 h-8 object-contain filter brightness-0 invert"
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
              boxShadow: '0 10px 30px rgba(118, 77, 240, 0.3)'
            }}
            whileHover={{
              boxShadow: '0 15px 40px rgba(118, 77, 240, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            Get Your Tickets Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
