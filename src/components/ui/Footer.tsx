'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Facebook,
  Youtube,
  Calendar,
  Ticket,
  BarChart3,
  Monitor,
  Users,
  Cloud
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { name: 'Agenda', href: '/agenda', icon: Calendar },
    { name: 'Tickets', href: '/tickets', icon: Ticket },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Signage', href: '/signage', icon: Monitor },
    { name: 'Resources', href: '/resources', icon: Cloud },
    { name: 'Community', href: '/community', icon: Users },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press Kit', href: '/press' },
    { name: 'Blog', href: '/blog' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
  ];

  // Define social links with explicit typing to prevent hydration issues
  const socialLinks: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    target: '_blank';
    rel: 'noopener noreferrer';
  }> = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/weconmasawat',
      icon: Twitter,
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/weconmasawat',
      icon: Linkedin,
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    {
      name: 'GitHub',
      href: 'https://github.com/weconmasawat',
      icon: Github,
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/weconmasawat',
      icon: Instagram,
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/weconmasawat',
      icon: Facebook,
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/weconmasawat',
      icon: Youtube,
      target: '_blank',
      rel: 'noopener noreferrer'
    },
  ];

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">WECON Masawat</span>
              </Link>
              <p className="text-gray-300 mb-6 leading-relaxed">
                The premier event management platform bringing together industry leaders,
                innovators, and professionals for world-class conferences and experiences.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Mail className="h-4 w-4 text-indigo-400" />
                  <a href="mailto:info@weconmasawat.com" className="hover:text-white transition-colors">
                    info@weconmasawat.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Phone className="h-4 w-4 text-indigo-400" />
                  <a href="tel:+923001234567" className="hover:text-white transition-colors">
                    +92 300 123 4567
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <MapPin className="h-4 w-4 text-indigo-400" />
                  <span>Karachi, Pakistan</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
                    >
                      <link.icon className="h-4 w-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Company Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 mb-6">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Newsletter Signup */}
              <div>
                <h4 className="font-medium mb-3">Stay Updated</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 rounded-lg hover:from-indigo-700 hover:to-fuchsia-700 transition-all">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Get the latest updates about events and features.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm text-gray-400"
            >
              © {currentYear} WECON Masawat. All rights reserved. Built with ❤️ for the event community.
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </footer>
  );
}
