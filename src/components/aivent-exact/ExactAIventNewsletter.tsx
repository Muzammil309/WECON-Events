'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';

export default function ExactAIventNewsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Stay in the Loop
            </h2>
            <h3 className="text-2xl md:text-3xl font-semibold text-white/90 mb-6">
              Join the Future of Innovation
            </h3>
            <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Making better things takes time. Drop us your email to stay in the know as we work to reduce our environmental impact. We'll share other exciting news and exclusive offers, too.
            </p>
          </motion.div>

          {/* Newsletter Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md"
                required
              />
            </div>
            <motion.button
              type="submit"
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-full hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SIGN UP
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.form>

          {/* Checkbox and Terms */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <label className="flex items-center justify-center gap-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-2 border-white/30 bg-white/20 text-white focus:ring-white/50"
              />
              <span className="text-white/80">
                Keep me updated on other news and exclusive offers
              </span>
            </label>
            
            <p className="text-white/60 text-sm">
              Note: You can opt-out at any time. See our Privacy Policy and Terms.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
