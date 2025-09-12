import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Users, Calendar, Award, Globe } from 'lucide-react'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [counters, setCounters] = useState({
    attendees: 0,
    speakers: 0,
    sponsors: 0,
    countries: 0
  })

  const finalCounts = {
    attendees: 5000,
    speakers: 150,
    sponsors: 50,
    countries: 25
  }

  useEffect(() => {
    if (inView) {
      const duration = 2000 // 2 seconds
      const steps = 60
      const stepDuration = duration / steps

      Object.keys(finalCounts).forEach(key => {
        let current = 0
        const increment = finalCounts[key] / steps

        const timer = setInterval(() => {
          current += increment
          if (current >= finalCounts[key]) {
            current = finalCounts[key]
            clearInterval(timer)
          }
          setCounters(prev => ({
            ...prev,
            [key]: Math.floor(current)
          }))
        }, stepDuration)
      })
    }
  }, [inView])

  const stats = [
    {
      icon: Users,
      label: 'Attendees',
      value: counters.attendees,
      suffix: '+'
    },
    {
      icon: Calendar,
      label: 'Speakers',
      value: counters.speakers,
      suffix: '+'
    },
    {
      icon: Award,
      label: 'Sponsors',
      value: counters.sponsors,
      suffix: '+'
    },
    {
      icon: Globe,
      label: 'Countries',
      value: counters.countries,
      suffix: '+'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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
    <section id="about" className="section-padding relative">
      <div className="container-custom">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Column - Image */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1559223607-a43c990c692c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Tech Conference"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -10 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-8 -right-8 glass-effect rounded-xl p-6 border border-purple-500/20"
            >
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">2024</div>
                <div className="text-sm text-gray-300">Innovation Year</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <motion.span
                variants={itemVariants}
                className="text-purple-400 font-semibold text-lg"
              >
                About the Event
              </motion.span>
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold font-heading mt-2 mb-6"
              >
                Where Innovation{' '}
                <span className="gradient-text">Meets Opportunity</span>
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-300 leading-relaxed"
              >
                The Tech Innovation Summit brings together the brightest minds in technology, 
                entrepreneurship, and innovation. Over three transformative days, you'll 
                experience cutting-edge presentations, hands-on workshops, and unparalleled 
                networking opportunities that will shape the future of your career and industry.
              </motion.p>
            </div>

            {/* Features List */}
            <motion.div variants={itemVariants} className="space-y-4">
              {[
                'Keynotes from industry leaders and visionaries',
                'Interactive workshops and technical sessions',
                'Startup showcase and investor meetups',
                'Exclusive networking events and after-parties'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-6 pt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center p-4 glass-effect rounded-lg"
                >
                  <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold gradient-text">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
