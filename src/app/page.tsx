'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AIventNavigation from '@/components/layout/AIventNavigation';
import AIventHeroExact from '@/components/sections/AIventHeroExact';
import AIventAbout from '@/components/sections/AIventAbout';
import AIventScrollingBanner from '@/components/sections/AIventScrollingBanner';
import AIventFeatures from '@/components/sections/AIventFeatures';
import AIventQuote from '@/components/sections/AIventQuote';
import AIventSpeakers from '@/components/sections/AIventSpeakers';
import AIventSchedule from '@/components/sections/AIventSchedule';
import AIventTickets from '@/components/sections/AIventTickets';
import { Quote } from 'lucide-react';

export default function Home() {

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #101435 0%, #0F0B1F 50%, #1A1C26 100%)',
        fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
      }}
    >
      {/* Navigation */}
      <AIventNavigation />

      {/* Hero Section - Exact AIvent Replication */}
      <AIventHeroExact />

      {/* About Section */}
      <AIventAbout />

      {/* Scrolling Banner */}
      <AIventScrollingBanner />

      {/* Features Section - Why Attend */}
      <AIventFeatures />

      {/* Quote Section */}
      <AIventQuote />

      {/* Speakers Section */}
      <AIventSpeakers />

      {/* Schedule Section */}
      <AIventSchedule />

      {/* Tickets Section */}
      <AIventTickets />

      {/* Venue Section - Exact AIvent Style */}
      <section
        id="section-venue"
        className="relative py-24 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #101435 0%, #0F0B1F 50%, #1A1C26 100%)',
          fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px),
                linear-gradient(180deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '120px 120px'
            }}
          />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <div
              className="inline-flex items-center px-5 py-2 rounded-full text-sm font-medium mb-8"
              style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                color: '#A5B4FC'
              }}
            >
              Event Location
            </div>

            <h2
              className="text-white font-black mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
              }}
            >
              Location &{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Venue
              </span>
            </h2>

            <p
              className="text-white/80 leading-relaxed"
              style={{
                fontSize: '18px',
                lineHeight: 1.7,
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
              }}
            >
              Join us in the heart of innovation at San Francisco Tech Pavilion—surrounded by top hotels, transit, and culture.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 h-96 flex items-center justify-center rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <span className="text-2xl">??</span>
                </div>
                <p
                  className="text-white/70"
                  style={{
                    fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                    fontSize: '16px'
                  }}
                >
                  Interactive Map Coming Soon
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <span>??</span>
                </div>
                <div>
                  <h3
                    className="font-bold text-white mb-2"
                    style={{
                      fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                      fontSize: '18px'
                    }}
                  >
                    Address
                  </h3>
                  <p
                    className="text-white/70"
                    style={{
                      fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                      fontSize: '15px'
                    }}
                  >
                    121 AI Blvd, San Francisco, CA 94107
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <span>??</span>
                </div>
                <div>
                  <h3
                    className="font-bold text-white mb-2"
                    style={{
                      fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                      fontSize: '18px'
                    }}
                  >
                    Phone
                  </h3>
                  <p
                    className="text-white/70"
                    style={{
                      fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                      fontSize: '15px'
                    }}
                  >
                    Call: +1 123 456 789
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <span>??</span>
                </div>
                <div>
                  <h3
                    className="font-bold text-white mb-2"
                    style={{
                      fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                      fontSize: '18px'
                    }}
                  >
                    Email
                  </h3>
                  <p
                    className="text-white/70"
                    style={{
                      fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                      fontSize: '15px'
                    }}
                  >
                    contact@wecon.com
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Exact AIvent Style */}
      <section
        id="section-faq"
        className="relative py-24 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0F0B1F 0%, #101435 50%, #0F0B1F 100%)',
          fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px),
                linear-gradient(180deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
            }}
          />
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <div
              className="inline-flex items-center px-5 py-2 rounded-full text-sm font-medium mb-8"
              style={{
                background: 'rgba(118, 77, 240, 0.1)',
                border: '1px solid rgba(118, 77, 240, 0.2)',
                color: '#764DF0'
              }}
            >
              FAQ
            </div>

            <h2
              className="text-white font-black mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
              }}
            >
              Everything You{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Need to Know
              </span>
            </h2>

            <p
              className="text-white/80 leading-relaxed"
              style={{
                fontSize: '18px',
                lineHeight: 1.7,
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
              }}
            >
              Frequently Asked Questions
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "What is the AI Summit 2025?",
                answer: "The AI Summit 2025 is a premier event gathering leading AI experts, thought leaders, and innovators. It features keynotes, workshops, panels, and networking opportunities focusing on the latest advancements in artificial intelligence."
              },
              {
                question: "When and where will the event be held?",
                answer: "The AI Summit 2025 will take place from October 1-5, 2025 at 121 AI Blvd, San Francisco, CA 94107. More details about the venue and directions will be provided closer to the event."
              },
              {
                question: "How can I register for the event?",
                answer: "You can register for the AI Summit 2025 through our official website. Simply choose your ticket type and fill out the registration form."
              },
              {
                question: "What ticket options are available?",
                answer: "We offer a range of ticket options, including Standard, VIP, Full Access Pass, Student, and Virtual tickets. You can find more details about each ticket type in our Tickets section."
              },
              {
                question: "Can I transfer my ticket to someone else?",
                answer: "Tickets are non-transferable. If you are unable to attend, please contact our support team for assistance."
              },
              {
                question: "Will there be virtual participation?",
                answer: "Yes! For those who can't attend in person, we offer a Virtual Ticket. This provides access to live-streamed sessions, workshops, and networking opportunities online."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
                whileHover={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(99, 102, 241, 0.3)',
                  boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)'
                }}
              >
                <h3
                  className="text-white font-bold mb-3"
                  style={{
                    fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                    fontWeight: 700,
                    fontSize: '18px',
                    lineHeight: 1.3
                  }}
                >
                  {faq.question}
                </h3>
                <p
                  className="text-white/80 leading-relaxed"
                  style={{
                    fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                    fontSize: '15px',
                    lineHeight: 1.6
                  }}
                >
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Exact AIvent Style */}
      <section
        className="relative py-24 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #101435 0%, #0F0B1F 50%, #1A1C26 100%)',
          fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px),
                linear-gradient(180deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px'
            }}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2
              className="text-white font-black mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
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
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: 1.3
              }}
            >
              Join the Future of Innovation
            </h3>

            <p
              className="text-white/80 mb-8 leading-relaxed"
              style={{
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                fontSize: '16px',
                lineHeight: 1.6
              }}
            >
              Making better things takes time. Drop us your email to stay in the know as we work to reduce our environmental impact. We'll share other exciting news and exclusive offers, too.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
                }}
              />
              <motion.button
                className="px-8 py-3 text-white font-bold rounded-xl transition-all duration-300"
                style={{
                  fontSize: '14px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
                  boxShadow: '0 8px 24px rgba(118, 77, 240, 0.3)'
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 12px 32px rgba(118, 77, 240, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                SIGN UP
              </motion.button>
            </div>

            <div
              className="text-sm text-white/60"
              style={{
                fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                fontSize: '14px'
              }}
            >
              <label className="flex items-center justify-center gap-2 mb-2">
                <input
                  type="checkbox"
                  className="rounded"
                  style={{
                    accentColor: '#6366F1'
                  }}
                />
                <span>Keep me updated on other news and exclusive offers</span>
              </label>
              <p>Note: You can opt-out at any time. See our Privacy Policy and Terms.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Exact AIvent Style */}
      <footer
        className="relative"
        style={{
          background: 'linear-gradient(180deg, #0F0B1F 0%, #101435 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
                    boxShadow: '0 4px 16px rgba(118, 77, 240, 0.3)'
                  }}
                >
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <span
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif' }}
                >
                  WECON
                </span>
              </div>
              <div className="space-y-2 text-white/70">
                <h3
                  className="font-bold text-white"
                  style={{
                    fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                    fontSize: '16px'
                  }}
                >
                  Address
                </h3>
                <p style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif', fontSize: '14px' }}>
                  121 AI Blvd, San Francisco
                </p>
                <p style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif', fontSize: '14px' }}>
                  BCA 94107
                </p>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <motion.div
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  whileHover={{
                    scale: 1.1,
                    background: 'rgba(118, 77, 240, 0.2)'
                  }}
                >
                  <span className="text-white/70">f</span>
                </motion.div>
                <motion.div
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  whileHover={{
                    scale: 1.1,
                    background: 'rgba(118, 77, 240, 0.2)'
                  }}
                >
                  <span className="text-white/70">t</span>
                </motion.div>
                <motion.div
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  whileHover={{
                    scale: 1.1,
                    background: 'rgba(118, 77, 240, 0.2)'
                  }}
                >
                  <span className="text-white/70">in</span>
                </motion.div>
              </div>
            </div>

            <div>
              <h3
                className="font-bold text-white mb-4"
                style={{
                  fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                  fontSize: '16px'
                }}
              >
                Contact Us
              </h3>
              <div className="space-y-2 text-white/70">
                <p style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif', fontSize: '14px' }}>
                  T. +1 123 456 789
                </p>
                <p style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif', fontSize: '14px' }}>
                  M. contact@wecon.com
                </p>
              </div>
            </div>

            <div>
              <h3
                className="font-bold text-white mb-4"
                style={{
                  fontFamily: 'Manrope, Helvetica, Arial, sans-serif',
                  fontSize: '16px'
                }}
              >
                Quick Links
              </h3>
              <ul className="space-y-2 text-white/70">
                <li>
                  <a
                    href="/tickets"
                    className="hover:text-white transition-colors duration-200"
                    style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif', fontSize: '14px' }}
                  >
                    Tickets
                  </a>
                </li>
                <li>
                  <a
                    href="/agenda"
                    className="hover:text-white transition-colors duration-200"
                    style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif', fontSize: '14px' }}
                  >
                    Schedule
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                    style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif', fontSize: '14px' }}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors duration-200"
                    style={{ fontFamily: 'Manrope, Helvetica, Arial, sans-serif', fontSize: '14px' }}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="mt-12 pt-8 text-center"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
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
