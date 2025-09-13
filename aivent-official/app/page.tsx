'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'

// Import components with dynamic loading for better performance
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: true })
const Hero = dynamic(() => import('@/components/Hero'), { ssr: true })
const About = dynamic(() => import('@/components/About'), { ssr: false })
const WhyAttend = dynamic(() => import('@/components/WhyAttend'), { ssr: false })
const Speakers = dynamic(() => import('@/components/Speakers'), { ssr: false })
const Schedule = dynamic(() => import('@/components/Schedule'), { ssr: false })
const Tickets = dynamic(() => import('@/components/Tickets'), { ssr: false })
const Venue = dynamic(() => import('@/components/Venue'), { ssr: false })
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: false })
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false })

// Scroll to top button
const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), { ssr: false })

export default function HomePage() {
  useEffect(() => {
    // Initialize AOS (Animate On Scroll) library
    const initAOS = async () => {
      const AOS = (await import('aos')).default
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 0,
        anchorPlacement: 'top-bottom'
      })
    }

    initAOS()

    // Smooth scroll polyfill for older browsers
    if (typeof window !== 'undefined' && !('scrollBehavior' in document.documentElement.style)) {
      import('smoothscroll-polyfill').then(smoothscroll => {
        smoothscroll.polyfill()
      })
    }

    // Add scroll event listener for navbar background
    const handleScroll = () => {
      const navbar = document.getElementById('navbar')
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled')
        } else {
          navbar.classList.remove('scrolled')
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <main className="relative">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Why Attend Section */}
      <WhyAttend />

      {/* Speakers Section */}
      <Speakers />

      {/* Schedule Section */}
      <Schedule />

      {/* Tickets Section */}
      <Tickets />

      {/* Venue Section */}
      <Venue />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow" />
      </div>
    </main>
  )
}
