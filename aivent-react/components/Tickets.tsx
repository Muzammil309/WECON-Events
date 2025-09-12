'use client'

import { useInView } from 'react-intersection-observer'
import { CheckIcon } from '@heroicons/react/24/outline'

const Tickets = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const tickets = [
    {
      name: 'Standard',
      price: '$299',
      period: 'October 1 to 5 - 10:00 AM',
      features: [
        'Access to keynotes and sessions.',
        'Admission to exhibitions and demos.',
        'Networking opportunities.',
        'Digital materials and session recordings.'
      ],
      popular: false
    },
    {
      name: 'VIP',
      price: '$699',
      period: 'October 1 to 5 - 10:00 AM',
      features: [
        'All Standard benefits.',
        'VIP lounge access and exclusive events.',
        'Front-row seating and priority workshop access.',
        'VIP swag bag and exclusive content.'
      ],
      popular: false
    },
    {
      name: 'Full Access',
      price: '$1199',
      period: 'October 1 to 5 - 10:00 AM',
      features: [
        'All VIP benefits.',
        'Access to all workshops and breakout sessions.',
        'Personalized session scheduling.',
        'Speaker meet-and-greet and after-party access.'
      ],
      popular: true
    },
    {
      name: 'Exclusive Access',
      price: '$2499',
      period: 'October 1 to 5 - 10:00 AM',
      features: [
        'All Full Access Pass benefits.',
        'Private one-on-one sessions with speakers.',
        'Priority access to all events and workshops.',
        'Exclusive VIP gala and after-party invitations.'
      ],
      popular: false
    },
    {
      name: 'Student',
      price: '$149',
      period: 'October 1 to 5 - 10:00 AM',
      features: [
        'Access to keynotes and workshops.',
        'Student-specific networking events.',
        'Discounted online resources post-event.',
        'Special student meetups for networking.'
      ],
      popular: false
    },
    {
      name: 'Virtual',
      price: '$99',
      period: 'October 1 to 5 - 10:00 AM',
      features: [
        'Live-streamed keynotes and workshops.',
        'On-demand access to recorded sessions.',
        'Interactive Q&A with speakers.',
        'Virtual networking and digital swag.'
      ],
      popular: false
    }
  ]

  return (
    <section id="tickets" className="section-padding bg-dark-900">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-500 font-semibold text-lg">Ticket Options</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-6">
            Choose Your <span className="gradient-text">Pass</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Select the perfect ticket for your needs and gain access to exclusive sessions, workshops, and more.
          </p>
        </div>

        {/* Tickets Grid */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map((ticket, index) => (
            <div
              key={index}
              className={`relative bg-dark-800 rounded-2xl p-8 border transition-all duration-500 card-hover ${
                ticket.popular 
                  ? 'border-primary-500 bg-gradient-to-b from-primary-500/10 to-dark-800' 
                  : 'border-dark-700 hover:border-primary-500'
              } ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Popular Badge */}
              {ticket.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-accent-400 to-accent-600 text-dark-900 px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Ticket Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">{ticket.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold gradient-text">{ticket.price}</span>
                </div>
                <p className="text-gray-400 text-sm">{ticket.period}</p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <ul className="space-y-4">
                  {ticket.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center mt-0.5">
                        <CheckIcon className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button 
                className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  ticket.popular
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white transform hover:scale-105'
                    : 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white'
                }`}
              >
                Buy Ticket
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">
            All tickets include access to networking events and digital materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#venue" className="btn-secondary">
              View Venue Details
            </a>
            <a href="#faq" className="btn-primary">
              Have Questions?
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Tickets
