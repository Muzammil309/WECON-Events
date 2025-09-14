'use client'

import Image from 'next/image'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ]

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-3 gap-8 items-center text-center lg:text-left">
          {/* Address */}
          <div>
            <h3 className="text-xl font-bold mb-4">Address</h3>
            <p className="text-gray-300 leading-relaxed">
              121 AI Blvd, San Francisco<br />
              BCA 94107
            </p>
          </div>

          {/* Logo and Social */}
          <div className="text-center">
            <div className="mb-6">
              <Image
                src="/aivent-original/images/logo.webp"
                alt="AIvent Logo"
                width={150}
                height={75}
                className="mx-auto"
              />
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-12 h-12 bg-dark-2 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300 group"
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="text-gray-300 space-y-2">
              <p>T. +1 123 456 789</p>
              <p>M. contact@aivent.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Footer */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 - AIvent by Designesia</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
