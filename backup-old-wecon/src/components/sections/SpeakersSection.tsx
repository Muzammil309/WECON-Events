'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Globe } from 'lucide-react';

interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio?: string;
  image: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

interface SpeakersSectionProps {
  subtitle?: string;
  title?: string;
  description?: string;
  speakers?: Speaker[];
}

const defaultSpeakers: Speaker[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Chief AI Officer',
    company: 'TechCorp',
    bio: 'Leading AI research and development with 15+ years of experience in machine learning and neural networks.',
    image: '/api/placeholder/300/300',
    social: {
      linkedin: '#',
      twitter: '#',
      website: '#'
    }
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    title: 'VP of Engineering',
    company: 'AI Innovations',
    bio: 'Expert in scalable AI systems and cloud infrastructure for enterprise applications.',
    image: '/api/placeholder/300/300',
    social: {
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    title: 'Research Director',
    company: 'Future Labs',
    bio: 'Pioneering research in ethical AI and responsible machine learning practices.',
    image: '/api/placeholder/300/300',
    social: {
      linkedin: '#',
      website: '#'
    }
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'Founder & CEO',
    company: 'AI Startup',
    bio: 'Serial entrepreneur building the next generation of AI-powered products.',
    image: '/api/placeholder/300/300',
    social: {
      linkedin: '#',
      twitter: '#',
      website: '#'
    }
  },
  {
    id: '5',
    name: 'Dr. Lisa Johnson',
    title: 'Head of AI Ethics',
    company: 'Global Tech',
    bio: 'Leading expert in AI ethics, bias detection, and responsible AI deployment.',
    image: '/api/placeholder/300/300',
    social: {
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    id: '6',
    name: 'Alex Thompson',
    title: 'Principal Scientist',
    company: 'Research Institute',
    bio: 'Advancing the frontiers of artificial general intelligence and cognitive computing.',
    image: '/api/placeholder/300/300',
    social: {
      linkedin: '#',
      website: '#'
    }
  }
];

export default function SpeakersSection({
  subtitle = "[ Featured Speakers ]",
  title = "Learn from Industry Leaders",
  description = "Join us for insights from the brightest minds in artificial intelligence, machine learning, and technology innovation.",
  speakers = defaultSpeakers
}: SpeakersSectionProps) {
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
        duration: 0.6,
        ease: [0.6, 0.03, 0.28, 0.98]
      }
    }
  };

  return (
    <section id="section-speakers" className="section bg-primary-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-surface-primary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6">
            {subtitle}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            {title}
          </h2>
          
          <p className="text-lg text-text-secondary leading-relaxed">
            {description}
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
          {speakers.map((speaker) => (
            <motion.div
              key={speaker.id}
              variants={itemVariants}
              className="group"
            >
              <div className="card p-6 text-center hover:scale-105 transition-all duration-300">
                {/* Speaker Image */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-surface-secondary">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Social Links Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 bg-primary-bg/90 backdrop-blur-sm rounded-full px-4 py-2">
                      {speaker.social?.linkedin && (
                        <a
                          href={speaker.social.linkedin}
                          className="w-8 h-8 bg-surface-primary rounded-full flex items-center justify-center hover:bg-accent-blue transition-colors duration-200"
                        >
                          <Linkedin className="w-4 h-4 text-text-secondary hover:text-white" />
                        </a>
                      )}
                      {speaker.social?.twitter && (
                        <a
                          href={speaker.social.twitter}
                          className="w-8 h-8 bg-surface-primary rounded-full flex items-center justify-center hover:bg-accent-blue transition-colors duration-200"
                        >
                          <Twitter className="w-4 h-4 text-text-secondary hover:text-white" />
                        </a>
                      )}
                      {speaker.social?.website && (
                        <a
                          href={speaker.social.website}
                          className="w-8 h-8 bg-surface-primary rounded-full flex items-center justify-center hover:bg-accent-blue transition-colors duration-200"
                        >
                          <Globe className="w-4 h-4 text-text-secondary hover:text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Speaker Info */}
                <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-accent-blue transition-colors duration-300">
                  {speaker.name}
                </h3>
                
                <p className="text-accent-blue font-medium mb-1">
                  {speaker.title}
                </p>
                
                <p className="text-text-muted text-sm mb-4">
                  {speaker.company}
                </p>

                {speaker.bio && (
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {speaker.bio}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="btn btn-secondary">
            View All Speakers
          </button>
        </motion.div>
      </div>
    </section>
  );
}
