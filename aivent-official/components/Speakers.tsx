'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Twitter, Linkedin, Globe, Mic } from 'lucide-react'

const speakers = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    title: 'Chief AI Officer',
    company: 'TechCorp',
    image: '/assets/images/team/1.webp',
    bio: 'Leading AI researcher with 15+ years in machine learning and neural networks.',
    social: {
      twitter: 'https://twitter.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen',
      website: 'https://sarahchen.ai'
    },
    featured: true
  },
  {
    id: 2,
    name: 'Prof. Michael Rodriguez',
    title: 'Director of AI Research',
    company: 'Stanford University',
    image: '/assets/images/team/2.webp',
    bio: 'Pioneering research in deep learning and computer vision applications.',
    social: {
      twitter: 'https://twitter.com/mrodriguez',
      linkedin: 'https://linkedin.com/in/mrodriguez',
      website: 'https://stanford.edu/~mrodriguez'
    },
    featured: true
  },
  {
    id: 3,
    name: 'Dr. Aisha Patel',
    title: 'VP of AI Ethics',
    company: 'Global AI Institute',
    image: '/assets/images/team/3.webp',
    bio: 'Expert in AI ethics, bias detection, and responsible AI development.',
    social: {
      twitter: 'https://twitter.com/aishapatel',
      linkedin: 'https://linkedin.com/in/aishapatel'
    },
    featured: true
  },
  {
    id: 4,
    name: 'James Thompson',
    title: 'Founder & CEO',
    company: 'AI Innovations',
    image: '/assets/images/team/4.webp',
    bio: 'Serial entrepreneur building the next generation of AI-powered solutions.',
    social: {
      twitter: 'https://twitter.com/jamesthompson',
      linkedin: 'https://linkedin.com/in/jamesthompson',
      website: 'https://aiinnovations.com'
    },
    featured: false
  },
  {
    id: 5,
    name: 'Dr. Lisa Wang',
    title: 'Head of ML Research',
    company: 'DeepMind',
    image: '/assets/images/team/5.webp',
    bio: 'Leading breakthrough research in reinforcement learning and AGI.',
    social: {
      twitter: 'https://twitter.com/lisawang',
      linkedin: 'https://linkedin.com/in/lisawang'
    },
    featured: false
  }
]

export default function Speakers() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <section id="speakers" className="section-padding relative bg-slate-900/30">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container-custom relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-white/20 mb-6"
          >
            <Mic className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-medium text-gray-300">Featured Speakers</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Meet Our{' '}
            <span className="aivent-text-gradient">Expert Speakers</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Learn from the brightest minds in AI, machine learning, and emerging technologies 
            who are shaping the future of artificial intelligence.
          </p>
        </motion.div>

        {/* Speakers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => (
            <motion.div
              key={speaker.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="speaker-card-aivent group"
            >
              {/* Speaker Image */}
              <div className="relative overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay with Social Links */}
                  <div className="speaker-image-overlay">
                    <div className="flex items-center gap-4">
                      {speaker.social.twitter && (
                        <motion.a
                          href={speaker.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                        >
                          <Twitter className="w-5 h-5" />
                        </motion.a>
                      )}
                      {speaker.social.linkedin && (
                        <motion.a
                          href={speaker.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                        >
                          <Linkedin className="w-5 h-5" />
                        </motion.a>
                      )}
                      {speaker.social.website && (
                        <motion.a
                          href={speaker.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                        >
                          <Globe className="w-5 h-5" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Featured Badge */}
                {speaker.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-semibold text-white">
                    Featured
                  </div>
                )}
              </div>

              {/* Speaker Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                  {speaker.name}
                </h3>
                
                <div className="mb-4">
                  <p className="text-indigo-400 font-semibold text-sm">
                    {speaker.title}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {speaker.company}
                  </p>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {speaker.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Speakers CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            And many more industry experts, researchers, and thought leaders...
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-aivent-secondary"
          >
            View All Speakers
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}
