import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Twitter, Linkedin, Globe } from 'lucide-react'
import { Card, CardContent } from './ui/card'

const Speakers = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const speakers = [
    {
      name: 'Dr. Sarah Chen',
      role: 'AI Research Director',
      company: 'TechCorp',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Leading AI researcher with 15+ years in machine learning and neural networks.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      }
    },
    {
      name: 'Prof. Michael Rodriguez',
      role: 'Computer Science Professor',
      company: 'Stanford University',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Renowned educator and researcher in distributed systems and cloud computing.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      }
    },
    {
      name: 'Alex Thompson',
      role: 'Blockchain Architect',
      company: 'CryptoInnovate',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Pioneer in blockchain technology with expertise in DeFi and smart contracts.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      }
    },
    {
      name: 'Emma Wilson',
      role: 'Full-Stack Developer',
      company: 'WebFlow Studios',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Expert in modern web technologies and progressive web applications.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      }
    },
    {
      name: 'Dr. Lisa Park',
      role: 'Sustainability Tech Lead',
      company: 'GreenTech Solutions',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Passionate about using technology to solve environmental challenges.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      }
    },
    {
      name: 'James Kumar',
      role: 'Startup Founder & CEO',
      company: 'InnovateLab',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Serial entrepreneur with multiple successful exits in the tech industry.',
      social: {
        twitter: '#',
        linkedin: '#',
        website: '#'
      }
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <section id="speakers" className="section-padding">
      <div className="container-custom">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-purple-400 font-semibold text-lg">Meet the Experts</span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2 mb-6">
              World-Class <span className="gradient-text">Speakers</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Learn from industry leaders, researchers, and innovators who are 
              shaping the future of technology and business.
            </p>
          </motion.div>

          {/* Speakers Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {speakers.map((speaker, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="glass-effect border-slate-700 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    {/* Speaker Image */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Social Media Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex justify-center space-x-4">
                          <motion.a
                            href={speaker.social.twitter}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-colors"
                          >
                            <Twitter className="w-5 h-5" />
                          </motion.a>
                          <motion.a
                            href={speaker.social.linkedin}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                          </motion.a>
                          <motion.a
                            href={speaker.social.website}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-colors"
                          >
                            <Globe className="w-5 h-5" />
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                      {speaker.name}
                    </h3>
                    <p className="text-purple-400 font-medium mb-1">
                      {speaker.role}
                    </p>
                    <p className="text-gray-400 text-sm mb-3">
                      {speaker.company}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {speaker.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Speakers
