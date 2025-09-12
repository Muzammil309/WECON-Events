'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTimeUntilEvent, scrollToElement } from '@/lib/utils'
import type { CountdownTimer } from '@/types'

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<CountdownTimer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const eventDate = new Date('2025-03-15T09:00:00')

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilEvent(eventDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [eventDate])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="video-background"
          poster="/assets/images/hero-poster.jpg"
        >
          <source src="/assets/videos/hero-background.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/80" />
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-cyan-600/20 animate-pulse" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container-custom text-center"
      >
        {/* Event Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-white/20 mb-8"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-300">
            March 15-17, 2025 • San Francisco
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading mb-6 leading-tight"
        >
          <span className="block aivent-text-gradient">AI SUMMIT</span>
          <span className="block text-4xl md:text-5xl lg:text-6xl text-white mt-2">
            2025
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
        >
          The Future of <span className="aivent-text-gradient font-semibold">Artificial Intelligence</span>
        </motion.p>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
        >
          Join the world's leading AI researchers, engineers, and visionaries for three days of 
          groundbreaking presentations, hands-on workshops, and unparalleled networking opportunities.
        </motion.p>

        {/* Event Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto"
        >
          {[
            { icon: Users, label: 'Attendees', value: '5,000+' },
            { icon: Calendar, label: 'Sessions', value: '150+' },
            { icon: MapPin, label: 'Speakers', value: '200+' },
            { icon: Play, label: 'Workshops', value: '50+' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="glass-effect rounded-lg p-4 border border-white/10"
            >
              <stat.icon className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
        >
          <h3 className="text-2xl font-semibold text-white mb-6">Event Starts In</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((time, index) => (
              <motion.div
                key={time.label}
                whileHover={{ scale: 1.05 }}
                className="glass-effect rounded-lg p-6 border border-white/20 glow-indigo"
              >
                <div className="text-3xl md:text-4xl font-bold aivent-text-gradient mb-2">
                  {time.value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">
                  {time.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            variant="aivent"
            size="xl"
            onClick={() => scrollToElement('pricing')}
            className="font-semibold text-lg px-12 py-4"
          >
            Get Your Tickets
          </Button>
          
          <Button
            variant="outline"
            size="xl"
            onClick={() => scrollToElement('about')}
            className="font-semibold text-lg px-12 py-4 border-white/20 text-white hover:bg-white/10"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 bg-white/20 rounded-full`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  )
}
