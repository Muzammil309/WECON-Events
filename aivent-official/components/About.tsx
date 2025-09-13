'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { Users, Calendar, Globe, Award, Lightbulb, Target } from 'lucide-react'

const statistics = [
  {
    icon: Users,
    number: 5000,
    suffix: '+',
    label: 'Attendees',
    description: 'Global participants'
  },
  {
    icon: Calendar,
    number: 150,
    suffix: '+',
    label: 'Sessions',
    description: 'Talks & workshops'
  },
  {
    icon: Globe,
    number: 50,
    suffix: '+',
    label: 'Countries',
    description: 'Worldwide reach'
  },
  {
    icon: Award,
    number: 100,
    suffix: '+',
    label: 'Speakers',
    description: 'Industry experts'
  }
]

const features = [
  {
    icon: Lightbulb,
    title: 'Cutting-Edge Insights',
    description: 'Discover the latest breakthroughs in AI research, machine learning, and emerging technologies that are reshaping industries worldwide.'
  },
  {
    icon: Users,
    title: 'Networking Opportunities',
    description: 'Connect with industry leaders, researchers, entrepreneurs, and innovators from around the globe in our dedicated networking sessions.'
  },
  {
    icon: Target,
    title: 'Practical Applications',
    description: 'Learn how to implement AI solutions in your business with hands-on workshops and real-world case studies from successful deployments.'
  }
]

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [inView, hasAnimated])

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

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="about" className="section-padding relative bg-slate-900/50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
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
            <Lightbulb className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-medium text-gray-300">About the Summit</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            The Future of{' '}
            <span className="aivent-text-gradient">Intelligence</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Join thought leaders, developers, researchers, and founders as we explore how artificial 
            intelligence is reshaping industries, creativity, and the future of work.
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              variants={statsVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                {hasAnimated ? (
                  <CountUp
                    end={stat.number}
                    duration={2.5}
                    delay={index * 0.2}
                    suffix={stat.suffix}
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-300 mb-1">
                {stat.label}
              </h3>
              
              <p className="text-sm text-gray-500">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Shaping Tomorrow's Technology Today
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed mb-6">
                AI Summit 2025 brings together the brightest minds in artificial intelligence, 
                machine learning, and emerging technologies. Over five transformative days, 
                you'll discover groundbreaking research, practical applications, and the 
                future direction of AI across industries.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                From keynote presentations by industry pioneers to hands-on workshops 
                and networking opportunities, this summit is designed to accelerate 
                your understanding and implementation of AI technologies.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/30 transition-all duration-300"
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

          {/* Right Content - Image */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="aspect-[4/3] bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 rounded-2xl p-1"
              >
                <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                  {/* Placeholder for main image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                      Innovation Hub
                    </h4>
                    <p className="text-gray-400">
                      Where ideas become reality
                    </p>
                  </div>
                  
                  {/* Floating elements */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg opacity-80"
                  />
                  <motion.div
                    animate={{
                      y: [0, 10, 0],
                      rotate: [0, -5, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-80"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
