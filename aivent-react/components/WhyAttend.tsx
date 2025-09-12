'use client'

import { useInView } from 'react-intersection-observer'
import { 
  LightBulbIcon, 
  WrenchScrewdriverIcon, 
  UsersIcon, 
  RocketLaunchIcon, 
  BriefcaseIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline'

const WhyAttend = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const benefits = [
    {
      icon: LightBulbIcon,
      title: 'Cutting-Edge Knowledge',
      description: 'Stay ahead of the curve with insights from AI leaders shaping tomorrow\'s technology.'
    },
    {
      icon: WrenchScrewdriverIcon,
      title: 'Hands-On Learning',
      description: 'Join live workshops and labs to build practical skills in AI and machine learning.'
    },
    {
      icon: UsersIcon,
      title: 'Global Networking',
      description: 'Meet developers, founders, and researchers from around the world to collaborate and grow.'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Startup Showcase',
      description: 'Explore the latest AI tools and ideas from promising startups and research labs.'
    },
    {
      icon: BriefcaseIcon,
      title: 'AI Career Boost',
      description: 'Access exclusive job fairs, mentorship sessions, and recruiting events to grow your career.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Ethics & Future',
      description: 'Engage in vital conversations around AI ethics, policy, and the future of intelligence.'
    }
  ]

  return (
    <section id="why-attend" className="section-padding bg-dark-900">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-500 font-semibold text-lg">Why Attend</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-6">
            What You'll <span className="gradient-text">Gain</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Hear from global AI pioneers, industry disruptors, and bold thinkers shaping the future across every domain.
          </p>
        </div>

        {/* Benefits Grid */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group bg-dark-800 rounded-2xl p-8 border border-dark-700 hover:border-primary-500 transition-all duration-500 card-hover ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {benefit.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a href="#tickets" className="btn-primary text-lg px-10 py-4">
            Secure Your Spot
          </a>
        </div>
      </div>
    </section>
  )
}

export default WhyAttend
