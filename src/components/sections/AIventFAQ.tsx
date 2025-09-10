'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function AIventFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is AI Summit 2025?",
      answer: "AI Summit 2025 is the premier conference bringing together AI researchers, industry leaders, and innovators to explore the latest developments in artificial intelligence and machine learning."
    },
    {
      question: "Who should attend this event?",
      answer: "This event is perfect for AI researchers, data scientists, machine learning engineers, tech entrepreneurs, students, and anyone interested in the future of artificial intelligence."
    },
    {
      question: "What topics will be covered?",
      answer: "We'll cover cutting-edge AI research, practical applications, ethical AI, machine learning frameworks, neural networks, computer vision, natural language processing, and the future of AI in various industries."
    },
    {
      question: "Are there networking opportunities?",
      answer: "Yes! We have dedicated networking sessions, coffee breaks, lunch meetings, and evening social events designed to help you connect with fellow attendees and industry experts."
    },
    {
      question: "Will sessions be recorded?",
      answer: "Yes, all main sessions will be recorded and made available to registered attendees for 30 days after the event. Workshop sessions may have limited recording based on the presenter's preference."
    },
    {
      question: "What's included in the ticket price?",
      answer: "Your ticket includes access to all sessions, workshops, networking events, conference materials, lunch, coffee breaks, and access to recorded sessions for 30 days."
    },
    {
      question: "Is there a refund policy?",
      answer: "Yes, we offer full refunds up to 30 days before the event, 50% refunds up to 14 days before, and no refunds within 14 days of the event date."
    },
    {
      question: "How can I become a speaker?",
      answer: "Speaker applications are currently closed for 2025, but you can join our mailing list to be notified when applications open for future events."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      id="section-faq"
      className="py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #101435 0%, #0F0B1F 50%, #1A1C26 100%)',
        fontFamily: 'Manrope, Helvetica, Arial, sans-serif'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(118, 77, 240, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(118, 77, 240, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block px-6 py-2 mb-6 rounded-full border border-purple-500/30"
            style={{
              background: 'rgba(118, 77, 240, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span className="text-purple-300 text-sm font-medium tracking-wider uppercase">
              FAQ
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Frequently Asked
            <br />
            <span 
              className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Questions
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about AI Summit 2025. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div
                className="rounded-2xl border border-purple-500/20 overflow-hidden"
                style={{
                  background: 'rgba(118, 77, 240, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-purple-500/10 transition-colors duration-300"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-purple-400" />
                  </motion.div>
                </button>
                
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
                        <p className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-6">
            Still have questions? We're here to help!
          </p>
          <motion.button
            className="px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #764DF0 0%, #442490 100%)',
              boxShadow: '0 10px 30px rgba(118, 77, 240, 0.3)'
            }}
            whileHover={{
              boxShadow: '0 15px 40px rgba(118, 77, 240, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
