'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, User, Calendar } from 'lucide-react';

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  speaker?: string;
  location: string;
  type: 'keynote' | 'workshop' | 'panel' | 'networking' | 'break';
  description?: string;
}

interface ScheduleDay {
  date: string;
  day: string;
  sessions: ScheduleItem[];
}

interface ScheduleSectionProps {
  subtitle?: string;
  title?: string;
  description?: string;
  schedule?: ScheduleDay[];
}

const defaultSchedule: ScheduleDay[] = [
  {
    date: "October 1",
    day: "Day 1",
    sessions: [
      {
        id: '1',
        time: '09:00 AM',
        title: 'Opening Keynote: The Future of AI',
        speaker: 'Dr. Sarah Chen',
        location: 'Main Auditorium',
        type: 'keynote',
        description: 'Exploring the transformative potential of artificial intelligence in the next decade.'
      },
      {
        id: '2',
        time: '10:30 AM',
        title: 'Coffee Break & Networking',
        location: 'Exhibition Hall',
        type: 'break'
      },
      {
        id: '3',
        time: '11:00 AM',
        title: 'Machine Learning in Healthcare',
        speaker: 'Dr. Emily Watson',
        location: 'Room A',
        type: 'workshop',
        description: 'Hands-on workshop on implementing ML solutions for medical diagnosis.'
      },
      {
        id: '4',
        time: '02:00 PM',
        title: 'AI Ethics Panel Discussion',
        speaker: 'Multiple Speakers',
        location: 'Main Auditorium',
        type: 'panel',
        description: 'Discussing the ethical implications and responsible development of AI systems.'
      }
    ]
  },
  {
    date: "October 2",
    day: "Day 2",
    sessions: [
      {
        id: '5',
        time: '09:00 AM',
        title: 'Deep Learning Fundamentals',
        speaker: 'Michael Rodriguez',
        location: 'Room B',
        type: 'workshop',
        description: 'Comprehensive introduction to neural networks and deep learning architectures.'
      },
      {
        id: '6',
        time: '11:00 AM',
        title: 'Startup Pitch Competition',
        location: 'Main Auditorium',
        type: 'keynote',
        description: 'AI startups present their innovative solutions to industry experts.'
      },
      {
        id: '7',
        time: '03:00 PM',
        title: 'Networking Lunch',
        location: 'Rooftop Terrace',
        type: 'networking'
      }
    ]
  },
  {
    date: "October 3",
    day: "Day 3",
    sessions: [
      {
        id: '8',
        time: '09:00 AM',
        title: 'AI in Enterprise',
        speaker: 'David Kim',
        location: 'Room A',
        type: 'keynote',
        description: 'Implementing AI solutions at scale in enterprise environments.'
      },
      {
        id: '9',
        time: '11:00 AM',
        title: 'Computer Vision Workshop',
        speaker: 'Dr. Lisa Johnson',
        location: 'Lab 1',
        type: 'workshop',
        description: 'Building computer vision applications with modern frameworks.'
      },
      {
        id: '10',
        time: '04:00 PM',
        title: 'Closing Ceremony',
        location: 'Main Auditorium',
        type: 'keynote',
        description: 'Wrap-up and key takeaways from the summit.'
      }
    ]
  }
];

export default function ScheduleSection({
  subtitle = "[ Event Schedule ]",
  title = "Three Days of Innovation",
  description = "Explore our comprehensive schedule featuring keynotes, workshops, panels, and networking opportunities.",
  schedule = defaultSchedule
}: ScheduleSectionProps) {
  const [activeDay, setActiveDay] = useState(0);

  const getTypeColor = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'keynote': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'workshop': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'panel': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'networking': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'break': return 'bg-gradient-to-r from-gray-500 to-gray-600';
      default: return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    }
  };

  const getTypeLabel = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'keynote': return 'Keynote';
      case 'workshop': return 'Workshop';
      case 'panel': return 'Panel';
      case 'networking': return 'Networking';
      case 'break': return 'Break';
      default: return 'Session';
    }
  };

  return (
    <section id="section-schedule" className="section bg-surface-primary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-surface-secondary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6">
            {subtitle}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            {title}
          </h2>
          
          <p className="text-lg text-text-secondary leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Day Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <div className="flex bg-surface-secondary rounded-xl p-2 border border-border-primary">
            {schedule.map((day, index) => (
              <button
                key={index}
                onClick={() => setActiveDay(index)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeDay === index
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'
                }`}
              >
                <div className="text-sm">{day.day}</div>
                <div className="text-xs opacity-75">{day.date}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Schedule Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              {schedule[activeDay]?.sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-surface-secondary border border-border-primary rounded-xl p-6 hover:bg-surface-tertiary transition-colors duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Time */}
                    <div className="flex items-center gap-2 text-accent-blue font-semibold min-w-[120px]">
                      <Clock className="w-4 h-4" />
                      {session.time}
                    </div>

                    {/* Session Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xl font-semibold text-text-primary">
                          {session.title}
                        </h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(session.type)}`}>
                          {getTypeLabel(session.type)}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-text-secondary mb-3">
                        {session.speaker && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {session.speaker}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {session.location}
                        </div>
                      </div>

                      {session.description && (
                        <p className="text-text-secondary leading-relaxed">
                          {session.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Download Schedule Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="btn btn-primary">
            <Calendar className="w-4 h-4" />
            Download Full Schedule
          </button>
        </motion.div>
      </div>
    </section>
  );
}
