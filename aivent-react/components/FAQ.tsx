'use client'

import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const faqs = [
    {
      question: 'What is the AI Summit 2025?',
      answer: 'The AI Summit 2025 is a premier event gathering leading AI experts, thought leaders, and innovators. It features keynotes, workshops, panels, and networking opportunities focusing on the latest advancements in artificial intelligence.'
    },
    {
      question: 'When and where will the event be held?',
      answer: 'The AI Summit 2025 will take place from October 1-5, 2025 at the San Francisco Tech Pavilion located at 121 AI Blvd, San Francisco, CA 94107. More details about the venue and directions will be provided closer to the event.'
    },
    {
      question: 'How can I register for the event?',
      answer: 'You can register for the AI Summit 2025 through our official website. Simply choose your ticket type and fill out the registration form. We accept all major credit cards and offer early bird discounts.'
    },
    {
      question: 'What ticket options are available?',
      answer: 'We offer a range of ticket options, including Standard ($299), VIP ($699), Full Access Pass ($1199), Exclusive Access ($2499), Student ($149), and Virtual ($99) tickets. Each tier offers different levels of access and benefits.'
    },
    {
      question: 'Can I transfer my ticket to someone else?',
      answer: 'Tickets are non-transferable. If you are unable to attend, please contact our support team for assistance. We may be able to offer a refund or credit for future events depending on the circumstances.'
    },
    {
      question: 'Will there be virtual participation?',
      answer: 'Yes! For those who can\'t attend in person, we offer a Virtual Ticket ($99). This provides access to live-streamed sessions, workshops, interactive Q&A with speakers, and virtual networking opportunities online.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="section-padding bg-dark-900">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-500 font-semibold text-lg">Everything You Need to Know</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>

        {/* FAQ Items */}
        <div ref={ref} className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-dark-800 rounded-xl border border-dark-700 overflow-hidden transition-all duration-500 ${
                  openIndex === index ? 'border-primary-500' : 'hover:border-primary-500/50'
                } ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-dark-700 transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDownIcon 
                    className={`h-6 w-6 text-primary-500 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-8 pb-6">
                    <div className="border-t border-dark-600 pt-6">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="bg-dark-800 rounded-2xl p-8 border border-dark-700 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Our team is here to help. Reach out to us for any additional information about the AI Summit 2025.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:contact@aivent.com" 
                className="btn-primary"
              >
                Contact Support
              </a>
              <a 
                href="#venue" 
                className="btn-secondary"
              >
                View Venue Info
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
