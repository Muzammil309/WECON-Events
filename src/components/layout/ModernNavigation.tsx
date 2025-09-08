'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, Settings, LogOut } from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

interface ModernNavigationProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  onLogout?: () => void;
}

const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Events', href: '/admin/events' },
  { label: 'Attendees', href: '/admin/attendees' },
  { label: 'Sessions', href: '/admin/sessions' },
  { label: 'Speakers', href: '/admin/speakers' },
  { label: 'Tickets', href: '/admin/tickets' },
  { label: 'Analytics', href: '/admin/analytics' },
  { 
    label: 'More', 
    href: '#',
    children: [
      { label: 'Communications', href: '/admin/communications' },
      { label: 'Digital Signage', href: '/admin/digital-signage' },
      { label: 'Networking', href: '/admin/networking' },
      { label: 'Integrations', href: '/admin/integrations' },
      { label: 'Settings', href: '/admin/settings' },
    ]
  }
];

export default function ModernNavigation({ user, onLogout }: ModernNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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
      setUserDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActiveLink = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-primary-bg/95 backdrop-blur-md border-b border-border-primary' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, 0.03, 0.28, 0.98] }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="text-2xl font-bold text-primary bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              WECON
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
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
                    <button className="flex items-center space-x-1 text-text-secondary hover:text-text-primary transition-colors duration-200 py-2">
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
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-surface-primary border border-border-primary rounded-xl shadow-xl overflow-hidden"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-4 py-3 text-sm transition-colors duration-200 ${
                                isActiveLink(child.href)
                                  ? 'bg-surface-secondary text-text-primary border-l-2 border-accent-blue'
                                  : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                              }`}
                              onClick={() => setActiveDropdown(null)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`font-medium transition-colors duration-200 py-2 ${
                      isActiveLink(item.href)
                        ? 'text-text-primary border-b-2 border-accent-blue'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {/* User Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserDropdownOpen(!userDropdownOpen);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-surface-primary transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-text-primary">{user.name}</div>
                    <div className="text-xs text-text-muted">{user.role}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-surface-primary border border-border-primary rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-border-primary">
                        <div className="font-medium text-text-primary">{user.name}</div>
                        <div className="text-sm text-text-muted">{user.email}</div>
                      </div>
                      
                      <Link
                        href="/admin/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-200"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      
                      <Link
                        href="/admin/settings"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-200"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout?.();
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-surface-primary transition-colors duration-200"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-text-primary" />
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
                                  className={`block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                    isActiveLink(child.href)
                                      ? 'bg-surface-secondary text-text-primary'
                                      : 'text-text-secondary hover:bg-surface-primary hover:text-text-primary'
                                  }`}
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
                      <Link
                        href={item.href}
                        className={`block px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                          isActiveLink(item.href)
                            ? 'bg-surface-secondary text-text-primary'
                            : 'text-text-secondary hover:bg-surface-primary hover:text-text-primary'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
