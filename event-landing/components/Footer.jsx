import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Mail, ArrowUp, Twitter, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = (e) => {
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
      { name: 'About', href: '#about' },
      { name: 'Agenda', href: '#agenda' },
      { name: 'Speakers', href: '#speakers' },
      { name: 'Tickets', href: '#tickets' },
      { name: 'Gallery', href: '#gallery' }
    ],
    support: [
      { name: 'Contact Us', href: '#contact' },
      { name: 'FAQ', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' }
    ],
    connect: [
      { name: 'Newsletter', href: '#newsletter' },
      { name: 'Blog', href: '#' },
      { name: 'Press Kit', href: '#' },
      { name: 'Partnerships', href: '#' },
      { name: 'Sponsors', href: '#' }
    ]
  }

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ]

  return (
    <footer className="relative bg-slate-900/50 border-t border-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-transparent to-blue-500" />
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
                  <Calendar className="h-8 w-8 text-purple-400" />
                  <span className="text-2xl font-bold font-heading gradient-text">
                    EventPro
                  </span>
                </div>

                <p className="text-gray-400 leading-relaxed">
                  The premier technology innovation summit bringing together the brightest minds 
                  to shape the future of technology and business.
                </p>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 hover:bg-purple-500/20 transition-all duration-300"
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
                    {category === 'event' ? 'Event' : category === 'support' ? 'Support' : 'Connect'}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                        >
                          {link.name}
                        </a>
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
                      variant="gradient"
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
              <div className="text-gray-400 text-sm">
                © 2024 EventPro. All rights reserved. Built with ❤️ for the tech community.
              </div>

              <div className="flex items-center gap-6">
                <div className="text-gray-400 text-sm">
                  December 15-17, 2024 • San Francisco, CA
                </div>
                
                {/* Scroll to Top Button */}
                <motion.button
                  onClick={scrollToTop}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center text-white transition-colors duration-300"
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
