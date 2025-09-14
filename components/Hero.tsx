'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

  const handleNavClick = (href: string) => {
    scrollToElement(href)
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
        >
          <source src="/aivent-original/video/2.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlays - matching original template exactly */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent h-1/2 top-0 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark" />
        <div className="absolute inset-0 bg-dark/20 opacity-80" />
      </div>

      {/* Main Content - positioned exactly like original template */}
      <div className="absolute inset-0 z-20 flex items-center justify-center w-4/5 mx-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3 }}
              className="mb-8"
            >
              <div className="text-primary text-lg mb-4 font-medium">The Future of Intelligence</div>
              <h1 className="text-7xl md:text-8xl lg:text-[120px] font-bold uppercase mb-8 leading-none tracking-tight">
                AI Summit 2025
              </h1>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-12">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-xl font-semibold">October 1–5, 2025</h4>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-xl font-semibold">San Francisco, CA</h4>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => handleNavClick('section-tickets')}
                  className="bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-full text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105"
                >
                  Get Tickets
                </button>
                <button
                  onClick={() => handleNavClick('section-schedule')}
                  className="border border-white/30 px-8 py-3 rounded-full text-white font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/50"
                >
                  View Schedule
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Info Card */}
      <div className="absolute bottom-0 left-0 right-0 z-30 hidden sm:block">
        <div className="container mx-auto px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-dark/80 backdrop-blur-md border border-white/10 rounded-lg p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Hurry Up!</h2>
                <h4 className="text-lg text-white/80">Book Your Seat Now</h4>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 text-2xl font-bold">
                  <div className="text-center">
                    <div className="text-3xl text-primary">{timeLeft.days}</div>
                    <div className="text-sm text-white/60">Days</div>
                  </div>
                  <div className="text-primary">:</div>
                  <div className="text-center">
                    <div className="text-3xl text-primary">{timeLeft.hours}</div>
                    <div className="text-sm text-white/60">Hours</div>
                  </div>
                  <div className="text-primary">:</div>
                  <div className="text-center">
                    <div className="text-3xl text-primary">{timeLeft.minutes}</div>
                    <div className="text-sm text-white/60">Minutes</div>
                  </div>
                  <div className="text-primary">:</div>
                  <div className="text-center">
                    <div className="text-3xl text-primary">{timeLeft.seconds}</div>
                    <div className="text-sm text-white/60">Seconds</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-end">
                <div className="flex items-center space-x-3">
                  <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold">121 AI Blvd,</h4>
                    <h4 className="text-lg font-semibold">San Francisco BCA 94107</h4>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

