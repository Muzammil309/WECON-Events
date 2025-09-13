'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { scrollToElement } from '@/lib/utils'

const navigationItems = [
  { label: 'Home', href: 'section-hero' },
  { label: 'About', href: 'section-about' },
  { label: 'Why Attend', href: 'section-why-attend' },
  { label: 'Speakers', href: 'section-speakers' },
  { label: 'Schedule', href: 'section-schedule' },
  { label: 'Tickets', href: 'section-tickets' },
  { label: 'Venue', href: 'section-venue' },
  { label: 'FAQ', href: 'section-faq' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('section-hero')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const handleSectionChange = () => {
      const sections = navigationItems.map(item => item.href)
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('scroll', handleSectionChange)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleSectionChange)
    }
  }, [])

  const handleNavClick = (href: string) => {
    scrollToElement(href)
    setIsMobileMenuOpen(false)
  }

  const navbarVariants = {
    transparent: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      backdropFilter: 'blur(0px)',
    },
    scrolled: {
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(20px)',
    },
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  }

  const menuItemVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  }

  return (
    <>
      <motion.header
        variants={navbarVariants}
        animate={isScrolled ? 'scrolled' : 'transparent'}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <button
                onClick={() => handleNavClick('section-hero')}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <div className="relative w-10 h-10">
                  <Image
                    src="/assets/images/logo.webp"
                    alt="AIvent Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-2xl font-bold aivent-text-gradient">
                  AIvent
                </span>
              </button>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:flex items-center space-x-8"
            >
              {navigationItems.map((item, index) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === item.href
                      ? 'text-primary'
                      : 'text-white/80'
                  }`}
                >
                  {item.label}
                  {activeSection === item.href && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              ))}
            </motion.nav>

            {/* Desktop CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="hidden lg:block"
            >
              <Button
                variant="aivent"
                onClick={() => handleNavClick('section-tickets')}
                className="px-6"
              >
                Buy Tickets
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-primary transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Mobile Menu */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-80 bg-dark/95 backdrop-blur-xl border-l border-white/10 z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8">
                      <Image
                        src="/assets/images/logo.webp"
                        alt="AIvent Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xl font-bold aivent-text-gradient">
                      AIvent
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-white hover:text-primary transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 py-6">
                  <nav className="space-y-2">
                    {navigationItems.map((item, index) => (
                      <motion.button
                        key={item.href}
                        custom={index}
                        variants={menuItemVariants}
                        initial="closed"
                        animate="open"
                        onClick={() => handleNavClick(item.href)}
                        className={`w-full text-left px-6 py-3 text-lg font-medium transition-colors hover:text-primary hover:bg-white/5 ${
                          activeSection === item.href
                            ? 'text-primary bg-white/5'
                            : 'text-white/80'
                        }`}
                      >
                        {item.label}
                      </motion.button>
                    ))}
                  </nav>
                </div>

                {/* Mobile CTA */}
                <div className="p-6 border-t border-white/10">
                  <Button
                    variant="aivent"
                    onClick={() => handleNavClick('section-tickets')}
                    className="w-full"
                  >
                    Buy Tickets
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
