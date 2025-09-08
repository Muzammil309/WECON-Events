'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ModernNavigation from '@/components/layout/ModernNavigation';
import ModernHero from '@/components/sections/ModernHero';
import AboutSection from '@/components/sections/AboutSection';
import ScrollingBanner from '@/components/sections/ScrollingBanner';
import SpeakersSection from '@/components/sections/SpeakersSection';
import ScheduleSection from '@/components/sections/ScheduleSection';
import TicketsSection from '@/components/sections/TicketsSection';
import ModernFeatures, { FeatureHighlight, StatsSection } from '@/components/sections/ModernFeatures';
import {
  Calendar,
  Users,
  BarChart3,
  MessageSquare,
  Zap,
  Shield,
  ArrowRight,
  Play,
  Star,
  Quote
} from 'lucide-react';

export default function Home() {
  const mockUser = {
    name: 'John Doe',
    email: 'john@wecon.com',
    role: 'Admin'
  };

  const handlePrimaryCTA = () => {
    console.log('Primary CTA clicked');
  };

  const handleSecondaryCTA = () => {
    console.log('Secondary CTA clicked');
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Navigation */}
      <ModernNavigation user={mockUser} onLogout={handleLogout} />

      {/* Hero Section */}
      <ModernHero
        title="AI Summit 2025"
        subtitle="The Future of Intelligence"
        description="Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work."
        eventDate={new Date('2025-10-01T09:00:00')}
        location="San Francisco, CA"
        attendeeCount={1000}
        primaryCTA={{
          label: "Get Tickets",
          href: "/tickets",
          onClick: handlePrimaryCTA
        }}
        secondaryCTA={{
          label: "View Schedule",
          href: "/agenda",
          onClick: handleSecondaryCTA
        }}
        showCountdown={true}
      />

      {/* About Section */}
      <AboutSection />

      {/* Scrolling Banner */}
      <ScrollingBanner />

      {/* Features Section - Why Attend */}
      <ModernFeatures
        title="What You'll Gain"
        subtitle="[ Why Attend ]"
        description="Hear from global AI pioneers, industry disruptors, and bold thinkers shaping the future across every domain."
      />

      {/* Quote Section */}
      <section className="section bg-surface-primary relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="bg-surface-secondary border border-border-primary rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-purple/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <Quote className="w-16 h-16 text-accent-blue mx-auto mb-8" />

                <blockquote className="text-2xl md:text-3xl font-medium text-text-primary mb-8 leading-relaxed">
                  "Artificial intelligence is advancing rapidly, and while it offers immense opportunity, it also poses significant risks. If not properly regulated and aligned with human values, AI could become a fundamental threat to civilization."
                </blockquote>

                <div className="text-xl font-semibold text-accent-blue">
                  Elon Musk
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Speakers Section */}
      <SpeakersSection />

      {/* Schedule Section */}
      <ScheduleSection />

      {/* Tickets Section */}
      <TicketsSection />

      {/* Venue Section */}
      <section id="section-venue" className="section bg-primary-bg relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-surface-primary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6">
              [ Event Location ]
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Location & Venue
            </h2>

            <p className="text-lg text-text-secondary leading-relaxed">
              Join us in the heart of innovation at San Francisco Tech Pavilion—surrounded by top hotels, transit, and culture.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-surface-primary border border-border-primary rounded-2xl p-8 h-96 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  <span className="text-2xl">📍</span>
                </div>
                <p className="text-text-secondary">Interactive Map Coming Soon</p>
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
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <span>📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Address</h3>
                  <p className="text-text-secondary">121 AI Blvd, San Francisco, CA 94107</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <span>📞</span>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Phone</h3>
                  <p className="text-text-secondary">Call: +1 123 456 789</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <span>✉️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Email</h3>
                  <p className="text-text-secondary">contact@wecon.com</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="section-faq" className="section bg-surface-primary relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-surface-secondary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6">
              [ FAQ ]
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Everything You Need to Know
            </h2>

            <p className="text-lg text-text-secondary leading-relaxed">
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
                className="bg-surface-secondary border border-border-primary rounded-xl p-6 hover:bg-surface-tertiary transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                  {faq.question}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section bg-primary-bg relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Stay in the Loop
            </h2>

            <h3 className="text-2xl font-semibold text-text-primary mb-6">
              Join the Future of Innovation
            </h3>

            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Making better things takes time. Drop us your email to stay in the know as we work to reduce our environmental impact. We'll share other exciting news and exclusive offers, too.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-surface-primary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
              <button className="btn btn-primary px-8 py-3">
                SIGN UP
              </button>
            </div>

            <div className="text-sm text-text-muted">
              <label className="flex items-center justify-center gap-2 mb-2">
                <input type="checkbox" className="rounded" />
                <span>Keep me updated on other news and exclusive offers</span>
              </label>
              <p>Note: You can opt-out at any time. See our Privacy Policy and Terms.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-primary border-t border-border-primary">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <span className="text-2xl font-bold text-text-primary">WECON</span>
              </div>
              <div className="space-y-2 text-text-secondary">
                <h3 className="font-semibold text-text-primary">Address</h3>
                <p>121 AI Blvd, San Francisco</p>
                <p>BCA 94107</p>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <div className="w-8 h-8 bg-surface-secondary rounded-lg flex items-center justify-center hover:bg-surface-tertiary transition-colors duration-200 cursor-pointer">
                  <span className="text-text-secondary">f</span>
                </div>
                <div className="w-8 h-8 bg-surface-secondary rounded-lg flex items-center justify-center hover:bg-surface-tertiary transition-colors duration-200 cursor-pointer">
                  <span className="text-text-secondary">t</span>
                </div>
                <div className="w-8 h-8 bg-surface-secondary rounded-lg flex items-center justify-center hover:bg-surface-tertiary transition-colors duration-200 cursor-pointer">
                  <span className="text-text-secondary">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-text-primary mb-4">Contact Us</h3>
              <div className="space-y-2 text-text-secondary">
                <p>T. +1 123 456 789</p>
                <p>M. contact@wecon.com</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-text-primary mb-4">Quick Links</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="/tickets" className="hover:text-text-primary transition-colors duration-200">Tickets</a></li>
                <li><a href="/agenda" className="hover:text-text-primary transition-colors duration-200">Schedule</a></li>
                <li><a href="/about" className="hover:text-text-primary transition-colors duration-200">About</a></li>
                <li><a href="/contact" className="hover:text-text-primary transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border-primary mt-12 pt-8 text-center">
            <p className="text-text-muted text-sm">
              Copyright 2025 - WECON by Designesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
