'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, Mail, ArrowUp, Twitter, Linkedin, Facebook, Instagram, Youtube, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { scrollToElement } from '@/lib/utils'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    event: [
      { name: 'About', href: 'about' },
      { name: 'Speakers', href: 'speakers' },
      { name: 'Schedule', href: 'schedule' },
      { name: 'Tickets', href: 'tickets' },
      { name: 'Venue', href: 'venue' }
    ],
    support: [
      { name: 'FAQ', href: 'faq' },
      { name: 'Contact Us', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' }
    ],
    community: [
      { name: 'Newsletter', href: '#newsletter' },
      { name: 'Blog', href: '#' },
      { name: 'Press Kit', href: '#' },
      { name: 'Partnerships', href: '#' },
      { name: 'Become a Sponsor', href: '#' }
    ]
  }

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
    { icon: Github, href: '#', label: 'GitHub', color: 'hover:text-gray-400' }
  ]

  return (
    <footer className="footer-aivent relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500" />
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container-custom py-16">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Logo */}
                <div className="flex items-center space-x-2">
                  <div className="relative w-10 h-10">
                    <Image
                      src="/assets/images/logo/logo.webp"
                      alt="AIvent Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold font-heading aivent-text-gradient">
                      AIvent
                    </span>
                    <span className="text-sm text-gray-400 -mt-1">
                      2025
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 leading-relaxed">
                  The premier artificial intelligence summit bringing together the brightest minds 
                  to shape the future of technology and innovation.
                </p>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-2 grid md:grid-cols-3 gap-8">
              {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                >
                  <h3 className="text-white font-semibold text-lg mb-4 capitalize">
                    {category === 'event' ? 'Event' : category === 'support' ? 'Support' : 'Community'}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link, index) => (
                      <li key={index}>
                        <motion.button
                          onClick={() => {
                            if (link.href.startsWith('#')) {
                              scrollToElement(link.href.substring(1))
                            }
                          }}
                          whileHover={{ x: 5 }}
                          className="text-gray-400 hover:text-purple-400 transition-colors duration-300 cursor-pointer text-left"
                        >
                          {link.name}
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Newsletter Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-white font-semibold text-lg">Stay Updated</h3>
                <p className="text-gray-400">
                  Get the latest updates about speakers, agenda, and exclusive offers.
                </p>

                {!isSubscribed ? (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400"
                      required
                    />
                    <Button
                      type="submit"
                      variant="aivent"
                      className="w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Subscribe
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-center"
                  >
                    <p className="text-green-400 font-medium">
                      Thanks for subscribing! 🎉
                    </p>
                  </motion.div>
                )}

                <p className="text-xs text-gray-500">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="container-custom py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-400 text-sm text-center md:text-left">
                © 2025 AI Summit. All rights reserved. Built with ❤️ for the AI community.
              </div>

              <div className="flex items-center gap-6">
                <div className="text-gray-400 text-sm">
                  October 1-5, 2025 • San Francisco, CA
                </div>
                
                {/* Scroll to Top Button */}
                <motion.button
                  onClick={scrollToTop}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Event Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-t border-indigo-500/30"
        >
          <div className="container-custom py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">
                  Early Bird Registration Open - Save up to $100!
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToElement('tickets')}
                className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
              >
                Register Now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
