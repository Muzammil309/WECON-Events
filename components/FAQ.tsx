'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronDown, ChevronUp } from 'lucide-react'

// Official AIvent Demo 1 FAQ data
const faqData = [
  {
    id: 1,
    question: "What is the AI Summit 2025?",
    answer: "The AI Summit 2025 is a premier event gathering leading AI experts, thought leaders, and innovators. It features keynotes, workshops, panels, and networking opportunities focusing on the latest advancements in artificial intelligence."
  },
  {
    id: 2,
    question: "When and where will the event be held?",
    answer: "The AI Summit 2025 will take place from October 1-5, 2025 at San Francisco Tech Pavilion, 121 AI Blvd, San Francisco, CA 94107. More details about the venue and directions will be provided closer to the event."
  },
  {
    id: 3,
    question: "How can I register for the event?",
    answer: "You can register for the AI Summit 2025 through our official website. Simply choose your ticket type and fill out the registration form."
  },
  {
    id: 4,
    question: "What ticket options are available?",
    answer: "We offer a range of ticket options, including Standard, VIP, Full Access Pass, Student, and Virtual tickets. You can find more details about each ticket type in our Tickets section."
  },
  {
    id: 5,
    question: "Can I transfer my ticket to someone else?",
    answer: "Tickets are non-transferable. If you are unable to attend, please contact our support team for assistance."
  },
  {
    id: 6,
    question: "Will there be virtual participation?",
    answer: "Yes! For those who can't attend in person, we offer a Virtual Ticket. This provides access to live-streamed sessions, workshops, and networking opportunities online."
  }
]

export default function FAQ() {
  const [activeItem, setActiveItem] = useState<number | null>(1)
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
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const toggleItem = (id: number) => {
    setActiveItem(activeItem === id ? null : id)
  }

  return (
    <section id="section-faq" className="section-padding text-white" style={{ backgroundColor: '#101435' }}>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container-custom"
      >
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column - Header */}
          <div className="lg:col-span-5">
            <motion.div variants={itemVariants} className="subtitle mb-4">
              Everything You Need to Know
            </motion.div>
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Frequently Asked <span className="aivent-text-gradient">Questions</span>
            </motion.h2>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-7">
            <motion.div variants={itemVariants} className="space-y-4">
              {faqData.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/50"
                >
                  {/* Question */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between bg-dark-2 hover:bg-dark-3 transition-colors duration-300"
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {item.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {activeItem === item.id ? (
                        <ChevronUp className="w-5 h-5 text-primary" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Answer */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: activeItem === item.id ? "auto" : 0,
                      opacity: activeItem === item.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-5 bg-dark-3">
                      <p className="text-gray-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
