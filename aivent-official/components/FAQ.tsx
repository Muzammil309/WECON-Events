'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Plus, Minus, HelpCircle } from 'lucide-react'

const faqData = [
  {
    id: 1,
    question: 'What is included in my ticket?',
    answer: 'Your ticket includes access to all keynote sessions, workshops, networking events, lunch and coffee breaks, welcome kit with materials, digital resources, and a certificate of attendance. VIP tickets include additional perks like meet & greets and exclusive events.',
    category: 'tickets'
  },
  {
    id: 2,
    question: 'Can I get a refund if I cannot attend?',
    answer: 'Yes, we offer a full refund up to 30 days before the event. Between 30-14 days, we offer a 50% refund. Within 14 days of the event, tickets are non-refundable but can be transferred to another person.',
    category: 'tickets'
  },
  {
    id: 3,
    question: 'Will sessions be recorded?',
    answer: 'Yes, all keynote sessions and selected workshops will be recorded and made available to ticket holders within 48 hours after the event. You will receive access to a private portal with all recordings.',
    category: 'general'
  },
  {
    id: 4,
    question: 'Is there parking available at the venue?',
    answer: 'Yes, there are several parking garages within walking distance of Moscone Center. VIP ticket holders receive complimentary valet parking. We also recommend using public transportation as the venue is well-connected.',
    category: 'venue'
  },
  {
    id: 5,
    question: 'What should I bring to the event?',
    answer: 'Bring your ticket confirmation (digital or printed), business cards for networking, a laptop or tablet for workshops, and comfortable shoes for walking between sessions. We will provide all necessary materials and refreshments.',
    category: 'general'
  },
  {
    id: 6,
    question: 'Are there networking opportunities?',
    answer: 'Absolutely! We have dedicated networking sessions, coffee breaks, lunch periods, and evening events. VIP ticket holders get access to exclusive networking dinners and meet & greet sessions with speakers.',
    category: 'general'
  },
  {
    id: 7,
    question: 'Can I change my ticket type after purchase?',
    answer: 'Yes, you can upgrade your ticket type by paying the difference. Downgrades are not available, but you can transfer your ticket to someone else if needed. Contact our support team for assistance.',
    category: 'tickets'
  },
  {
    id: 8,
    question: 'Is the event suitable for beginners?',
    answer: 'Yes! We have sessions designed for all skill levels, from beginners to advanced practitioners. Each session is clearly labeled with its difficulty level, and we offer introductory workshops for those new to AI.',
    category: 'general'
  }
]

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

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
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const faqVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  return (
    <section id="faq" className="section-padding relative bg-slate-900/30">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
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
            <HelpCircle className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">FAQ</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Frequently Asked{' '}
            <span className="aivent-text-gradient">Questions</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about AI Summit 2025. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={faq.id}
                variants={faqVariants}
                className="card-aivent overflow-hidden"
              >
                <motion.button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-800/30 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  
                  <motion.div
                    animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    {openItems.includes(faq.id) ? (
                      <Minus className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <Plus className="w-5 h-5 text-yellow-400" />
                    )}
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {openItems.includes(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="border-t border-slate-700 pt-4">
                          <p className="text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <div className="card-aivent p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-6">
              Our support team is here to help you with any questions about 
              AI Summit 2025. Get in touch and we'll respond within 24 hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-aivent-primary"
              >
                Contact Support
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-aivent-secondary"
              >
                Live Chat
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
