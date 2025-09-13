'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Footer() {
  return (
    <footer className="bg-dark text-white border-t border-gray-800">
      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/assets/images/logo.webp"
                  alt="AIvent Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold aivent-text-gradient">
                AIvent
              </span>
            </div>
            <p className="text-gray-400">
              The premier AI conference bringing together the brightest minds in artificial intelligence.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#section-about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#section-speakers" className="hover:text-primary transition-colors">Speakers</a></li>
              <li><a href="#section-schedule" className="hover:text-primary transition-colors">Schedule</a></li>
              <li><a href="#section-tickets" className="hover:text-primary transition-colors">Tickets</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <p>San Francisco, CA</p>
              <p>October 1-5, 2025</p>
              <p>info@aisummit2025.com</p>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <div className="space-y-4">
              <Input 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-700"
              />
              <Button variant="aivent" className="w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 AI Summit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
