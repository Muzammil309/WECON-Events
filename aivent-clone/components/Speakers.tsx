'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronLeft, ChevronRight, Twitter, Linkedin, Globe, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Speaker } from '@/types'

const speakers: Speaker[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Chief AI Scientist',
    company: 'Google DeepMind',
    bio: 'Leading researcher in neural networks and machine learning with over 15 years of experience.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    social: {
      twitter: 'https://twitter.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen',
      website: 'https://sarahchen.ai'
    }
  },
  {
    id: '2',
    name: 'Prof. Michael Rodriguez',
    title: 'Director of AI Research',
    company: 'MIT CSAIL',
    bio: 'Pioneer in computer vision and autonomous systems, author of 200+ research papers.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    social: {
      twitter: 'https://twitter.com/mrodriguez',
      linkedin: 'https://linkedin.com/in/mrodriguez'
    }
  },
  {
    id: '3',
    name: 'Dr. Aisha Patel',
    title: 'VP of AI Ethics',
    company: 'OpenAI',
    bio: 'Expert in AI safety and ethics, leading initiatives for responsible AI development.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    social: {
      twitter: 'https://twitter.com/aishapatel',
      linkedin: 'https://linkedin.com/in/aishapatel',
      website: 'https://aishapatel.com'
    }
  },
  {
    id: '4',
    name: 'James Thompson',
    title: 'CEO & Founder',
    company: 'Neural Dynamics',
    bio: 'Serial entrepreneur building the next generation of AI-powered applications.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    social: {
      twitter: 'https://twitter.com/jamesthompson',
      linkedin: 'https://linkedin.com/in/jamesthompson'
    }
  },
  {
    id: '5',
    name: 'Dr. Lisa Wang',
    title: 'Head of AI Research',
    company: 'Microsoft Research',
    bio: 'Leading advancements in natural language processing and conversational AI.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    social: {
      linkedin: 'https://linkedin.com/in/lisawang',
      website: 'https://lisawang.ai'
    }
  },
  {
    id: '6',
    name: 'Dr. Robert Kim',
    title: 'Principal Scientist',
    company: 'Tesla AI',
    bio: 'Expert in autonomous driving and robotics, pushing the boundaries of AI in transportation.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    social: {
      twitter: 'https://twitter.com/robertkim',
      linkedin: 'https://linkedin.com/in/robertkim'
    }
  }
]

export default function Speakers() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredSpeaker, setHoveredSpeaker] = useState<string | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(speakers.length / 3))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(speakers.length / 3)) % Math.ceil(speakers.length / 3))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section id="speakers" className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
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
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">World-Class Speakers</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Learn from the{' '}
            <span className="aivent-text-gradient">Best Minds</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Get inspired by industry leaders, researchers, and innovators who are shaping 
            the future of artificial intelligence across various domains.
          </p>
        </motion.div>

        {/* Speakers Grid */}
        <motion.div variants={itemVariants} className="relative">
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker, index) => (
              <motion.div
                key={speaker.id}
                initial={{ y: 50, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredSpeaker(speaker.id)}
                onHoverEnd={() => setHoveredSpeaker(null)}
                className="group relative"
              >
                <div className="glass-effect rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover-lift">
                  {/* Speaker Image */}
                  <div className="relative overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-64 object-cover"
                    />
                    
                    {/* Social Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredSpeaker === speaker.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex items-end justify-center pb-6"
                    >
                      <div className="flex gap-3">
                        {speaker.social.twitter && (
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            href={speaker.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-blue-500/80 transition-colors"
                          >
                            <Twitter className="w-5 h-5" />
                          </motion.a>
                        )}
                        {speaker.social.linkedin && (
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            href={speaker.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-blue-600/80 transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                          </motion.a>
                        )}
                        {speaker.social.website && (
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            href={speaker.social.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-500/80 transition-colors"
                          >
                            <Globe className="w-5 h-5" />
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Speaker Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {speaker.name}
                    </h3>
                    <p className="text-purple-400 font-medium mb-1">
                      {speaker.title}
                    </p>
                    <p className="text-gray-400 text-sm mb-3">
                      {speaker.company}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {speaker.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="relative overflow-hidden">
              <motion.div
                animate={{ x: -currentIndex * 100 + '%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex"
              >
                {speakers.map((speaker) => (
                  <div key={speaker.id} className="w-full flex-shrink-0 px-4">
                    <div className="glass-effect rounded-2xl overflow-hidden border border-white/10">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {speaker.name}
                        </h3>
                        <p className="text-purple-400 font-medium mb-1">
                          {speaker.title}
                        </p>
                        <p className="text-gray-400 text-sm mb-3">
                          {speaker.company}
                        </p>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {speaker.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex gap-2">
                {speakers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-purple-400' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block glass-effect rounded-2xl p-8 border border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to Speak at AI Summit 2025?
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              We're always looking for innovative speakers to share their expertise 
              and insights with our global community.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
            >
              Submit Your Proposal
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
