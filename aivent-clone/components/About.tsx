'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, Zap, Globe, Target, Users, Award, Lightbulb, Rocket } from 'lucide-react'
import CountUp from 'react-countup'

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [startCounting, setStartCounting] = useState(false)

  useEffect(() => {
    if (inView) {
      setStartCounting(true)
    }
  }, [inView])

  const stats = [
    { icon: Users, label: 'Global Attendees', value: 5000, suffix: '+' },
    { icon: Brain, label: 'AI Experts', value: 200, suffix: '+' },
    { icon: Globe, label: 'Countries', value: 50, suffix: '+' },
    { icon: Award, label: 'Innovation Awards', value: 25, suffix: '' },
  ]

  const features = [
    {
      icon: Lightbulb,
      title: 'Cutting-Edge Research',
      description: 'Discover the latest breakthroughs in AI research from leading institutions worldwide.',
    },
    {
      icon: Rocket,
      title: 'Industry Applications',
      description: 'Learn how AI is transforming industries from healthcare to finance and beyond.',
    },
    {
      icon: Target,
      title: 'Practical Workshops',
      description: 'Hands-on sessions with real-world applications and implementation strategies.',
    },
    {
      icon: Zap,
      title: 'Networking Opportunities',
      description: 'Connect with peers, mentors, and potential collaborators in the AI community.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
    <section id="about" className="section-padding relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
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
            <Brain className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-medium text-gray-300">About the Summit</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Shaping the Future of{' '}
            <span className="aivent-text-gradient">Artificial Intelligence</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            AI Summit 2025 brings together the brightest minds in artificial intelligence to explore 
            groundbreaking research, share innovative applications, and forge the path toward an 
            AI-powered future.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-effect rounded-xl p-6 border border-white/10 text-center hover-lift"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4"
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>
              
              <div className="text-3xl md:text-4xl font-bold aivent-text-gradient mb-2">
                {startCounting ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    delay={index * 0.2}
                    suffix={stat.suffix}
                  />
                ) : (
                  '0'
                )}
              </div>
              
              <div className="text-sm text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="AI Summit Conference"
                className="w-full h-[500px] object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -10 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute top-6 right-6 glass-effect rounded-lg p-4 border border-white/20"
              >
                <div className="text-2xl font-bold text-white">2025</div>
                <div className="text-sm text-gray-300">Edition</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Features */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-white">
                Why Attend AI Summit 2025?
              </h3>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Experience three days of intensive learning, networking, and innovation. 
                From keynote presentations by industry pioneers to hands-on workshops 
                with cutting-edge tools, AI Summit 2025 offers unparalleled opportunities 
                to advance your knowledge and career in artificial intelligence.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ x: 50, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block glass-effect rounded-2xl p-8 border border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Shape the Future?
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Join thousands of AI enthusiasts, researchers, and industry leaders 
              at the most anticipated AI event of 2025.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('speakers')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            >
              Meet Our Speakers
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
