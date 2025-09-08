'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '#about' },
  { label: 'Why Attend', href: '#why-attend' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Tickets', href: '#tickets' },
  { label: 'Venue', href: '#venue' },
  { label: 'FAQ', href: '#faq' },
  { 
    label: 'Pages', 
    href: '#',
    children: [
      { label: 'Tickets Style 1', href: '/tickets' },
      { label: 'Tickets Style 2', href: '/tickets-alt' },
      { label: 'News', href: '/blog' },
      { label: 'News Single', href: '/blog/post' },
      { label: 'Contact', href: '/contact' },
    ]
  }
];

export default function AIventNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'backdrop-blur-xl border-b'
          : 'bg-transparent'
      }`}
      style={{
        background: isScrolled
          ? 'rgba(30, 27, 75, 0.9)'
          : 'transparent',
        borderColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, 0.03, 0.28, 0.98] }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Exact AIvent Style */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              {/* Exact AIvent logo design */}
              <div className="w-12 h-12 relative">
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-white font-black text-xl"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900 }}
                  >
                    A
                  </span>
                </div>
              </div>
            </div>
            <span
              className="text-2xl font-black text-white tracking-tight"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.02em'
              }}
            >
              AIVENT
            </span>
          </Link>

          {/* Desktop Navigation - Exact AIvent Style */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <div
                    className="relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === item.label ? null : item.label);
                    }}
                  >
                    <button
                      className="flex items-center space-x-1 text-white/90 hover:text-white transition-colors duration-300 py-2 font-medium"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        letterSpacing: '0.02em'
                      }}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-3 w-56 rounded-2xl shadow-2xl overflow-hidden"
                          style={{
                            background: 'rgba(30, 27, 75, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-5 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200"
                              onClick={() => setActiveDropdown(null)}
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (item.href.startsWith('#')) {
                        scrollToSection(item.href);
                      } else {
                        window.location.href = item.href;
                      }
                    }}
                    className="font-medium text-white/90 hover:text-white transition-colors duration-300 py-2"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '0.02em'
                    }}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* Buy Tickets Button & Mobile Toggle - Exact AIvent Style */}
          <div className="flex items-center space-x-4">
            {/* Buy Tickets Button - Exact AIvent Style */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/tickets"
                className="hidden md:inline-flex items-center px-8 py-3 text-white font-bold rounded-xl transition-all duration-300"
                style={{
                  fontSize: '12px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
                }}
              >
                Buy Tickets
              </Link>
            </motion.div>

            {/* Mobile Menu Toggle - Exact AIvent Style */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl transition-colors duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-border-primary"
            >
              <nav className="py-4 space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                          className="flex items-center justify-between w-full px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-surface-primary rounded-lg transition-colors duration-200"
                        >
                          <span className="font-medium">{item.label}</span>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform duration-200 ${
                              activeDropdown === item.label ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        
                        <AnimatePresence>
                          {activeDropdown === item.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-4 mt-2 space-y-1"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-primary hover:text-text-primary rounded-lg transition-colors duration-200"
                                  onClick={() => {
                                    setIsOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (item.href.startsWith('#')) {
                            scrollToSection(item.href);
                          } else {
                            window.location.href = item.href;
                          }
                          setIsOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 rounded-lg font-medium text-text-secondary hover:bg-surface-primary hover:text-text-primary transition-colors duration-200"
                      >
                        {item.label}
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Mobile Buy Tickets Button */}
                <div className="px-4 pt-4">
                  <Link
                    href="/tickets"
                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Buy Tickets
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
