'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';

export default function ComprehensiveTickets() {
  const [selectedPlan, setSelectedPlan] = useState(1);

  const plans = [
    {
      id: 0,
      name: 'Early Bird',
      price: '$299',
      originalPrice: '$399',
      popular: false,
      features: [
        'Access to all keynotes',
        'Networking sessions',
        'Digital materials',
        'Basic support'
      ]
    },
    {
      id: 1,
      name: 'Standard',
      price: '$499',
      originalPrice: '$599',
      popular: true,
      features: [
        'Everything in Early Bird',
        'Workshop access',
        'Premium networking',
        'Lunch included',
        'Priority support'
      ]
    },
    {
      id: 2,
      name: 'VIP',
      price: '$899',
      originalPrice: '$1099',
      popular: false,
      features: [
        'Everything in Standard',
        'VIP lounge access',
        'Meet & greet with speakers',
        'Exclusive dinner',
        'Dedicated concierge'
      ]
    }
  ];

  return (
    <section 
      id="section-tickets"
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
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
              Pricing
            </span>
          </motion.div>
          
          <h2 className="text-display text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your <span className="gradient-text">Experience</span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Select the perfect ticket for your AI journey. All plans include access to our world-class content.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative group cursor-pointer ${
                plan.popular ? 'md:-mt-8' : ''
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </motion.div>
              )}

              <div className={`glass-effect rounded-2xl border transition-all duration-500 h-full ${
                selectedPlan === plan.id
                  ? 'border-indigo-400/60 bg-white/10'
                  : 'border-white/10 group-hover:border-indigo-400/40'
              } ${plan.popular ? 'border-indigo-400/40' : ''}`}>
                
                <div className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  
                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-lg text-white/60 line-through">{plan.originalPrice}</span>
                    </div>
                    <p className="text-white/70 text-sm mt-1">per person</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-white/90">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.button
                    className={`w-full py-4 rounded-full font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-white/60">
            All prices include taxes. Group discounts available for 5+ attendees.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
