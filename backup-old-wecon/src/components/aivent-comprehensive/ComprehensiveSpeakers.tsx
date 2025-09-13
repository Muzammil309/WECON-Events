'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Globe } from 'lucide-react';

export default function ComprehensiveSpeakers() {
  const speakers = [
    {
      id: 1,
      name: 'Joshua Henry',
      title: 'Chief AI Scientist, OpenAI',
      initials: 'JH',
      gradient: 'from-blue-500 to-purple-600',
      social: { twitter: '#', linkedin: '#', website: '#' }
    },
    {
      id: 2,
      name: 'Leila Zhang',
      title: 'VP of Machine Learning, Google',
      initials: 'LZ',
      gradient: 'from-green-500 to-blue-600',
      social: { twitter: '#', linkedin: '#', website: '#' }
    },
    {
      id: 3,
      name: 'Carlos Rivera',
      title: 'Founder & CEO, NeuralCore',
      initials: 'CR',
      gradient: 'from-purple-500 to-pink-600',
      social: { twitter: '#', linkedin: '#', website: '#' }
    }
  ];

  return (
    <section 
      id="section-speakers"
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
      }}
    >
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
          >
            <span className="text-indigo-300 text-sm font-medium tracking-wider uppercase">
              Speakers
            </span>
          </motion.div>
          
          <motion.h2
            className="text-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Meet the <span className="gradient-text">Visionaries</span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            Whether it's a quick refresh or a deep clean transformation, our expert touch leaves your home or office shining.
          </motion.p>
        </motion.div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => (
            <motion.div
              key={speaker.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="glass-effect rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 group-hover:border-indigo-400/40">
                {/* Speaker Image */}
                <div className="relative overflow-hidden h-80">
                  <div className={`w-full h-full bg-gradient-to-br ${speaker.gradient} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white">
                        {speaker.initials}
                      </span>
                    </div>
                  </div>
                  
                  {/* Social Links Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    {Object.entries(speaker.social).map(([platform, url]) => {
                      const Icon = platform === 'twitter' ? Twitter : platform === 'linkedin' ? Linkedin : Globe;
                      return (
                        <motion.a
                          key={platform}
                          href={url}
                          className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white hover:bg-indigo-500 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Icon size={16} />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>

                {/* Speaker Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                    {speaker.name}
                  </h3>
                  <p className="text-indigo-400 font-semibold">{speaker.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
