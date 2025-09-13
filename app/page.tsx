'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import MarqueeSection from '@/components/MarqueeSection'
import WhyAttend from '@/components/WhyAttend'
import Quote from '@/components/Quote'
import Speakers from '@/components/Speakers'
import Schedule from '@/components/Schedule'
import Tickets from '@/components/Tickets'
import Sponsors from '@/components/Sponsors'
import News from '@/components/News'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function HomePage() {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-dark text-white"
    >
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* About Section */}
      <About />
      
      {/* Marquee Section */}
      <MarqueeSection />
      
      {/* Why Attend Section */}
      <WhyAttend />
      
      {/* Quote Section */}
      <Quote />
      
      {/* Speakers Section */}
      <Speakers />
      
      {/* Schedule Section */}
      <Schedule />
      
      {/* Tickets Section */}
      <Tickets />
      
      {/* Sponsors Section */}
      <Sponsors />
      
      {/* News Section */}
      <News />
      
      {/* Contact Section */}
      <Contact />
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top */}
      <ScrollToTop />
    </motion.main>
  )
}
