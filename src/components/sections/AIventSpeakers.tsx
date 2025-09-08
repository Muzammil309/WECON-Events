'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Twitter, Linkedin } from 'lucide-react';

export default function AIventSpeakers() {
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

  const speakers = [
    {
      name: "Joshua Henry",
      title: "Chief AI Scientist, OpenAI",
      image: "/assets/images/speakers/joshua-henry.jpg",
      bio: "Leading research in large language models and AI safety",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Leila Zhang",
      title: "VP of Machine Learning, Google",
      image: "/assets/images/speakers/leila-zhang.jpg",
      bio: "Pioneering work in computer vision and neural networks",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Carlos Rivera",
      title: "Founder & CEO, NeuralCore",
      image: "/assets/images/speakers/carlos-rivera.jpg",
      bio: "Building the next generation of AI infrastructure",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    }
  ];

  return (
    <section id="speakers" className="section bg-primary-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
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
            Speakers
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Meet the Visionaries
          </h2>

          <p className="text-lg text-text-secondary leading-relaxed">
            Whether it's a quick refresh or a deep clean transformation, our expert touch leaves your home or office shining.
          </p>
        </motion.div>

        {/* Speakers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {speakers.map((speaker, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-surface-primary border border-border-primary rounded-2xl overflow-hidden hover:bg-surface-secondary hover:border-border-secondary transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Speaker Image */}
              <div className="relative h-64 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 overflow-hidden">
                {/* Placeholder for speaker image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {speaker.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Social Links */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={speaker.social.twitter}
                    className="w-8 h-8 bg-surface-primary/80 border border-border-primary rounded-lg flex items-center justify-center text-text-secondary hover:text-accent-blue transition-colors duration-200"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={speaker.social.linkedin}
                    className="w-8 h-8 bg-surface-primary/80 border border-border-primary rounded-lg flex items-center justify-center text-text-secondary hover:text-accent-blue transition-colors duration-200"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Speaker Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-accent-blue transition-colors duration-300">
                  {speaker.name}
                </h3>
                
                <p className="text-accent-blue font-medium mb-3">
                  {speaker.title}
                </p>
                
                <p className="text-text-secondary text-sm leading-relaxed">
                  {speaker.bio}
                </p>

                {/* Hover effect line */}
                <div className="w-0 h-0.5 bg-gradient-to-r from-accent-blue to-accent-purple mt-4 group-hover:w-full transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Speakers Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center px-8 py-4 bg-surface-primary border border-border-primary text-text-primary font-medium rounded-lg hover:bg-surface-secondary hover:border-border-secondary transition-all duration-200 group">
            View All Speakers
            <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
