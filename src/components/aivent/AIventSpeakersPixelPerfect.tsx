'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Globe } from 'lucide-react';

export default function AIventSpeakersPixelPerfect() {
  const speakers = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      title: 'Chief AI Scientist',
      company: 'TechCorp',
      image: '/assets/aivent-extracted/images/speakers/1.webp',
      bio: 'Leading expert in machine learning and neural networks with 15+ years of experience.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      },
      expertise: ['Machine Learning', 'Neural Networks', 'Computer Vision']
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      title: 'VP of AI Research',
      company: 'InnovateLabs',
      image: '/assets/aivent-extracted/images/speakers/2.webp',
      bio: 'Pioneer in natural language processing and conversational AI systems.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      },
      expertise: ['NLP', 'Conversational AI', 'Deep Learning']
    },
    {
      id: 3,
      name: 'Dr. Emily Watson',
      title: 'AI Ethics Director',
      company: 'FutureTech',
      image: '/assets/aivent-extracted/images/speakers/3.webp',
      bio: 'Renowned researcher in AI ethics and responsible artificial intelligence.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      },
      expertise: ['AI Ethics', 'Responsible AI', 'Policy']
    },
    {
      id: 4,
      name: 'James Kim',
      title: 'Founder & CEO',
      company: 'AI Dynamics',
      image: '/assets/aivent-extracted/images/speakers/4.webp',
      bio: 'Entrepreneur and visionary building the next generation of AI applications.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      },
      expertise: ['AI Strategy', 'Entrepreneurship', 'Innovation']
    },
    {
      id: 5,
      name: 'Dr. Aisha Patel',
      title: 'Research Director',
      company: 'QuantumAI',
      image: '/assets/aivent-extracted/images/speakers/5.webp',
      bio: 'Expert in quantum computing applications for artificial intelligence.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      },
      expertise: ['Quantum AI', 'Research', 'Innovation']
    },
    {
      id: 6,
      name: 'Michael Thompson',
      title: 'CTO',
      company: 'DataVision',
      image: '/assets/aivent-extracted/images/speakers/6.webp',
      bio: 'Technology leader specializing in large-scale AI infrastructure.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      },
      expertise: ['AI Infrastructure', 'Scalability', 'Cloud AI']
    }
  ];

  return (
    <section 
      id="section-speakers"
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
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-purple-500/10 rounded-lg animate-pulse" />
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-purple-400/10 rounded-full animate-pulse" />

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
              Meet Our Speakers
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Industry
            <br />
            <span 
              className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Leaders
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Learn from the brightest minds in AI who are shaping the future of technology 
            and driving innovation across industries.
          </p>
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
              <div
                className="relative overflow-hidden rounded-2xl border border-purple-500/20 transition-all duration-500 group-hover:border-purple-400/40"
                style={{
                  background: 'rgba(118, 77, 240, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Speaker Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback gradient background
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'block';
                    }}
                  />
                  
                  {/* Fallback gradient */}
                  <div 
                    className="w-full h-80 hidden"
                    style={{
                      background: `linear-gradient(135deg, #764DF0 0%, #442490 100%)`
                    }}
                  />
                  
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
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-purple-500 transition-all duration-300"
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
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                    {speaker.name}
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-purple-400 font-semibold">{speaker.title}</p>
                    <p className="text-gray-400 text-sm">{speaker.company}</p>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {speaker.bio}
                  </p>
                  
                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2">
                    {speaker.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 text-xs font-medium rounded-full border border-purple-500/30 text-purple-300"
                        style={{
                          background: 'rgba(118, 77, 240, 0.1)'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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
          <p className="text-gray-400 mb-6 text-lg">
            Want to speak at AI Summit 2025?
          </p>
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
            Apply to Speak
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
