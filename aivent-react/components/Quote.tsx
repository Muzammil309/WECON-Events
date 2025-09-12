'use client'

import { useInView } from 'react-intersection-observer'
import { QuoteIcon } from '@heroicons/react/24/solid'

const Quote = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="section-padding bg-dark-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div ref={ref} className="max-w-4xl mx-auto text-center">
          {/* Quote Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mb-8 transition-all duration-1000 ${
            inView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            <QuoteIcon className="h-10 w-10 text-white" />
          </div>

          {/* Quote Text */}
          <blockquote className={`text-2xl md:text-3xl lg:text-4xl font-light text-gray-200 leading-relaxed mb-8 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '0.2s' }}>
            "Artificial intelligence is advancing rapidly, and while it offers immense opportunity, it also poses significant risks. If not properly regulated and aligned with human values, AI could become a fundamental threat to civilization."
          </blockquote>

          {/* Author */}
          <div className={`transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '0.4s' }}>
            <cite className="text-xl font-semibold gradient-text not-italic">
              Elon Musk
            </cite>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center items-center mt-12 space-x-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary-500"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary-500"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Quote
