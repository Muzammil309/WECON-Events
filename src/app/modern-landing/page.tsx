'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ModernNavigation from '@/components/layout/ModernNavigation';
import ModernHero from '@/components/sections/ModernHero';
import ModernFeatures, { FeatureHighlight, StatsSection } from '@/components/sections/ModernFeatures';
import AboutSection from '@/components/sections/AboutSection';
import ScrollingBanner from '@/components/sections/ScrollingBanner';
import SpeakersSection from '@/components/sections/SpeakersSection';
import ScheduleSection from '@/components/sections/ScheduleSection';
import TicketsSection from '@/components/sections/TicketsSection';
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

export default function ModernLandingPage() {
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
          label: "Register Now",
          href: "/register",
          onClick: handlePrimaryCTA
        }}
        secondaryCTA={{
          label: "Watch Trailer",
          href: "/trailer",
          onClick: handleSecondaryCTA
        }}
        showCountdown={true}
      />

      {/* About Section */}
      <AboutSection />

      {/* Scrolling Banner */}
      <ScrollingBanner />

      {/* Speakers Section */}
      <SpeakersSection />

      {/* Schedule Section */}
      <ScheduleSection />

      {/* Tickets Section */}
      <TicketsSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <ModernFeatures
        title="Why Attend AI Summit 2025"
        subtitle="[ Event Highlights ]"
        description="Discover cutting-edge AI technologies, network with industry leaders, and gain insights that will shape the future of your business."
      />

      {/* Feature Highlights */}
      <FeatureHighlight
        title="Advanced Attendee Networking"
        description="Connect your attendees with AI-powered recommendations, smart matching algorithms, and seamless networking tools that drive meaningful connections."
        image="/api/placeholder/600/400"
        features={[
          "AI-powered attendee matching based on interests and goals",
          "Real-time networking recommendations and suggestions",
          "Integrated meeting scheduling and calendar sync",
          "Digital business card exchange with QR codes",
          "Networking analytics and connection tracking"
        ]}
      />

      <FeatureHighlight
        title="Real-Time Analytics & Insights"
        description="Make data-driven decisions with comprehensive analytics, real-time dashboards, and detailed reporting that gives you complete visibility into your event performance."
        image="/api/placeholder/600/400"
        features={[
          "Real-time attendance tracking and engagement metrics",
          "Advanced reporting with custom date ranges and filters",
          "ROI tracking and revenue analysis",
          "Attendee behavior insights and journey mapping",
          "Exportable reports in multiple formats"
        ]}
        reversed={true}
      />

      {/* Testimonials Section */}
      <section className="section bg-surface-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-surface-secondary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6">
              [ What Our Clients Say ]
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Trusted by Event Professionals
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Event Director",
                company: "TechCorp",
                content: "WECON transformed how we manage our annual conference. The networking features alone increased attendee satisfaction by 40%.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Marketing Manager",
                company: "StartupHub",
                content: "The analytics and reporting capabilities are incredible. We can now track ROI and make data-driven decisions for future events.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Operations Lead",
                company: "Global Events",
                content: "The white-label customization allowed us to maintain our brand identity while leveraging powerful enterprise features.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-accent-blue mb-4" />
                
                <p className="text-text-secondary mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-text-muted">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-surface-primary to-surface-secondary border border-border-primary rounded-3xl p-12 relative overflow-hidden">
              {/* Background Elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-purple/10 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                  Ready to Revolutionize Your Events?
                </h2>
                
                <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                  Join thousands of event organizers who have transformed their events with WECON's enterprise-grade platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="btn btn-primary text-lg px-8 py-4 group">
                    Start Your Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                  
                  <button className="btn btn-secondary text-lg px-8 py-4 group">
                    <Play className="w-5 h-5" />
                    Schedule a Demo
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-8 mt-8 text-sm text-text-muted">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Enterprise Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>99.9% Uptime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-primary border-t border-border-primary">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <span className="text-2xl font-bold text-primary bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  WECON
                </span>
              </div>
              <p className="text-text-secondary mb-6 max-w-md">
                The world's most advanced event management platform, trusted by thousands of event organizers worldwide.
              </p>
              <div className="flex items-center gap-4">
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
              <h3 className="font-semibold text-text-primary mb-4">Product</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="#" className="hover:text-text-primary transition-colors duration-200">Features</a></li>
                <li><a href="#" className="hover:text-text-primary transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-text-primary transition-colors duration-200">Integrations</a></li>
                <li><a href="#" className="hover:text-text-primary transition-colors duration-200">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-text-primary mb-4">Company</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="#" className="hover:text-text-primary transition-colors duration-200">About</a></li>
                <li><a href="#" className="hover:text-text-primary transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="hover:text-text-primary transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="hover:text-text-primary transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border-primary mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-muted text-sm">
              © 2024 WECON. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <a href="#" className="hover:text-text-secondary transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-text-secondary transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-text-secondary transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
