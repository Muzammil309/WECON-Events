'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function ExactAIventFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'What is the AI Summit 2025?',
      answer: 'The AI Summit 2025 is a premier event gathering leading AI experts, thought leaders, and innovators. It features keynotes, workshops, panels, and networking opportunities focusing on the latest advancements in artificial intelligence.'
    },
    {
      question: 'When and where will the event be held?',
      answer: 'The AI Summit 2025 will take place from October 1-5, 2025 at 121 AI Blvd, San Francisco, CA 94107. More details about the venue and directions will be provided closer to the event.'
    },
    {
      question: 'How can I register for the event?',
      answer: 'You can register for the AI Summit 2025 through our official website. Simply choose your ticket type and fill out the registration form.'
    },
    {
      question: 'What ticket options are available?',
      answer: 'We offer a range of ticket options, including Standard, VIP, Full Access Pass, Student, and Virtual tickets. You can find more details about each ticket type on our Tickets section.'
    },
    {
      question: 'Can I transfer my ticket to someone else?',
      answer: 'Tickets are non-transferable. If you are unable to attend, please contact our support team for assistance.'
    },
    {
      question: 'Will there be virtual participation?',
      answer: 'Yes! For those who can\'t attend in person, we offer a Virtual Ticket. This provides access to live-streamed sessions, workshops, and networking opportunities online.'
    }
  ];

  return (
    <section 
      id="section-faq"
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
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
              Everything You Need to Know
            </span>
          </motion.div>
          
          <h2 className="text-display text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="glass-effect rounded-2xl border border-white/10 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
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
      </div>
    </section>
  );
}
