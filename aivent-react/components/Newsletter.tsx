'use client'

import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isOptedIn, setIsOptedIn] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && isOptedIn) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section className="section-padding bg-dark-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div ref={ref} className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className={`mb-12 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="text-primary-500 font-semibold text-lg">Stay in the Loop</span>
            <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-6">
              Join the Future of <span className="gradient-text">Innovation</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Making better things takes time. Drop us your email to stay in the know as we work to reduce our environmental impact. We'll share other exciting news and exclusive offers, too.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.2s' }}>
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                {/* Email Input */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 bg-dark-900 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!email || !isOptedIn}
                    className="btn-primary px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    SIGN UP
                  </button>
                </div>

                {/* Opt-in Checkbox */}
                <div className="mb-6">
                  <label className="flex items-start gap-3 text-left max-w-lg mx-auto cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isOptedIn}
                      onChange={(e) => setIsOptedIn(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary-500 bg-dark-900 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="text-gray-300 text-sm">
                      Keep me updated on other news and exclusive offers
                    </span>
                  </label>
                </div>

                {/* Privacy Note */}
                <p className="text-gray-400 text-sm max-w-lg mx-auto">
                  Note: You can opt-out at any time. See our{' '}
                  <a href="#" className="text-primary-500 hover:text-primary-400 transition-colors">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-500 hover:text-primary-400 transition-colors">
                    Terms
                  </a>
                  .
                </p>
              </form>
            ) : (
              /* Success Message */
              <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 border border-primary-500/30 rounded-2xl p-8 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Thank you!</h3>
                <p className="text-gray-300">
                  You've successfully subscribed to our newsletter. We'll keep you updated with the latest AI Summit news and exclusive offers.
                </p>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className={`mt-16 grid md:grid-cols-3 gap-8 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.4s' }}>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Early Access</h3>
              <p className="text-gray-400 text-sm">Be the first to know about speaker announcements and schedule updates</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Exclusive Discounts</h3>
              <p className="text-gray-400 text-sm">Receive special pricing on tickets and partner offers</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Premium Content</h3>
              <p className="text-gray-400 text-sm">Access to exclusive interviews and behind-the-scenes content</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
