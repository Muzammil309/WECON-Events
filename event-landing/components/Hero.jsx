import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const targetDate = new Date('2024-12-31T00:00:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Event Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-slate-900/90 to-blue-900/80" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-6xl mx-auto px-4"
      >
        {/* Event Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center px-6 py-3 rounded-full glass-effect text-purple-300 font-medium">
            <Calendar className="w-5 h-5 mr-2" />
            Tech Innovation Summit 2024
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading mb-6"
        >
          <span className="gradient-text">Future</span> of{' '}
          <span className="text-white">Technology</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Join industry leaders, innovators, and visionaries for three days of 
          groundbreaking insights, networking, and technological advancement.
        </motion.p>

        {/* Event Details */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 text-lg"
        >
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span>December 15-17, 2024</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-5 h-5 text-purple-400" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-5 h-5 text-purple-400" />
            <span>9:00 AM - 6:00 PM</span>
          </div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-12"
        >
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="glass-effect rounded-lg p-4 text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                {value.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                {unit}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="gradient" size="xl" className="group">
            Get Your Tickets
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="xl" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
            Learn More
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
