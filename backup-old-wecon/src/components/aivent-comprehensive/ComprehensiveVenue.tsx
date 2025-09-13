'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Car, Plane, Train } from 'lucide-react';

export default function ComprehensiveVenue() {
  return (
    <section 
      id="section-venue"
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)'
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 mb-6 rounded-full glass-effect border border-white/20"
            >
              <span className="text-indigo-300 text-sm font-medium tracking-wider uppercase">
                Venue
              </span>
            </motion.div>
            
            <h2 className="text-display text-4xl md:text-5xl font-bold text-white mb-6">
              San Francisco <span className="gradient-text">Convention Center</span>
            </h2>
            
            <p className="text-xl text-white/80 mb-8">
              Located in the heart of San Francisco, our venue offers state-of-the-art facilities and stunning views of the city.
            </p>

            {/* Address */}
            <div className="flex items-start gap-4 mb-8">
              <MapPin className="w-6 h-6 text-indigo-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Address</h3>
                <p className="text-white/70">
                  121 AI Blvd, San Francisco<br />
                  California, BCA 94107
                </p>
              </div>
            </div>

            {/* Transportation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Getting There</h3>
              
              {[
                { icon: <Plane className="w-5 h-5" />, text: "15 min from SFO Airport" },
                { icon: <Train className="w-5 h-5" />, text: "2 blocks from BART station" },
                { icon: <Car className="w-5 h-5" />, text: "Valet parking available" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <span className="text-white/90">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Map Placeholder */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="glass-effect rounded-2xl border border-white/10 p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Interactive Map</h3>
                <p className="text-white/70">
                  Detailed venue map and directions will be available here
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
