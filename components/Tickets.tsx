'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

// Official AIvent Demo 1 ticket data - exactly 3 tickets as in original
const tickets = [
  {
    id: 1,
    name: "Standard",
    price: 299,
    description: "October 1 to 5 - 10:00 AM",
    features: [
      "Access to keynotes and sessions.",
      "Admission to exhibitions and demos.",
      "Networking opportunities.",
      "Digital materials and session recordings."
    ],
    popular: false,
    variant: "standard"
  },
  {
    id: 2,
    name: "VIP",
    price: 699,
    description: "October 1 to 5 - 10:00 AM",
    features: [
      "All Standard benefits.",
      "VIP lounge access and exclusive events.",
      "Front-row seating and priority workshop access.",
      "VIP swag bag and exclusive content."
    ],
    popular: true,
    variant: "vip"
  },
  {
    id: 3,
    name: "Full Access",
    price: 1199,
    description: "October 1 to 5 - 10:00 AM",
    features: [
      "All VIP benefits.",
      "Access to all workshops and breakout sessions.",
      "Personalized session scheduling.",
      "Speaker meet-and-greet and after-party access."
    ],
    popular: false,
    variant: "premium"
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
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section
      id="section-tickets"
      className="section-padding text-white relative overflow-hidden pt-20"
      style={{ backgroundColor: '#101435' }}
    >
      {/* Background Image - exactly like original template */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/aivent-original/images/background/7.webp"
          alt="Background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101435] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#101435]" />
        <div className="absolute inset-0 bg-[#101435]/70" />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container-custom relative z-10"
      >
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div variants={itemVariants} className="subtitle mb-4">
            Ticket Options
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Choose Your <span className="aivent-text-gradient">Pass</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Select the perfect ticket for your needs and gain access to exclusive sessions, workshops, and more.
          </motion.p>
        </div>

        {/* Tickets Carousel - exactly 3 cards like original */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              variants={itemVariants}
              className="group relative"
            >
              {/* Popular Badge */}
              {ticket.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`relative overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                ticket.popular ? 'ring-2 ring-primary shadow-lg shadow-primary/25' : ''
              }`}>
                {/* Ticket Header - Styled exactly like original template */}
                <div className={`relative p-6 text-center ${
                  ticket.variant === 'premium' ? 'bg-gradient-to-br from-primary to-secondary' :
                  ticket.variant === 'vip' ? 'bg-gradient-to-br from-secondary to-primary' :
                  'bg-gradient-to-br from-dark-2 to-dark-3'
                }`}>
                  {/* AIvent Logo */}
                  <div className="mb-4">
                    <Image
                      src="/aivent-original/images/logo.webp"
                      alt="AIvent Logo"
                      width={80}
                      height={40}
                      className="mx-auto"
                    />
                  </div>

                  {/* Barcode */}
                  <div className="absolute top-4 right-4">
                    <Image
                      src="/aivent-original/images/misc/barcode.webp"
                      alt="Barcode"
                      width={40}
                      height={20}
                      className="opacity-60"
                    />
                  </div>

                  {/* Background Logo */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Image
                      src="/aivent-original/images/logo-big-white.webp"
                      alt="Background Logo"
                      width={120}
                      height={60}
                    />
                  </div>

                  {/* Ticket Info */}
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">{ticket.name}</h2>
                    <h4 className="text-3xl font-bold mb-4">${ticket.price}</h4>
                    <div className="text-sm opacity-80">{ticket.description}</div>
                  </div>
                </div>

                {/* Ticket Body */}
                <div className="bg-dark-2 p-6">
                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {ticket.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Buy Button */}
                  <Button
                    variant={ticket.popular ? "aivent" : "aivent-secondary"}
                    className="w-full"
                    size="lg"
                  >
                    Buy Ticket
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
