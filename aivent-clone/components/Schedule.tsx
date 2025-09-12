'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Calendar, Clock, MapPin, User, Coffee, Presentation, Users2, Lightbulb } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ScheduleItem } from '@/types'

const scheduleData: { [key: string]: ScheduleItem[] } = {
  day1: [
    {
      id: '1',
      time: '09:00 AM',
      title: 'Registration & Welcome Coffee',
      description: 'Check-in, networking, and welcome refreshments',
      type: 'break',
      duration: 60,
      location: 'Main Lobby'
    },
    {
      id: '2',
      time: '10:00 AM',
      title: 'Opening Keynote: The Future of AI',
      description: 'A comprehensive overview of AI trends and future directions',
      speaker: {
        id: '1',
        name: 'Dr. Sarah Chen',
        title: 'Chief AI Scientist',
        company: 'Google DeepMind',
        bio: '',
        image: '',
        social: {}
      },
      type: 'keynote',
      duration: 60,
      location: 'Main Auditorium'
    },
    {
      id: '3',
      time: '11:15 AM',
      title: 'Machine Learning in Healthcare',
      description: 'Exploring AI applications in medical diagnosis and treatment',
      speaker: {
        id: '2',
        name: 'Prof. Michael Rodriguez',
        title: 'Director of AI Research',
        company: 'MIT CSAIL',
        bio: '',
        image: '',
        social: {}
      },
      type: 'workshop',
      duration: 90,
      location: 'Workshop Room A'
    },
    {
      id: '4',
      time: '01:00 PM',
      title: 'Lunch & Networking',
      description: 'Enjoy lunch while connecting with fellow attendees',
      type: 'break',
      duration: 60,
      location: 'Exhibition Hall'
    },
    {
      id: '5',
      time: '02:15 PM',
      title: 'AI Ethics Panel Discussion',
      description: 'Addressing the ethical implications of AI development',
      speaker: {
        id: '3',
        name: 'Dr. Aisha Patel',
        title: 'VP of AI Ethics',
        company: 'OpenAI',
        bio: '',
        image: '',
        social: {}
      },
      type: 'panel',
      duration: 75,
      location: 'Panel Room'
    },
    {
      id: '6',
      time: '04:00 PM',
      title: 'Startup Showcase',
      description: 'Innovative AI startups present their solutions',
      type: 'networking',
      duration: 90,
      location: 'Innovation Hub'
    }
  ],
  day2: [
    {
      id: '7',
      time: '09:00 AM',
      title: 'Deep Learning Fundamentals',
      description: 'Hands-on workshop covering neural network architectures',
      speaker: {
        id: '4',
        name: 'James Thompson',
        title: 'CEO & Founder',
        company: 'Neural Dynamics',
        bio: '',
        image: '',
        social: {}
      },
      type: 'workshop',
      duration: 120,
      location: 'Tech Lab 1'
    },
    {
      id: '8',
      time: '11:30 AM',
      title: 'Natural Language Processing Advances',
      description: 'Latest developments in NLP and conversational AI',
      speaker: {
        id: '5',
        name: 'Dr. Lisa Wang',
        title: 'Head of AI Research',
        company: 'Microsoft Research',
        bio: '',
        image: '',
        social: {}
      },
      type: 'keynote',
      duration: 60,
      location: 'Main Auditorium'
    },
    {
      id: '9',
      time: '01:00 PM',
      title: 'Lunch & Exhibition',
      description: 'Explore the latest AI tools and technologies',
      type: 'break',
      duration: 90,
      location: 'Exhibition Hall'
    },
    {
      id: '10',
      time: '02:30 PM',
      title: 'Computer Vision Applications',
      description: 'Real-world applications of computer vision technology',
      speaker: {
        id: '6',
        name: 'Dr. Robert Kim',
        title: 'Principal Scientist',
        company: 'Tesla AI',
        bio: '',
        image: '',
        social: {}
      },
      type: 'workshop',
      duration: 90,
      location: 'Tech Lab 2'
    },
    {
      id: '11',
      time: '04:30 PM',
      title: 'Industry Leaders Panel',
      description: 'CEOs and CTOs discuss AI adoption strategies',
      type: 'panel',
      duration: 75,
      location: 'Panel Room'
    }
  ],
  day3: [
    {
      id: '12',
      time: '09:00 AM',
      title: 'AI in Autonomous Systems',
      description: 'Exploring self-driving cars and robotics',
      type: 'keynote',
      duration: 60,
      location: 'Main Auditorium'
    },
    {
      id: '13',
      time: '10:30 AM',
      title: 'Building AI Products',
      description: 'From research to production: scaling AI solutions',
      type: 'workshop',
      duration: 90,
      location: 'Workshop Room B'
    },
    {
      id: '14',
      time: '12:30 PM',
      title: 'Networking Lunch',
      description: 'Final networking opportunity with speakers and attendees',
      type: 'break',
      duration: 90,
      location: 'Rooftop Terrace'
    },
    {
      id: '15',
      time: '02:00 PM',
      title: 'Future of Work with AI',
      description: 'How AI will transform the workplace',
      type: 'panel',
      duration: 75,
      location: 'Panel Room'
    },
    {
      id: '16',
      time: '03:30 PM',
      title: 'Closing Keynote & Awards',
      description: 'Summit wrap-up and innovation awards ceremony',
      type: 'keynote',
      duration: 60,
      location: 'Main Auditorium'
    }
  ]
}

