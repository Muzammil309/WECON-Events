'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Globe } from 'lucide-react';

export default function ExactAIventSpeakers() {
  const speakers = [
    {
      id: 1,
      name: 'Joshua Henry',
      title: 'Chief AI Scientist, OpenAI',
      image: '/api/placeholder/300/400',
      bio: 'Leading expert in machine learning and neural networks with 15+ years of experience.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      }
    },
    {
      id: 2,
      name: 'Leila Zhang',
      title: 'VP of Machine Learning, Google',
      image: '/api/placeholder/300/400',
      bio: 'Pioneer in natural language processing and conversational AI systems.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      }
    },
    {
      id: 3,
      name: 'Carlos Rivera',
      title: 'Founder & CEO, NeuralCore',
      image: '/api/placeholder/300/400',
      bio: 'Entrepreneur and visionary building the next generation of AI applications.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      }
    }
  ];

  return (
    <section 
      id="section-speakers"
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
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
              Speakers
            </span>
          </motion.div>
          
          <motion.h2
            className="text-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Meet the <span className="gradient-text">Visionaries</span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
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
                  {/* Gradient placeholder instead of image */}
                  <div 
                    className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 relative"
                  >
                    {/* Overlay pattern */}
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `
                          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)
                        `
                      }}
                    />
                    
                    {/* Speaker initials */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white">
                        {speaker.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
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
                  
                  <p className="text-indigo-400 font-semibold mb-4">{speaker.title}</p>
                  
                  <p className="text-white/70 text-sm leading-relaxed">
                    {speaker.bio}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Speakers Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="btn-primary px-8 py-4 rounded-full text-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Speakers
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
