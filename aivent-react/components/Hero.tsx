'use client'

import { useState, useEffect } from 'react'
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const targetDate = new Date('2025-10-01T00:00:00').getTime()

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

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center hero-bg">
      {/* Background Video Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/60 to-dark-900/80"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container-custom text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in">
            <span className="block text-gray-300 mb-2">The Future of</span>
            <span className="gradient-text">Intelligence</span>
          </h1>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-white animate-slide-up">
            AI Summit 2025
          </h2>

          {/* Event Details */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 text-xl text-gray-300">
              <CalendarIcon className="h-6 w-6 text-primary-500" />
              <span>October 1–5, 2025</span>
            </div>
            <div className="flex items-center gap-3 text-xl text-gray-300">
              <MapPinIcon className="h-6 w-6 text-primary-500" />
              <span>San Francisco, CA</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <a href="#tickets" className="btn-primary text-lg px-10 py-4">
              Get Tickets
            </a>
            <a href="#schedule" className="btn-secondary text-lg px-10 py-4">
              View Schedule
            </a>
          </div>

          {/* Countdown Timer */}
          <div className="bg-dark-800/50 backdrop-blur-md rounded-2xl p-8 border border-dark-700 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-2xl font-bold mb-6 gradient-text">Hurry Up! Book Your Seat Now</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 mb-2">
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      {value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-gray-400 capitalize font-medium">{unit}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
              <MapPinIcon className="h-5 w-5" />
              <span>121 AI Blvd, San Francisco BCA 94107</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero
