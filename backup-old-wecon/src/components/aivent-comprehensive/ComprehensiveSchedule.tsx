'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User } from 'lucide-react';

export default function ComprehensiveSchedule() {
  const [activeDay, setActiveDay] = useState(0);

  const days = [
    { name: 'Day 1', date: 'Oct 1, 2025' },
    { name: 'Day 2', date: 'Oct 2, 2025' },
    { name: 'Day 3', date: 'Oct 3, 2025' },
    { name: 'Day 4', date: 'Oct 4, 2025' },
    { name: 'Day 5', date: 'Oct 5, 2025' }
  ];

  const scheduleData = [
    [
      {
        time: '08:00 – 10:00 AM',
        speaker: 'Joshua Henry',
        role: 'AI Research Lead, DeepTech Labs',
        title: 'Opening Keynote – The State of AI 2025',
        description: 'Kick off the event with an insightful overview of where artificial intelligence is headed.'
      },
      {
        time: '12:00 – 14:00 PM',
        speaker: 'Leila Zhang',
        role: 'VP of Machine Learning, Google',
        title: 'Building Human-Centered AI Products',
        description: 'This session covers how to design AI solutions that prioritize usability, fairness, and real-world impact.'
      }
    ]
  ];

  return (
    <section 
      id="section-schedule"
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)'
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 mb-6 rounded-full glass-effect border border-white/20"
          >
            <span className="text-indigo-300 text-sm font-medium tracking-wider uppercase">
              Event Schedule
            </span>
          </motion.div>
          
          <h2 className="text-display text-4xl md:text-5xl font-bold text-white mb-6">
            5 Days of <span className="gradient-text">AI Excellence</span>
          </h2>
        </motion.div>

        {/* Day Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {days.map((day, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveDay(index)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeDay === index
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'glass-effect text-white/70 hover:text-white border border-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <div className="font-bold">{day.name}</div>
                <div className="text-sm opacity-80">{day.date}</div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Schedule Content */}
        <motion.div
          key={activeDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {(scheduleData[activeDay] || scheduleData[0]).map((session, index) => (
            <motion.div
              key={index}
              className="glass-effect p-6 rounded-2xl border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span className="text-white font-semibold">{session.time}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-white font-semibold">{session.speaker}</div>
                    <div className="text-white/60 text-sm">{session.role}</div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <h3 className="text-white font-bold mb-2">{session.title}</h3>
                  <p className="text-white/70 text-sm">{session.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
