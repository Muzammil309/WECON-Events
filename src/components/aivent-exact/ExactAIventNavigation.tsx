'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollProgress';

export default function ExactAIventNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollY = useScrollPosition();
  
  const isScrolled = scrollY > 50;

  const navItems = [
    { name: 'Home', href: '#section-hero' },
    { name: 'About', href: '#section-about' },
    { name: 'Why Attend', href: '#section-why-attend' },
    { name: 'Speakers', href: '#section-speakers' },
    { name: 'Schedule', href: '#section-schedule' },
    { name: 'Tickets', href: '#section-tickets' },
    { name: 'Venue', href: '#section-venue' },
    { name: 'FAQ', href: '#section-faq' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-md border-b border-white/10' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              {/* Logo Icon - Exact AIvent style */}
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-full relative">
                    <div className="absolute inset-1 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Logo Text */}
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  AI<span className="text-indigo-400">vent</span>
                </h1>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden lg:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-white/80 hover:text-white font-medium transition-colors duration-300 relative group text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item.name}
                
                {/* Hover underline */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </motion.button>
            ))}
          </motion.nav>

          {/* CTA Button */}
          <motion.div
            className="hidden lg:flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={() => scrollToSection('#section-tickets')}
              className="btn-primary px-6 py-3 rounded-full text-sm font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Buy Tickets
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 text-white hover:text-indigo-400 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-6">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-white/80 hover:text-white font-medium text-left py-3 border-b border-white/10 hover:border-indigo-400/50 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
                
                {/* Mobile CTA */}
                <motion.button
                  onClick={() => scrollToSection('#section-tickets')}
                  className="btn-primary mt-6 px-6 py-4 rounded-full font-semibold text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Buy Tickets
                </motion.button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
