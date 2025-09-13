'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AIventNavigation from '@/components/layout/AIventNavigation';
import AIventHeroExact from '@/components/sections/AIventHeroExact';
import AIventAbout from '@/components/sections/AIventAbout';
import AIventScrollingBanner from '@/components/sections/AIventScrollingBanner';
import AIventWhyAttend from '@/components/sections/AIventWhyAttend';
import AIventFeatures from '@/components/sections/AIventFeatures';
import AIventQuote from '@/components/sections/AIventQuote';
import AIventSpeakers from '@/components/sections/AIventSpeakers';
import AIventSchedule from '@/components/sections/AIventSchedule';
import AIventTickets from '@/components/sections/AIventTickets';
import AIventVenue from '@/components/sections/AIventVenue';
import AIventFAQ from '@/components/sections/AIventFAQ';
import AIventFooter from '@/components/layout/AIventFooter';

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #101435 0%, #0F0B1F 50%, #1A1C26 100%)',
        fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
      }}
    >
      <AIventNavigation />
      <AIventHeroExact />
      <AIventAbout />
      <AIventScrollingBanner />
      <AIventWhyAttend />
      <AIventFeatures />
      <AIventQuote />
      <AIventSpeakers />
      <AIventSchedule />
      <AIventTickets />
      <AIventVenue />
      <AIventFAQ />
      <AIventFooter />

      {/* Venue Section */}
      <section 
        className="py-20 px-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #101435 0%, #1A1C26 50%, #0F0B1F 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 
              className="text-5xl font-black mb-6"
              style={{
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Event Venue
            </h2>
            <p 
              className="text-white/80 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
            >
              Join us at the prestigious venue in the heart of the city
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div 
                className="p-8 rounded-2xl"
                style={{
                  background: 'rgba(118, 77, 240, 0.1)',
                  border: '1px solid rgba(118, 77, 240, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <h3 
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
                >
                  Convention Center
                </h3>
                <p 
                  className="text-white/70 mb-6"
                  style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
                >
                  State-of-the-art facilities with cutting-edge technology and modern amenities.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}>
                      5000+ Capacity
                    </span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}>
                      Premium Audio/Visual
                    </span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}>
                      Networking Spaces
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div 
                className="aspect-video rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-white rounded-full"></div>
                    </div>
                    <p 
                      className="text-white font-medium"
                      style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
                    >
                      Venue Preview
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section 
        className="py-20 px-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F0B1F 0%, #101435 50%, #1A1C26 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 
              className="text-5xl font-black mb-6"
              style={{
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "What is included in the ticket price?",
                answer: "All sessions, networking events, meals, and conference materials are included."
              },
              {
                question: "Is there a dress code for the event?",
                answer: "Business casual attire is recommended for all sessions and networking events."
              },
              {
                question: "Will sessions be recorded?",
                answer: "Yes, all main sessions will be recorded and available to attendees after the event."
              },
              {
                question: "What COVID-19 safety measures are in place?",
                answer: "We follow all local health guidelines and provide sanitization stations throughout the venue."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-2xl"
                style={{
                  background: 'rgba(118, 77, 240, 0.1)',
                  border: '1px solid rgba(118, 77, 240, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <h3 
                  className="text-xl font-bold text-white mb-3"
                  style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
                >
                  {faq.question}
                </h3>
                <p 
                  className="text-white/70"
                  style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
                >
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section 
        className="py-20 px-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #101435 0%, #0F0B1F 50%, #1A1C26 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 
              className="text-5xl font-black mb-6"
              style={{
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.02em'
              }}
            >
              Stay in the{' '}
              <span style={{ background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Loop
              </span>
            </h2>

            <h3
              className="text-white font-bold mb-6"
              style={{
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 700,
                lineHeight: 1.2
              }}
            >
              Subscribe to our newsletter for updates
            </h3>

            <p 
              className="text-white/70 text-lg mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
            >
              Get the latest news, speaker announcements, and exclusive content delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-purple-400"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
                }}
              />
              <button
                className="px-8 py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
                  fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
                }}
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-12 px-4 border-t"
        style={{
          background: 'linear-gradient(135deg, #0F0B1F 0%, #101435 100%)',
          borderColor: 'rgba(118, 77, 240, 0.2)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 
                className="text-2xl font-black"
                style={{
                  fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                  background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                WECON
              </h3>
            </div>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
            >
              Copyright 2025 - WECON by Designesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
