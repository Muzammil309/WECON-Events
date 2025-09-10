'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function AIventNavigationPixelPerfect() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          ? 'bg-black/90 backdrop-blur-md border-b border-purple-500/20' 
          : 'bg-transparent'
      }`}
      style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              {/* Logo Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)'
                }}
              >
                <span className="text-white font-black text-lg">AI</span>
              </div>
              
              {/* Logo Text */}
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  AI<span className="text-purple-400">vent</span>
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
                className="text-white hover:text-purple-400 font-medium transition-colors duration-300 relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item.name}
                
                {/* Hover underline */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300" />
              </motion.button>
            ))}
          </motion.nav>

          {/* CTA Button */}
          <motion.div
            className="hidden lg:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={() => scrollToSection('#section-tickets')}
              className="px-6 py-3 rounded-full text-white font-bold transition-all duration-300 group relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
                boxShadow: '0 8px 25px rgba(118, 77, 240, 0.3)'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 12px 35px rgba(118, 77, 240, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                Buy Tickets
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 text-white hover:text-purple-400 transition-colors duration-300"
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
            className="lg:hidden absolute top-full left-0 right-0"
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)'
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-white hover:text-purple-400 font-medium text-lg text-left py-3 border-b border-gray-800 hover:border-purple-500 transition-all duration-300"
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
                  className="mt-6 px-6 py-4 rounded-full text-white font-bold text-center transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
                    boxShadow: '0 8px 25px rgba(118, 77, 240, 0.3)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Buy Tickets →
                </motion.button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"
        style={{
          width: `${Math.min((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%`
        }}
        initial={{ width: 0 }}
        animate={{ 
          width: typeof window !== 'undefined' 
            ? `${Math.min((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%`
            : '0%'
        }}
        transition={{ duration: 0.1 }}
      />
    </motion.header>
  );
}
