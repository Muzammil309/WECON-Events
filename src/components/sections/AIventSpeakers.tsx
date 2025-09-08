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
      image: "https://madebydesignesia.com/themes/aivent/images/team/1.webp",
      bio: "Leading research in large language models and AI safety",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Leila Zhang",
      title: "VP of Machine Learning, Google",
      image: "https://madebydesignesia.com/themes/aivent/images/team/2.webp",
      bio: "Pioneering work in computer vision and neural networks",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Carlos Rivera",
      title: "Founder & CEO, NeuralCore",
      image: "https://madebydesignesia.com/themes/aivent/images/team/3.webp",
      bio: "Building the next generation of AI infrastructure",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Maria Gonzalez",
      title: "Founder & CEO, SynthCore AI",
      image: "https://madebydesignesia.com/themes/aivent/images/team/4.webp",
      bio: "Building next-generation AI infrastructure and scalable machine learning systems",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Lisa Zhang",
      title: "AI Ethics Researcher, FairAI Group",
      image: "https://madebydesignesia.com/themes/aivent/images/team/5.webp",
      bio: "Advancing the frontiers of artificial general intelligence and cognitive computing",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Markus Blom",
      title: "CTO, SynthMind AI",
      image: "https://madebydesignesia.com/themes/aivent/images/team/6.webp",
      bio: "Transforming enterprise software with AI-powered solutions and intelligent automation",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    }
  ];

  return (
    <section
      id="speakers"
      className="relative py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0F0B1F 0%, #1A1B3A 50%, #0F0B1F 100%)',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Complex Background Pattern - Exact AIvent Style */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px),
              linear-gradient(180deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-40 left-20 w-20 h-20 border border-white/10 rotate-45"
          animate={{
            rotate: [45, 135, 45],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
            backdropFilter: 'blur(10px)'
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header - Exact AIvent Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div
            className="inline-flex items-center px-5 py-2 rounded-full text-sm font-medium mb-8"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              color: '#A5B4FC'
            }}
          >
            Speakers
          </div>

          <h2
            className="text-white font-black mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Meet the{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Visionaries
            </span>
          </h2>

          <p
            className="text-white/80 leading-relaxed"
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Hear from global AI pioneers, industry disruptors, and bold thinkers shaping the future across every domain.
          </p>
        </motion.div>

        {/* Speakers Grid - Exact AIvent Style */}
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
              className="group rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
              whileHover={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)'
              }}
            >
              {/* Speaker Image - Exact AIvent Style */}
              <div className="relative h-80 overflow-hidden">
                {/* Real speaker image */}
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{
                    filter: 'brightness(0.9) contrast(1.1)'
                  }}
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)'
                  }}
                />

                {/* Social Links - Exact AIvent Style */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.a
                    href={speaker.social.twitter}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-colors duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Twitter className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    href={speaker.social.linkedin}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-colors duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Linkedin className="w-4 h-4" />
                  </motion.a>
                </div>
              </div>

              {/* Speaker Info - Exact AIvent Style */}
              <div className="p-6">
                <h3
                  className="text-white font-bold mb-2 group-hover:text-blue-300 transition-colors duration-300"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    lineHeight: 1.3
                  }}
                >
                  {speaker.name}
                </h3>

                <p
                  className="font-medium mb-3"
                  style={{
                    color: '#A5B4FC',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px'
                  }}
                >
                  {speaker.title}
                </p>

                <p
                  className="text-white/70 leading-relaxed"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    lineHeight: 1.6
                  }}
                >
                  {speaker.bio}
                </p>

                {/* Hover effect line - Exact AIvent Style */}
                <div
                  className="w-0 h-0.5 mt-4 group-hover:w-full transition-all duration-500"
                  style={{
                    background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)'
                  }}
                ></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Speakers Button - Exact AIvent Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.button
            className="inline-flex items-center px-8 py-4 text-white font-bold rounded-xl transition-all duration-300 group"
            style={{
              fontSize: '14px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            whileHover={{
              scale: 1.05,
              background: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(99, 102, 241, 0.3)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            View All Speakers
            <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
