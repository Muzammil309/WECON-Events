'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function AIventQuote() {
  return (
    <section className="section bg-surface-primary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-accent-purple/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-surface-secondary border border-border-primary rounded-3xl p-12 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-purple/10 rounded-full blur-2xl" />

            <div className="relative z-10 text-center">
              {/* Quote Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center text-white mx-auto mb-8"
              >
                <Quote className="w-8 h-8" />
              </motion.div>

              {/* Quote Text */}
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-2xl md:text-3xl font-medium text-text-primary mb-8 leading-relaxed italic"
              >
                "Artificial intelligence is advancing rapidly, and while it offers immense opportunity, it also poses significant risks. If not properly regulated and aligned with human values, AI could become a fundamental threat to civilization."
              </motion.blockquote>

              {/* Attribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center justify-center gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <div className="text-left">
                  <div className="text-xl font-semibold text-accent-blue">
                    Elon Musk
                  </div>
                  <div className="text-sm text-text-muted">
                    CEO, Tesla & SpaceX
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
