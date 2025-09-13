'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTimeRemaining, scrollToElement } from '@/lib/utils'

const EVENT_DATE = new Date('2025-10-01T09:00:00-07:00')

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(EVENT_DATE))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(EVENT_DATE))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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

  const scaleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 3, ease: "easeOut" },
    },
  }

  return (
    <section 
      id="section-hero" 
      className="relative min-h-screen flex items-center justify-center bg-dark text-white overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/assets/images/background/2.webp"
        >
          <source src="/assets/videos/2.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-dark/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark" />
        <div className="absolute inset-0 bg-dark/80" />
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center"
      >
        <motion.div variants={scaleVariants} className="space-y-8">
          {/* Subtitle */}
          <motion.div variants={itemVariants}>
            <span className="subtitle text-primary font-semibold tracking-wider uppercase">
              The Future of Intelligence
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-none mb-8"
            style={{ fontSize: 'clamp(3rem, 12vw, 8rem)' }}
          >
            AI Summit 2025
          </motion.h1>

          {/* Event Details */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              <h4 className="text-xl md:text-2xl font-semibold">October 1–5, 2025</h4>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              <h4 className="text-xl md:text-2xl font-semibold">San Francisco, CA</h4>
            </div>
          </motion.div>

          {/* Call to Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="aivent"
              size="xl"
              onClick={() => scrollToElement('section-tickets')}
              className="min-w-[200px]"
            >
              Get Tickets
            </Button>
            
            <Button
              variant="aivent-secondary"
              size="xl"
              onClick={() => scrollToElement('section-schedule')}
              className="min-w-[200px]"
            >
              View Schedule
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom Info Card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 left-0 right-0 z-20 px-4"
      >
        <div className="container-custom">
          <div className="hidden md:block">
            <div className="glass-effect border border-white/20 p-8 rounded-xl relative overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50" />
              
              <div className="relative z-10 grid lg:grid-cols-3 gap-6 items-center">
                {/* Urgency Message */}
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl font-bold mb-1">Hurry Up!</h2>
                  <h4 className="text-lg text-gray-300">Book Your Seat Now</h4>
                </div>

                {/* Countdown Timer */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{timeLeft.days}</div>
                      <div className="text-sm text-gray-400">Days</div>
                    </div>
                    <div className="text-2xl text-gray-500">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{timeLeft.hours}</div>
                      <div className="text-sm text-gray-400">Hours</div>
                    </div>
                    <div className="text-2xl text-gray-500">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{timeLeft.minutes}</div>
                      <div className="text-sm text-gray-400">Minutes</div>
                    </div>
                    <div className="text-2xl text-gray-500">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{timeLeft.seconds}</div>
                      <div className="text-sm text-gray-400">Seconds</div>
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                <div className="flex items-center justify-center lg:justify-end gap-4">
                  <MapPin className="w-12 h-12 text-primary flex-shrink-0" />
                  <div className="text-center lg:text-left">
                    <h4 className="text-lg font-semibold leading-tight">
                      121 AI Blvd,<br />
                      San Francisco BCA 94107
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
