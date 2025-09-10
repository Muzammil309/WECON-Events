'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ExactAIventVenue() {
  return (
    <section 
      id="section-venue"
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 mb-6 rounded-full glass-effect border border-white/20"
          >
            <span className="text-indigo-300 text-sm font-medium tracking-wider uppercase">
              Event Location
            </span>
          </motion.div>
          
          <h2 className="text-display text-4xl md:text-5xl font-bold text-white mb-6">
            Location & <span className="gradient-text">Venue</span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Join us in the heart of innovation at San Francisco Tech Pavilion—surrounded by top hotels, transit, and culture.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Map Placeholder */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-effect rounded-2xl border border-white/10 p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Interactive Map</h3>
                <p className="text-white/60">San Francisco Tech Pavilion</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Address */}
            <motion.div
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Address</h3>
                <p className="text-white/80">121 AI Blvd, San Francisco, CA 94107</p>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Phone</h3>
                <p className="text-white/80">Call: +1 123 456 789</p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                <p className="text-white/80">contact@aivent.com</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
