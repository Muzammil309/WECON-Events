'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function AIventVenue() {
  return (
    <section
      id="section-venue"
      className="py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #101435 0%, #0F0B1F 50%, #1A1C26 100%)',
        fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-surface-secondary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6">
            Event Location
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Location & Venue
          </h2>

          <p className="text-lg text-text-secondary leading-relaxed">
            Join us in the heart of innovation at San Francisco Tech Pavilion—surrounded by top hotels, transit, and culture.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-surface-secondary border border-border-primary rounded-2xl p-8 h-96 flex items-center justify-center relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-accent-blue rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-purple rounded-full blur-2xl" />
              
              {/* Grid pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }} />
            </div>

            {/* Map content */}
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Interactive Map
              </h3>
              <p className="text-text-muted">
                Coming Soon
              </p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Address</h3>
                <p className="text-text-secondary">121 AI Blvd, San Francisco, CA 94107</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Phone</h3>
                <p className="text-text-secondary">Call: +1 123 456 789</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Email</h3>
                <p className="text-text-secondary">contact@aivent.com</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-surface-secondary border border-border-primary rounded-xl p-6 mt-8">
              <h4 className="font-semibold text-text-primary mb-3">Getting There</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>• 5 minutes from San Francisco International Airport</li>
                <li>• Multiple public transit options available</li>
                <li>• Parking available on-site and nearby</li>
                <li>• Accessible venue with full ADA compliance</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
