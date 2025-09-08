'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';

interface TicketTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary';
}

interface TicketsSectionProps {
  subtitle?: string;
  title?: string;
  description?: string;
  tickets?: TicketTier[];
}

const defaultTickets: TicketTier[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 299,
    originalPrice: 399,
    description: 'Perfect for individual attendees looking to explore AI innovations.',
    features: [
      'Access to all keynote sessions',
      'Workshop participation',
      'Networking events',
      'Conference materials',
      'Lunch included',
      'Digital certificate'
    ],
    icon: <Star className="w-6 h-6" />,
    buttonText: 'Get Early Bird',
    buttonVariant: 'secondary'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 599,
    description: 'Ideal for professionals seeking comprehensive AI insights and networking.',
    features: [
      'Everything in Early Bird',
      'VIP seating at keynotes',
      'Exclusive speaker meet & greets',
      'Premium workshop access',
      'Welcome reception',
      'Conference swag bag',
      'Priority support'
    ],
    popular: true,
    icon: <Zap className="w-6 h-6" />,
    buttonText: 'Choose Professional',
    buttonVariant: 'primary'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    description: 'Complete package for teams and organizations with premium benefits.',
    features: [
      'Everything in Professional',
      'Private meeting rooms',
      'Dedicated account manager',
      'Custom workshop sessions',
      'Executive dinner invitation',
      'Post-event consultation',
      'Team collaboration tools',
      'Lifetime access to recordings'
    ],
    icon: <Crown className="w-6 h-6" />,
    buttonText: 'Go Enterprise',
    buttonVariant: 'secondary'
  }
];

export default function TicketsSection({
  subtitle = "[ Event Tickets ]",
  title = "Choose Your Experience",
  description = "Select the perfect ticket tier for your AI Summit 2025 experience. All tickets include access to keynotes, workshops, and networking events.",
  tickets = defaultTickets
}: TicketsSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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
    <section id="section-tickets" className="section bg-primary-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
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

        {/* Tickets Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {tickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              variants={itemVariants}
              className="relative group"
            >
              {/* Popular Badge */}
              {ticket.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`card h-full p-8 text-center transition-all duration-300 ${
                ticket.popular 
                  ? 'border-accent-blue shadow-xl scale-105' 
                  : 'hover:scale-105'
              }`}>
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 ${
                  ticket.popular 
                    ? 'bg-gradient-primary' 
                    : 'bg-gradient-to-br from-gray-600 to-gray-700'
                }`}>
                  {ticket.icon}
                </div>

                {/* Ticket Name */}
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  {ticket.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-text-primary">
                      ${ticket.price}
                    </span>
                    {ticket.originalPrice && (
                      <span className="text-lg text-text-muted line-through">
                        ${ticket.originalPrice}
                      </span>
                    )}
                  </div>
                  {ticket.originalPrice && (
                    <div className="text-sm text-success font-medium">
                      Save ${ticket.originalPrice - ticket.price}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-text-secondary mb-8 leading-relaxed">
                  {ticket.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 text-left">
                  {ticket.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-text-secondary text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className={`btn w-full ${
                  ticket.buttonVariant === 'primary' ? 'btn-primary' : 'btn-secondary'
                }`}>
                  {ticket.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-surface-primary border border-border-primary rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              Group Discounts Available
            </h3>
            <p className="text-text-secondary mb-6">
              Bring your team and save! Contact us for special pricing on groups of 5 or more attendees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-secondary">
                Contact Sales
              </button>
              <button className="btn btn-primary">
                View Group Pricing
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
