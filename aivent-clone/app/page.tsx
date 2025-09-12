'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

// Components
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Speakers from '@/components/Speakers'
import Schedule from '@/components/Schedule'
import Pricing from '@/components/Pricing'
import Gallery from '@/components/Gallery'
import Sponsors from '@/components/Sponsors'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  useEffect(() => {
    // Smooth scroll polyfill for older browsers
    if (typeof window !== 'undefined') {
      import('smoothscroll-polyfill').then((smoothscroll) => {
        smoothscroll.polyfill()
      })
    }
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* About Section */}
      <About />
      
      {/* Speakers Section */}
      <Speakers />
      
      {/* Schedule Section */}
      <Schedule />
      
      {/* Pricing Section */}
      <Pricing />
      
      {/* Gallery Section */}
      <Gallery />
      
      {/* Sponsors Section */}
      <Sponsors />
      
      {/* Contact Section */}
      <Contact />
      
      {/* Footer */}
      <Footer />
    </motion.main>
  )
}
