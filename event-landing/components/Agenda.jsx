import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Clock, MapPin, User } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

const Agenda = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const agendaData = {
    day1: [
      {
        time: '9:00 AM',
        title: 'Opening Keynote: The Future of AI',
        speaker: 'Dr. Sarah Chen',
        location: 'Main Auditorium',
        description: 'Exploring the transformative potential of artificial intelligence in the next decade.',
        type: 'keynote'
      },
      {
        time: '10:30 AM',
        title: 'Workshop: Machine Learning Fundamentals',
        speaker: 'Prof. Michael Rodriguez',
        location: 'Workshop Room A',
        description: 'Hands-on introduction to ML algorithms and practical applications.',
        type: 'workshop'
      },
      {
        time: '2:00 PM',
        title: 'Panel: Startup Ecosystem Trends',
        speaker: 'Various Industry Leaders',
        location: 'Conference Hall B',
        description: 'Discussion on current trends and future opportunities in the startup world.',
        type: 'panel'
      },
      {
        time: '4:00 PM',
        title: 'Networking Session',
        speaker: 'All Attendees',
        location: 'Networking Lounge',
        description: 'Connect with fellow innovators and industry professionals.',
        type: 'networking'
      }
    ],
    day2: [
      {
        time: '9:00 AM',
        title: 'Blockchain Revolution',
        speaker: 'Alex Thompson',
        location: 'Main Auditorium',
        description: 'Understanding the impact of blockchain technology on various industries.',
        type: 'keynote'
      },
      {
        time: '11:00 AM',
        title: 'Workshop: Web3 Development',
        speaker: 'Emma Wilson',
        location: 'Tech Lab',
        description: 'Building decentralized applications with modern tools and frameworks.',
        type: 'workshop'
      },
      {
        time: '2:30 PM',
        title: 'Investor Pitch Session',
        speaker: 'Selected Startups',
        location: 'Pitch Arena',
        description: 'Promising startups present their innovations to potential investors.',
        type: 'pitch'
      },
      {
        time: '5:00 PM',
        title: 'Evening Gala',
        speaker: 'All Attendees',
        location: 'Grand Ballroom',
        description: 'Celebration dinner with awards ceremony and entertainment.',
        type: 'social'
      }
    ],
    day3: [
      {
        time: '9:30 AM',
        title: 'Sustainable Technology',
        speaker: 'Dr. Lisa Park',
        location: 'Main Auditorium',
        description: 'How technology can drive environmental sustainability and social impact.',
        type: 'keynote'
      },
      {
        time: '11:30 AM',
        title: 'Workshop: Green Tech Solutions',
        speaker: 'Environmental Tech Team',
        location: 'Innovation Lab',
        description: 'Developing technology solutions for environmental challenges.',
        type: 'workshop'
      },
      {
        time: '2:00 PM',
        title: 'Closing Ceremony',
        speaker: 'Event Organizers',
        location: 'Main Auditorium',
        description: 'Wrap-up session with key takeaways and future announcements.',
        type: 'ceremony'
      }
    ]
  }

  const getTypeColor = (type) => {
    const colors = {
      keynote: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      workshop: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      panel: 'bg-green-500/20 text-green-300 border-green-500/30',
      networking: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      pitch: 'bg-red-500/20 text-red-300 border-red-500/30',
      social: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      ceremony: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    }
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <section id="agenda" className="section-padding">
      <div className="container-custom">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-purple-400 font-semibold text-lg">Event Schedule</span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2 mb-6">
              Three Days of <span className="gradient-text">Innovation</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Carefully curated sessions designed to inspire, educate, and connect 
              the global technology community.
            </p>
          </motion.div>

          {/* Agenda Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="day1" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-800/50">
                <TabsTrigger value="day1" className="text-lg">Day 1</TabsTrigger>
                <TabsTrigger value="day2" className="text-lg">Day 2</TabsTrigger>
                <TabsTrigger value="day3" className="text-lg">Day 3</TabsTrigger>
              </TabsList>

              {Object.entries(agendaData).map(([day, sessions]) => (
                <TabsContent key={day} value={day} className="space-y-6">
                  <div className="grid gap-6">
                    {sessions.map((session, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className="group"
                      >
                        <Card className="glass-effect border-slate-700 hover:border-purple-500/50 transition-all duration-300">
                          <CardHeader className="pb-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                  <div className="flex items-center gap-2 text-purple-400">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-semibold">{session.time}</span>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(session.type)}`}>
                                    {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                                  </span>
                                </div>
                                <CardTitle className="text-xl md:text-2xl text-white group-hover:text-purple-300 transition-colors">
                                  {session.title}
                                </CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-gray-300 mb-4 text-base">
                              {session.description}
                            </CardDescription>
                            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{session.speaker}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{session.location}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Agenda
