'use client'

import { useInView } from 'react-intersection-observer'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

const Venue = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const venueDetails = [
    {
      icon: MapPinIcon,
      title: 'Address',
      content: '121 AI Blvd, San Francisco, CA 94107'
    },
    {
      icon: PhoneIcon,
      title: 'Phone',
      content: 'Call: +1 123 456 789'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'contact@aivent.com'
    }
  ]

  return (
    <section id="venue" className="section-padding bg-dark-800">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-500 font-semibold text-lg">Event Location</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-6">
            Location & <span className="gradient-text">Venue</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join us in the heart of innovation at San Francisco Tech Pavilion—surrounded by top hotels, transit, and culture.
          </p>
        </div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Map */}
          <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="relative h-96 bg-dark-900 rounded-2xl overflow-hidden border border-dark-700">
              {/* Placeholder for Google Maps */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">San Francisco Tech Pavilion</h3>
                  <p className="text-gray-400">Interactive Map Coming Soon</p>
                </div>
              </div>
              
              {/* Map overlay with venue marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-primary-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Venue Information */}
          <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="space-y-8">
              {venueDetails.map((detail, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-6 p-6 bg-dark-900 rounded-xl border border-dark-700 hover:border-primary-500 transition-all duration-300 ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
                  style={{ transitionDelay: `${index * 0.2}s` }}
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <detail.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{detail.title}</h3>
                    <p className="text-gray-300 text-lg">{detail.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Venue Info */}
            <div className="mt-12 p-6 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-xl border border-primary-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Venue Highlights</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>State-of-the-art conference facilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>High-speed WiFi and live streaming capabilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>Multiple breakout rooms and networking spaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>On-site catering and refreshment areas</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>Accessible parking and public transportation</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center lg:text-left">
              <a href="#tickets" className="btn-primary">
                Get Directions & Tickets
              </a>
            </div>
          </div>
        </div>

        {/* Transportation Info */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-dark-900 rounded-xl border border-dark-700">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Parking</h3>
            <p className="text-gray-400 text-sm">Complimentary valet parking available for all attendees</p>
          </div>

          <div className="text-center p-6 bg-dark-900 rounded-xl border border-dark-700">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Public Transit</h3>
            <p className="text-gray-400 text-sm">2 blocks from BART station, multiple bus lines nearby</p>
          </div>

          <div className="text-center p-6 bg-dark-900 rounded-xl border border-dark-700">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Hotels</h3>
            <p className="text-gray-400 text-sm">Partner hotels within walking distance, special rates available</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Venue
