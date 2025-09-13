'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'

export default function Tickets() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="section-tickets" className="section-padding bg-dark text-white">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="container-custom text-center"
      >
        <div className="subtitle mb-4">Get Your Tickets</div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Choose Your <span className="aivent-text-gradient">Experience</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16">
          Select the perfect ticket for your AI Summit 2025 experience.
        </p>
        
        {/* Placeholder for pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {['Early Bird', 'Standard', 'VIP'].map((tier, index) => (
            <div key={tier} className="card-aivent p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">{tier}</h3>
              <div className="text-4xl font-bold text-primary mb-6">
                ${299 + (index * 200)}
              </div>
              <Button variant="aivent" className="w-full">
                Get Tickets
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
