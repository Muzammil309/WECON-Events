'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollProgress';

export default function ComprehensiveNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const scrollY = useScrollPosition();
  
  const isScrolled = scrollY > 50;

  const navItems = [
    { 
      name: 'Home', 
      href: '#section-hero',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Demo 1', href: '#demo-1' },
        { name: 'Demo 2', href: '#demo-2' },
        { name: 'Demo 3', href: '#demo-3' },
        { name: 'Demo 4', href: '#demo-4' },
        { name: 'Demo 5', href: '#demo-5' }
      ]
    },
    { name: 'About', href: '#section-about' },
    { name: 'Why Attend', href: '#section-why-attend' },
    { name: 'Speakers', href: '#section-speakers' },
    { name: 'Schedule', href: '#section-schedule' },
    { name: 'Tickets', href: '#section-tickets' },
    { name: 'Venue', href: '#section-venue' },
    { name: 'FAQ', href: '#section-faq' },
    { 
      name: 'Pages', 
      href: '#pages',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Tickets Style 1', href: '#tickets-1' },
        { name: 'Tickets Style 2', href: '#tickets-2' },
        { name: 'News', href: '#news' },
        { name: 'News Single', href: '#news-single' },
        { name: 'Contact', href: '#contact' }
      ]
    }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass-effect-strong border-b border-white/10' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Exact AIvent Style */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              {/* Logo Icon - Recreated from original */}
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <div className="w-8 h-8 relative">
                    {/* AI Symbol */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white rounded-lg relative">
                        <div className="absolute inset-1 bg-white rounded-sm opacity-80"></div>
                        <div className="absolute top-1 left-1 w-1 h-1 bg-indigo-500 rounded-full"></div>
                        <div className="absolute bottom-1 right-1 w-1 h-1 bg-purple-500 rounded-full"></div>
                      </div>
                    </div>
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
              <div key={item.name} className="relative">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.hasDropdown) {
                      handleDropdownToggle(item.name);
                    } else {
                      scrollToSection(item.href);
                    }
                  }}
                  className="flex items-center gap-1 text-white/80 hover:text-white font-medium transition-colors duration-300 relative group text-sm py-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-300 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                  
                  {/* Hover underline */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.hasDropdown && activeDropdown === item.name && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 w-48 glass-effect-strong rounded-xl border border-white/10 shadow-xl overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                        <motion.button
                          key={dropdownItem.name}
                          onClick={() => scrollToSection(dropdownItem.href)}
                          className="w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: dropdownIndex * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          {dropdownItem.name}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
            className="lg:hidden absolute top-full left-0 right-0 glass-effect-strong border-b border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-6">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <div key={item.name}>
                    <motion.button
                      onClick={() => {
                        if (item.hasDropdown) {
                          handleDropdownToggle(item.name);
                        } else {
                          scrollToSection(item.href);
                        }
                      }}
                      className="flex items-center justify-between w-full text-white/80 hover:text-white font-medium text-left py-3 border-b border-white/10 hover:border-indigo-400/50 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 10 }}
                    >
                      <span>{item.name}</span>
                      {item.hasDropdown && (
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform duration-300 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`} 
                        />
                      )}
                    </motion.button>

                    {/* Mobile Dropdown */}
                    <AnimatePresence>
                      {item.hasDropdown && activeDropdown === item.name && (
                        <motion.div
                          className="ml-4 mt-2 space-y-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                            <motion.button
                              key={dropdownItem.name}
                              onClick={() => scrollToSection(dropdownItem.href)}
                              className="block w-full text-left text-white/60 hover:text-white py-2 text-sm transition-colors duration-300"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: dropdownIndex * 0.05 }}
                            >
                              {dropdownItem.name}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
