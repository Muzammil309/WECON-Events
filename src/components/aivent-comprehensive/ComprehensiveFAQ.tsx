'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function ComprehensiveFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is included in my ticket?",
      answer: "Your ticket includes access to all keynotes, workshops, networking sessions, meals, and digital materials. VIP tickets also include exclusive events and meet & greets."
    },
    {
      question: "Can I get a refund if I can't attend?",
      answer: "Yes, we offer full refunds up to 30 days before the event, 50% refunds up to 14 days before, and no refunds within 14 days of the event."
    },
    {
      question: "Will sessions be recorded?",
      answer: "Yes, all keynotes and selected workshops will be recorded and made available to attendees for 6 months after the event."
    },
    {
      question: "Is there a dress code?",
      answer: "Business casual is recommended. The venue is climate-controlled, so dress comfortably for a full day of learning and networking."
    },
    {
      question: "Are meals provided?",
      answer: "Standard and VIP tickets include lunch and coffee breaks. VIP tickets also include a welcome dinner and exclusive networking events."
    }
  ];

  return (
    <section 
      id="section-faq"
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
              FAQ
            </span>
          </motion.div>
          
          <h2 className="text-display text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about the AI Summit 2025.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="glass-effect rounded-2xl border border-white/10 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <Plus className="w-5 h-5 text-indigo-400" />
                  )}
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-white/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-white/70 mb-6">
            Still have questions? We're here to help.
          </p>
          <motion.button
            className="btn-secondary px-8 py-3 rounded-full font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
