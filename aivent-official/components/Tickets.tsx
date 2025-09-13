'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, Star, Ticket, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const pricingTiers = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Perfect for individual attendees',
    price: 299,
    originalPrice: 399,
    currency: 'USD',
    period: 'Full Access',
    popular: false,
    available: true,
    features: [
      'Access to all sessions',
      'Welcome kit & materials',
      'Lunch & coffee breaks',
      'Networking events',
      'Digital resources',
      'Certificate of attendance'
    ],
    cta: 'Get Early Bird',
    savings: 100,
    deadline: 'February 1, 2025'
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Most popular choice',
    price: 399,
    originalPrice: null,
    currency: 'USD',
    period: 'Full Access',
    popular: true,
    available: true,
    features: [
      'Access to all sessions',
      'Welcome kit & materials',
      'Lunch & coffee breaks',
      'Networking events',
      'Digital resources',
      'Certificate of attendance',
      'Workshop materials',
      'Priority seating'
    ],
    cta: 'Get Standard',
    savings: null,
    deadline: null
  },
  {
    id: 'vip',
    name: 'VIP Experience',
    description: 'Premium access with exclusive perks',
    price: 699,
    originalPrice: null,
    currency: 'USD',
    period: 'Full Access',
    popular: false,
    available: true,
    features: [
      'All Standard features',
      'VIP lounge access',
      'Meet & greet with speakers',
      'Exclusive dinner event',
      'Premium welcome kit',
      'Front row seating',
      'One-on-one sessions',
      'Lifetime digital access'
    ],
    cta: 'Get VIP Access',
    savings: null,
    deadline: null
  }
]

export default function Tickets() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <section id="tickets" className="section-padding relative bg-slate-900/50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container-custom relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-white/20 mb-6"
          >
            <Ticket className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-gray-300">Event Tickets</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Choose Your{' '}
            <span className="aivent-text-gradient">Experience</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Select the perfect ticket for your AI Summit 2025 experience. 
            All tickets include access to sessions, networking, and digital resources.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`pricing-card-aivent relative ${
                tier.popular ? 'pricing-card-popular' : ''
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Early Bird Badge */}
              {tier.savings && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-semibold">
                    Save ${tier.savings}
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 mb-6">{tier.description}</p>
                
                <div className="mb-4">
                  {tier.originalPrice && (
                    <div className="text-gray-500 line-through text-lg mb-1">
                      ${tier.originalPrice}
                    </div>
                  )}
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-black text-white">${tier.price}</span>
                    <span className="text-gray-400">{tier.currency}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{tier.period}</p>
                </div>

                {tier.deadline && (
                  <div className="text-orange-400 text-sm font-medium">
                    Early bird ends {tier.deadline}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                variant={tier.popular ? "aivent" : "aivent-outline"}
                size="lg"
                className="w-full group relative overflow-hidden"
                disabled={!tier.available}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {tier.cta}
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </span>
                {tier.popular && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16 max-w-3xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Secure Payment</h4>
              <p className="text-gray-400 text-sm">SSL encrypted checkout</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Instant Delivery</h4>
              <p className="text-gray-400 text-sm">Digital tickets via email</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Money Back</h4>
              <p className="text-gray-400 text-sm">30-day guarantee</p>
            </div>
          </div>

          <p className="text-gray-400 text-sm">
            Questions about tickets? Contact our support team at{' '}
            <a href="mailto:tickets@aisummit2025.com" className="text-indigo-400 hover:text-indigo-300">
              tickets@aisummit2025.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
