'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Zap, 
  Shield,
  Globe,
  Palette,
  Network,
  Brain,
  Clock,
  Award
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface ModernFeaturesProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Advanced Networking",
    description: "AI-powered attendee matching and networking recommendations based on interests and professional goals.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Smart Session Management",
    description: "Real-time capacity management with automatic waitlist processing and intelligent scheduling.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Advanced Analytics",
    description: "Comprehensive reporting with real-time dashboards, engagement metrics, and ROI tracking.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Multi-Channel Communications",
    description: "Integrated email, SMS, and push notifications with branded templates and automation.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Real-Time Synchronization",
    description: "Live updates across all modules with WebSocket technology for instant data synchronization.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Enterprise Security",
    description: "GDPR, CCPA, and SOC2 compliance with advanced security features and audit logging.",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Multi-Language Support",
    description: "Support for 7+ languages with RTL support and dynamic language switching.",
    color: "from-teal-500 to-blue-500"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "White-Label Customization",
    description: "Complete branding control with custom themes, domains, and mobile app customization.",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: <Network className="w-8 h-8" />,
    title: "Enterprise Integrations",
    description: "Connect with CRM, marketing tools, calendars, and 5000+ apps through Zapier.",
    color: "from-cyan-500 to-blue-500"
  }
];

export default function ModernFeatures({
  title = "Powerful Features",
  subtitle = "[ Everything You Need ]",
  description = "Discover the comprehensive suite of enterprise-grade features that make WECON the ultimate event management platform.",
  features = defaultFeatures
}: ModernFeaturesProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.03, 0.28, 0.98]
      }
    }
  };

  return (
    <section className="section bg-primary-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-surface-primary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6">
            {subtitle}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            {title}
          </h2>
          
          <p className="text-lg text-text-secondary leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="card h-full p-8 hover:scale-105 transition-all duration-300">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    {feature.icon}
                  </div>
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-text-primary mb-4 group-hover:text-accent-blue transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-accent-blue text-sm font-medium">
                    Learn more
                    <motion.div
                      className="ml-2"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-surface-primary border border-border-primary rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Ready to Transform Your Events?
            </h3>
            <p className="text-text-secondary mb-6">
              Join thousands of event organizers who trust WECON for their most important events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary">
                Start Free Trial
              </button>
              <button className="btn btn-secondary">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Additional Feature Components

export function FeatureHighlight({ 
  title, 
  description, 
  image, 
  features, 
  reversed = false 
}: {
  title: string;
  description: string;
  image: string;
  features: string[];
  reversed?: boolean;
}) {
  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${reversed ? 'lg:grid-flow-col-dense' : ''}`}>
          <motion.div
            initial={{ opacity: 0, x: reversed ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={reversed ? 'lg:col-start-2' : ''}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              {title}
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              {description}
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-text-secondary">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: reversed ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={reversed ? 'lg:col-start-1' : ''}
          >
            <div className="relative">
              <img
                src={image}
                alt={title}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-bg/20 to-transparent rounded-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  const stats = [
    { number: "10K+", label: "Events Hosted", icon: <Calendar className="w-6 h-6" /> },
    { number: "1M+", label: "Attendees Served", icon: <Users className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Zap className="w-6 h-6" /> },
    { number: "24/7", label: "Support", icon: <Clock className="w-6 h-6" /> }
  ];

  return (
    <section className="section bg-surface-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-text-secondary">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