const getSessionIcon = (type: string) => {
  switch (type) {
    case 'keynote':
      return Presentation
    case 'workshop':
      return Lightbulb
    case 'panel':
      return Users2
    case 'break':
      return Coffee
    case 'networking':
      return Users2
    default:
      return Calendar
  }
}

const getSessionColor = (type: string) => {
  switch (type) {
    case 'keynote':
      return 'from-purple-500 to-indigo-500'
    case 'workshop':
      return 'from-blue-500 to-cyan-500'
    case 'panel':
      return 'from-green-500 to-teal-500'
    case 'break':
      return 'from-orange-500 to-red-500'
    case 'networking':
      return 'from-pink-500 to-rose-500'
    default:
      return 'from-gray-500 to-slate-500'
  }
}

export default function Schedule() {
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
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section id="schedule" className="section-padding relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container-custom relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-white/20 mb-6"
          >
            <Calendar className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium text-gray-300">Event Schedule</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Three Days of{' '}
            <span className="aivent-text-gradient">Innovation</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Immerse yourself in cutting-edge AI research, hands-on workshops, 
            and networking opportunities across three action-packed days.
          </p>
        </motion.div>

        {/* Schedule Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="day1" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass-effect border border-white/10 bg-transparent h-14">
              <TabsTrigger 
                value="day1" 
                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-semibold"
              >
                Day 1 - March 15
              </TabsTrigger>
              <TabsTrigger 
                value="day2"
                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-semibold"
              >
                Day 2 - March 16
              </TabsTrigger>
              <TabsTrigger 
                value="day3"
                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-semibold"
              >
                Day 3 - March 17
              </TabsTrigger>
            </TabsList>

            {Object.entries(scheduleData).map(([day, sessions]) => (
              <TabsContent key={day} value={day} className="mt-8">
                <div className="space-y-6">
                  {sessions.map((session, index) => {
                    const Icon = getSessionIcon(session.type)
                    const colorClass = getSessionColor(session.type)
                    
                    return (
                      <motion.div
                        key={session.id}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="glass-effect rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          {/* Time & Icon */}
                          <div className="flex items-center gap-4 md:w-48 flex-shrink-0">
                            <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="text-lg font-bold text-white">
                                {session.time}
                              </div>
                              <div className="text-sm text-gray-400">
                                {session.duration} min
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {session.title}
                            </h3>
                            <p className="text-gray-300 mb-3">
                              {session.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              {session.speaker && (
                                <div className="flex items-center gap-2 text-purple-300">
                                  <User className="w-4 h-4" />
                                  <span>{session.speaker.name}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span>{session.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span>{session.duration} minutes</span>
                              </div>
                            </div>
                          </div>

                          {/* Session Type Badge */}
                          <div className="md:w-24 flex-shrink-0">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${colorClass} capitalize`}>
                              {session.type}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Download Schedule CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block glass-effect rounded-2xl p-8 border border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Download Full Schedule
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Get the complete event schedule with detailed session descriptions, 
              speaker bios, and venue maps.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
            >
              Download PDF
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
