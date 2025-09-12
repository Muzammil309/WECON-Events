import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, Star, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

const Tickets = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const ticketPlans = [
    {
      name: 'Basic',
      price: 299,
      originalPrice: 399,
      icon: Check,
      description: 'Perfect for students and individual developers',
      features: [
        'Access to all keynote sessions',
        'Basic networking events',
        'Digital conference materials',
        'Live streaming access',
        'Community forum access'
      ],
      popular: false,
      color: 'blue'
    },
    {
      name: 'Standard',
      price: 599,
      originalPrice: 799,
      icon: Star,
      description: 'Ideal for professionals and small teams',
      features: [
        'Everything in Basic',
        'Access to all workshops',
        'Priority seating',
        'Networking lunch included',
        'Speaker meet & greet',
        'Conference swag bag',
        'Recording access (30 days)'
      ],
      popular: true,
      color: 'purple'
    },
    {
      name: 'VIP',
      price: 999,
      originalPrice: 1299,
      icon: Zap,
      description: 'Ultimate experience for executives and enterprises',
      features: [
        'Everything in Standard',
        'VIP lounge access',
        'Private dinner with speakers',
        'One-on-one mentoring session',
        'Exclusive after-party access',
        'Premium conference materials',
        'Lifetime recording access',
        'Priority customer support'
      ],
      popular: false,
      color: 'gold'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  const getColorClasses = (color, isPopular) => {
    const colors = {
      blue: {
        border: 'border-blue-500/50',
        gradient: 'from-blue-600 to-blue-700',
        icon: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-300'
      },
      purple: {
        border: 'border-purple-500',
        gradient: 'from-purple-600 to-purple-700',
        icon: 'text-purple-400',
        badge: 'bg-purple-500/20 text-purple-300'
      },
      gold: {
        border: 'border-yellow-500/50',
        gradient: 'from-yellow-600 to-yellow-700',
        icon: 'text-yellow-400',
        badge: 'bg-yellow-500/20 text-yellow-300'
      }
    }
    return colors[color]
  }

  return (
    <section id="tickets" className="section-padding">
      <div className="container-custom">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-purple-400 font-semibold text-lg">Pricing Plans</span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2 mb-6">
              Choose Your <span className="gradient-text">Experience</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Select the perfect ticket for your needs. All plans include access to 
              our world-class content and networking opportunities.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {ticketPlans.map((plan, index) => {
              const colorClasses = getColorClasses(plan.color, plan.popular)
              const IconComponent = plan.icon

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`relative ${plan.popular ? 'md:-mt-8' : ''}`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <Card className={`glass-effect ${colorClasses.border} hover:border-opacity-100 transition-all duration-300 h-full ${plan.popular ? 'border-2 scale-105' : 'border'}`}>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${colorClasses.gradient} flex items-center justify-center`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-white mb-2">
                        {plan.name}
                      </CardTitle>
                      <p className="text-gray-400 text-sm mb-4">
                        {plan.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-4xl font-bold gradient-text">
                            ${plan.price}
                          </span>
                          <span className="text-gray-400 line-through">
                            ${plan.originalPrice}
                          </span>
                        </div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colorClasses.badge}`}>
                          Save ${plan.originalPrice - plan.price}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Features List */}
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Button
                        variant={plan.popular ? "gradient" : "outline"}
                        size="lg"
                        className={`w-full ${!plan.popular ? `border-${plan.color}-500 text-${plan.color}-400 hover:bg-${plan.color}-500 hover:text-white` : ''}`}
                      >
                        {plan.popular ? 'Get Started' : 'Choose Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Additional Info */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <p className="text-gray-400 mb-4">
              All prices are in USD. Early bird pricing ends December 1st, 2024.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                Group Discounts Available
              </Button>
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                Student Pricing
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Tickets
