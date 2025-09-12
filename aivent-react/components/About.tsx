'use client'

import { useInView } from 'react-intersection-observer'
import { CalendarDaysIcon, UserGroupIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline'

const About = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: CalendarDaysIcon,
      title: '5 days of keynotes, workshops, and networking',
      description: 'Immerse yourself in comprehensive learning experiences'
    },
    {
      icon: UserGroupIcon,
      title: '50 world-class speakers',
      description: 'Learn from industry leaders and AI pioneers'
    },
    {
      icon: PresentationChartLineIcon,
      title: 'Startup showcase and live demos',
      description: 'Discover cutting-edge AI innovations and technologies'
    }
  ]

  return (
    <section id="about" className="section-padding bg-dark-800">
      <div className="container-custom">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="mb-6">
              <span className="text-primary-500 font-semibold text-lg">About the Event</span>
              <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-6">
                A Global Gathering of{' '}
                <span className="gradient-text">AI Innovators</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-4 transition-all duration-1000 ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
                  style={{ transitionDelay: `${index * 0.2}s` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* Main Circle */}
              <div className="w-80 h-80 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full opacity-40"></div>
                <div className="absolute inset-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full opacity-60"></div>
                <div className="absolute inset-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full opacity-80"></div>
                
                {/* Center Content */}
                <div className="absolute inset-16 bg-dark-900 rounded-full flex items-center justify-center border-2 border-primary-500">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">AI</div>
                    <div className="text-sm text-gray-400">Summit</div>
                    <div className="text-sm text-gray-400">2025</div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-8 bg-accent-500 rounded-full animate-float"></div>
                <div className="absolute top-1/4 right-0 transform translate-x-4 w-6 h-6 bg-primary-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/4 left-0 transform -translate-x-4 w-10 h-10 bg-primary-600 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-0 right-1/4 transform translate-y-4 w-7 h-7 bg-accent-400 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
