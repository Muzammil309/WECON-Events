'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import MarqueeSection from '@/components/MarqueeSection'
import WhyAttend from '@/components/WhyAttend'
import Quote from '@/components/Quote'
import Speakers from '@/components/Speakers'
import Sponsors from '@/components/Sponsors'
import Schedule from '@/components/Schedule'
import Tickets from '@/components/Tickets'
import Venue from '@/components/Venue'
import FAQ from '@/components/FAQ'
import Newsletter from '@/components/Newsletter'
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
      className="min-h-screen text-white"
      style={{ backgroundColor: '#101435' }}
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

      {/* Sponsors Section */}
      <Sponsors />

      {/* Schedule Section */}
      <Schedule />

      {/* Tickets Section */}
      <Tickets />

      {/* Venue Section */}
      <Venue />

      {/* FAQ Section */}
      <FAQ />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top */}
      <ScrollToTop />
    </motion.main>
  )
}
