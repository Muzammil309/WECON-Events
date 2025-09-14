'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { scrollToElement } from '@/lib/utils'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleNavClick = (href: string) => {
    if (href.startsWith('#section-')) {
      scrollToElement(href.replace('#', ''))
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark/95 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/aivent-original/images/logo.webp"
                alt="AIvent"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>

            {/* Desktop Navigation - Simplified as requested */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button
                className="text-white hover:text-primary transition-colors duration-200"
                onClick={() => handleNavClick('#section-hero')}
              >
                Home
              </button>

              <button
                className="text-white hover:text-primary transition-colors duration-200"
                onClick={() => handleNavClick('#section-about')}
              >
                About
              </button>

              <button
                className="text-white hover:text-primary transition-colors duration-200"
                onClick={() => handleNavClick('#section-why-attend')}
              >
                Why Attend
              </button>

              <button
                className="text-white hover:text-primary transition-colors duration-200"
                onClick={() => handleNavClick('#section-speakers')}
              >
                Speakers
              </button>

              <button
                className="text-white hover:text-primary transition-colors duration-200"
                onClick={() => handleNavClick('#section-schedule')}
              >
                Schedule
              </button>

              <button
                className="text-white hover:text-primary transition-colors duration-200"
                onClick={() => handleNavClick('#section-tickets')}
              >
                Tickets
              </button>

              <button
                className="text-white hover:text-primary transition-colors duration-200"
                onClick={() => handleNavClick('#section-venue')}
              >
                Venue
              </button>

              <button
                className="text-white hover:text-primary transition-colors duration-200"
                onClick={() => handleNavClick('#section-faq')}
              >
                FAQ
              </button>


            </nav>

            {/* Buy Tickets Button */}
            <div className="hidden lg:flex">
              <button
                onClick={() => handleNavClick('#section-tickets')}
                className="bg-gradient-to-r from-primary to-secondary px-6 py-2.5 rounded-full text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105"
              >
                Buy Tickets
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-primary transition-colors"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Menu Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-dark/95 backdrop-blur-xl border-l border-white/10 z-50 lg:hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Image
                  src="/aivent-original/images/logo.webp"
                  alt="AIvent"
                  width={100}
                  height={32}
                  className="h-8 w-auto"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white hover:text-primary transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 py-6">
                <nav className="space-y-2 px-6">
                  <button
                    onClick={() => handleNavClick('#section-hero')}
                    className="block w-full text-left text-white hover:text-primary transition-colors duration-200 py-3 border-b border-white/10"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleNavClick('#section-about')}
                    className="block w-full text-left text-white hover:text-primary transition-colors duration-200 py-3 border-b border-white/10"
                  >
                    About
                  </button>
                  <button
                    onClick={() => handleNavClick('#section-why-attend')}
                    className="block w-full text-left text-white hover:text-primary transition-colors duration-200 py-3 border-b border-white/10"
                  >
                    Why Attend
                  </button>
                  <button
                    onClick={() => handleNavClick('#section-speakers')}
                    className="block w-full text-left text-white hover:text-primary transition-colors duration-200 py-3 border-b border-white/10"
                  >
                    Speakers
                  </button>
                  <button
                    onClick={() => handleNavClick('#section-schedule')}
                    className="block w-full text-left text-white hover:text-primary transition-colors duration-200 py-3 border-b border-white/10"
                  >
                    Schedule
                  </button>
                  <button
                    onClick={() => handleNavClick('#section-tickets')}
                    className="block w-full text-left text-white hover:text-primary transition-colors duration-200 py-3 border-b border-white/10"
                  >
                    Tickets
                  </button>
                  <button
                    onClick={() => handleNavClick('#section-venue')}
                    className="block w-full text-left text-white hover:text-primary transition-colors duration-200 py-3 border-b border-white/10"
                  >
                    Venue
                  </button>
                  <button
                    onClick={() => handleNavClick('#section-faq')}
                    className="block w-full text-left text-white hover:text-primary transition-colors duration-200 py-3 border-b border-white/10"
                  >
                    FAQ
                  </button>
                </nav>
              </div>

              {/* Mobile CTA */}
              <div className="p-6 border-t border-white/10">
                <button
                  onClick={() => handleNavClick('#section-tickets')}
                  className="w-full bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-full text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                >
                  Buy Tickets
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
