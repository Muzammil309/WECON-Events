'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Calendar, Clock, MapPin, User, Coffee, Presentation } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const scheduleData = [
  {
    day: 'day1',
    date: 'October 1, 2025',
    dayName: 'Day 1',
    subtitle: 'Opening & Keynotes',
    sessions: [
      {
        time: '09:00 - 09:30',
        title: 'Registration & Welcome Coffee',
        type: 'break',
        location: 'Main Lobby',
        icon: Coffee
      },
      {
        time: '09:30 - 10:30',
        title: 'Opening Keynote: The Future of AI',
        speaker: 'Dr. Sarah Chen',
        type: 'keynote',
        location: 'Main Auditorium',
        icon: Presentation
      },
      {
        time: '10:45 - 11:45',
        title: 'Machine Learning in Healthcare',
        speaker: 'Prof. Michael Rodriguez',
        type: 'presentation',
        location: 'Hall A',
        icon: User
      },
      {
        time: '12:00 - 13:00',
        title: 'Lunch & Networking',
        type: 'break',
        location: 'Exhibition Hall',
        icon: Coffee
      },
      {
        time: '13:00 - 14:00',
        title: 'AI Ethics and Responsible Development',
        speaker: 'Dr. Aisha Patel',
        type: 'panel',
        location: 'Main Auditorium',
        icon: User
      }
    ]
  },
  {
    day: 'day2',
    date: 'October 2, 2025',
    dayName: 'Day 2',
    subtitle: 'Workshops & Deep Dives',
    sessions: [
      {
        time: '09:00 - 10:30',
        title: 'Deep Learning Workshop',
        speaker: 'Dr. Lisa Wang',
        type: 'workshop',
        location: 'Workshop Room 1',
        icon: Presentation
      },
      {
        time: '10:45 - 12:15',
        title: 'Computer Vision Applications',
        speaker: 'James Thompson',
        type: 'workshop',
        location: 'Workshop Room 2',
        icon: Presentation
      },
      {
        time: '12:15 - 13:15',
        title: 'Lunch Break',
        type: 'break',
        location: 'Exhibition Hall',
        icon: Coffee
      },
      {
        time: '13:15 - 14:45',
        title: 'Natural Language Processing',
        speaker: 'Prof. Michael Rodriguez',
        type: 'workshop',
        location: 'Workshop Room 1',
        icon: Presentation
      },
      {
        time: '15:00 - 16:30',
        title: 'AI in Business Panel',
        type: 'panel',
        location: 'Main Auditorium',
        icon: User
      }
    ]
  },
  {
    day: 'day3',
    date: 'October 3, 2025',
    dayName: 'Day 3',
    subtitle: 'Innovation & Future',
    sessions: [
      {
        time: '09:00 - 10:00',
        title: 'Startup Pitch Competition',
        type: 'presentation',
        location: 'Main Auditorium',
        icon: Presentation
      },
      {
        time: '10:15 - 11:15',
        title: 'The Future of AGI',
        speaker: 'Dr. Sarah Chen',
        type: 'keynote',
        location: 'Main Auditorium',
        icon: Presentation
      },
      {
        time: '11:30 - 12:30',
        title: 'AI Innovation Awards',
        type: 'presentation',
        location: 'Main Auditorium',
        icon: User
      },
      {
        time: '12:30 - 13:30',
        title: 'Closing Lunch & Networking',
        type: 'break',
        location: 'Exhibition Hall',
        icon: Coffee
      }
    ]
  }
]

const getSessionTypeColor = (type: string) => {
  switch (type) {
    case 'keynote':
      return 'from-indigo-500 to-purple-500'
    case 'workshop':
      return 'from-green-500 to-emerald-500'
    case 'panel':
      return 'from-orange-500 to-red-500'
    case 'presentation':
      return 'from-blue-500 to-cyan-500'
    case 'break':
      return 'from-gray-500 to-gray-600'
    default:
      return 'from-indigo-500 to-purple-500'
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
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="schedule" className="section-padding relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
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
            Summit{' '}
            <span className="aivent-text-gradient">Schedule</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive 3-day program featuring keynotes, workshops, 
            panels, and networking opportunities with industry leaders.
          </p>
        </motion.div>

        {/* Schedule Tabs */}
        <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
          <Tabs defaultValue="day1" className="w-full">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-slate-800/50 border border-slate-700 rounded-xl p-2">
              {scheduleData.map((day) => (
                <TabsTrigger
                  key={day.day}
                  value={day.day}
                  className="schedule-tab-aivent data-[state=active]:schedule-tab-active"
                >
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-1">{day.dayName}</h3>
                    <p className="text-sm opacity-80">{day.date}</p>
                    <p className="text-xs opacity-60">{day.subtitle}</p>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
            {scheduleData.map((day) => (
              <TabsContent key={day.day} value={day.day} className="mt-0">
                <div className="space-y-6">
                  {day.sessions.map((session, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex flex-col md:flex-row gap-6 p-6 card-aivent hover:border-cyan-500/50 transition-all duration-300"
                    >
                      {/* Time */}
                      <div className="md:w-48 flex-shrink-0">
                        <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
                          <Clock className="w-4 h-4" />
                          {session.time}
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Session Icon */}
                          <div className={`w-12 h-12 bg-gradient-to-r ${getSessionTypeColor(session.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <session.icon className="w-6 h-6 text-white" />
                          </div>

                          {/* Session Info */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {session.title}
                            </h3>
                            
                            {session.speaker && (
                              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                                <User className="w-4 h-4" />
                                <span className="font-medium">{session.speaker}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span>{session.location}</span>
                            </div>
                          </div>

                          {/* Session Type Badge */}
                          <div className={`px-3 py-1 bg-gradient-to-r ${getSessionTypeColor(session.type)} rounded-full text-xs font-semibold text-white uppercase tracking-wider`}>
                            {session.type}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
          <p className="text-gray-400 mb-6">
            Want to keep track of all sessions? Download the complete schedule.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-aivent-secondary"
          >
            Download Full Schedule
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}
